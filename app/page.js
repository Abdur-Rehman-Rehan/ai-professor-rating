"use client";

import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
    },
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // State for loading

  const sendMessage = async () => {
    if (!message.trim()) return; // Prevent sending empty messages

    setMessage("");
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);
    setLoading(true); // Start loading

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: message }]),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      const processText = async ({ done, value }) => {
        if (done) {
          setLoading(false); // Stop loading
          return;
        }
        const text = decoder.decode(value || new Uint8Array(), {
          stream: true,
        });
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          const otherMessages = prevMessages.slice(0, -1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
        result += text;
        return reader.read().then(processText);
      };

      await reader.read().then(processText);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again later.",
        },
      ]);
      setLoading(false); // Stop loading on error
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      backgroundColor="#212121"
    >
      <Stack
        direction="column"
        width="500px"
        height="700px"
        border="2px solid #047d57"
        borderRadius="20px"
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
        p={2}
        spacing={3}
        bgcolor="#303030"
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          padding="0 8px"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === "assistant" ? "flex-start" : "flex-end"
              }
            >
              <Box
                maxWidth="80%"
                bgcolor={
                  message.role === "assistant"
                    ? "primary.main"
                    : "secondary.main"
                }
                color="white"
                borderRadius={8}
                p="20px"
                sx={{ whiteSpace: "pre-line", wordWrap: "break-word" }}
              >
                {message.content.split("\n").map((line, i) => (
                  <Typography
                    key={i}
                    variant="body2"
                    sx={{
                      marginBottom:
                        i < message.content.split("\n").length - 1 ? 1 : 0,
                    }}
                  >
                    {line}
                  </Typography>
                ))}
              </Box>
            </Box>
          ))}
          {loading && (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress />
            </Box>
          )}
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading} // Disable input while loading
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={loading} // Disable button while loading
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
