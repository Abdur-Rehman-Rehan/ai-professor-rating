import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Step 2: Define the system prompt
const systemPrompt = `
# Rate My Professor Agent System Prompt

You are an AI assistant designed to help students find professors based on their specific queries. Your primary function is to use retrieval-augmented generation (RAG) to provide information about the top 3 most relevant professors for each user question.

## Example:

Query: I'm looking for a professor who teaches physics with a rating greater than 2 stars.
`;

// Step 3: Create the POST function
export async function POST(req) {
  try {
    const data = await req.json();
    const text = data[data.length - 1].content;

    // Initialize Google Gemini
    const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Generate content without the taskType
    const model = gemini.getGenerativeModel({ model: "text-embedding-004" });
    const contentResult = await model.embedContent(text);
    const embedding = contentResult.embedding;

    // Debugging: Check embedding vector
    console.log("Embedding vector length:", embedding.values.length);
    console.log("Embedding vector sample:", embedding.values.slice(0, 10));

    // Initialize Pinecone
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    const index = pc.index("rag").namespace("ns1");

    // Query Pinecone with the embedding
    const results = await index.query({
      topK: 3,
      includeMetadata: true,
      vector: embedding.values,
    });

    // Debugging: Log the results from Pinecone
    console.log("Pinecone query results:", results);

    if (!results.matches.length) {
      return NextResponse.json({ message: "No relevant professors found." });
    }

    // Build result string with proper formatting
    let resultString = "";
    results.matches.forEach((match) => {
      resultString += `
      Professor: ${match.metadata.name || "N/A"}
      Review: ${match.metadata.review || "No review available"}
      Subject: ${match.metadata.subject || "Unknown"}
      Stars: ${match.metadata.stars || "N/A"}
      **Rating:** ⭐${"⭐".repeat(match.metadata.stars || 0)} (${
        match.metadata.stars || 0
      }/5)
      \n\n`;
    });

    // Generate a response based on Pinecone query results
    const model_gen = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
    const gen_result = await model_gen.generateContent(
      `${systemPrompt}\nQuery: ${text}\nResults:\n${resultString}`
    );
    const stream = await gen_result.response.text();

    return new NextResponse(stream);
  } catch (error) {
    console.error("Error in POST:", error);

    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }
}
