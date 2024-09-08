# AI Professor Rating Application

## Overview

The AI Professor Rating Application is designed to help users find relevant professors based on their specific queries using Retrieval-Augmented Generation (RAG). This application leverages the Gemini API for embedding generation and Pinecone for efficient similarity search.

### Access

The application is deployed and can be accessed at the following link:

[AI Professor Rating Application](https://professor-rating.rehantech.me/)

### Key Features

- **Retrieval-Augmented Generation (RAG):** Combines information retrieval and text generation to provide accurate responses to user queries.
- **Gemini API:** Utilized for generating text embeddings, which are essential for finding relevant professors.
- **Pinecone:** Manages and searches the vector embeddings for efficient retrieval of relevant professor information.

### How It Works

1. **User Query:** The user submits a query through the application interface.
2. **Embedding Generation:** The application uses the Gemini API to generate an embedding for the user's query.
3. **Vector Search:** The generated embedding is used to query the Pinecone index, which contains precomputed embeddings of professor reviews.
4. **Response Generation:** The application synthesizes a response using the top matching results from Pinecone and provides relevant professor recommendations.

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Abdur-Rehman-Rehan/ai-professor-rating
   cd card-gen
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Install Required Packages:**

   ```bash
   python Script/requirements.py
   ```

4. **Load Data and Configure Environment:**
Update the .env.local file with your Pinecone and Gemini API keys and run the load.py script to initialize the Pinecone index and process the review data.

    ```bash
    python Script/load.py
    ```

5. **Run the Next.js Application:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

Open <http://localhost:3000> with your browser to view the application.

### Documentation and Support

For more information on the technologies used in this project, you can refer to the following resources:

- **Gemini API Documentation:** Get detailed information about the Gemini API and how to use it for generating text embeddings.
  - [Gemini API Documentation](https://developers.google.com/generative-ai)

- **Pinecone Documentation:** Learn how to use Pinecone for vector search and managing vector indexes.
  - [Pinecone Documentation](https://docs.pinecone.io)

### Contributions

Contributions to the project are welcome!
