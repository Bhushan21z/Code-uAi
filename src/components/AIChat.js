import { useState, useRef, useEffect } from "react";
import { TextField, Button, Paper, CircularProgress, Box, Typography } from "@mui/material";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function AIChat({ chatKey }) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedMessages = localStorage.getItem(`chatHistory${chatKey}`);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, [chatKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if(messages.length > 0){
      localStorage.setItem(`chatHistory${chatKey}`, JSON.stringify(messages));
    }
  }, [chatKey, messages]);

  const genAiKey = "AIzaSyCR8d9YQd3yb0sJ4bhwcUpDLYMAw03sgm8";
  const genAI = new GoogleGenerativeAI(genAiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { role: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);

    try {
      const result = await model.generateContent(userInput);
      const aiResponse = result?.response?.text() || "No response";
      setMessages([...newMessages, { role: "ai", text: aiResponse }]);
    } catch (error) {
      console.error("Error generating AI response:", error);
    }
    setLoading(false);
  };

  return (
    <Paper 
      elevation={6} 
      sx={{
        height: "94vh",
        display: "flex",
        flexDirection: "column",
        background: "#121212",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 2, textAlign: "center", bgcolor: "#1e1e1e" }}>
        <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600 }}>
          Code-uAi Chat
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", p: 2, bgcolor: "#ececec", fontSize: '14  px' }}>
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
              alignItems: "flex-start",
              mb: 1.5,
            }}
          >
            <Box
              sx={{
                maxWidth: "75%",
                p: 1.5,
                borderRadius: 2,
                bgcolor: msg.role === "user" ? "#2979ff" : "#424242",
                color: "#fff",
                textAlign: "left",
                boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.3)",
              }}
            >
              <ReactMarkdown
                children={msg.text}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={materialDark}
                        language={match[1]}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              />
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          p: 2,
          bgcolor: "#1e1e1e",
          borderTop: "1px solid #333",
        }}
      >
        <TextField
          fullWidth
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask something..."
          variant="outlined"
          sx={{
            bgcolor: "#282828",
            input: { color: "#fff" },
            borderRadius: 2,
            "& fieldset": { borderColor: "#555" },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={loading}
          sx={{
            bgcolor: "#2979ff",
            color: "#fff",
            borderRadius: 2,
            px: 2.5,
            "&:hover": { bgcolor: "#1c54b2" },
          }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Send"}
        </Button>
      </Box>
    </Paper>
  );
}
