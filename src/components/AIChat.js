import { useState, useRef, useEffect } from "react";
import { TextField, Button, Paper, CircularProgress, Box } from "@mui/material";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function AIChat() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

//   const genAiKey = process.env.REACT_APP_GEMINI_API_KEY;
  const genAiKey = "AIzaSyCR8d9YQd3yb0sJ4bhwcUpDLYMAw03sgm8";
  const genAI = new GoogleGenerativeAI(genAiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    <Paper elevation={3} sx={{ height: "94vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {messages.map((msg, index) => (
          <Box key={index} sx={{ 
            bgcolor: msg.role === "user" ? "primary.light" : "grey.200", 
            p: 1.5, 
            my: 1, 
            borderRadius: 2,
            textAlign: msg.role === "user" ? "right" : "left"
          }}>
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
                }
              }}
            />
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 2, borderTop: "1px solid #ddd" }}>
        <TextField
          fullWidth
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask something..."
          variant="outlined"
        />
        <Button variant="contained" onClick={handleSend} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Send"}
        </Button>
      </Box>
    </Paper>
  );
}
