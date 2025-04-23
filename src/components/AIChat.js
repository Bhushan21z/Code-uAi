import { useState, useRef, useEffect } from "react";
import { 
  TextField, 
  Button, 
  Paper, 
  CircularProgress, 
  Box, 
  Typography,
  IconButton,
  Tooltip,
  Divider,
  Avatar,
  Badge
} from "@mui/material";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Send,
  Code,
  ContentCopy,
  Check,
  Clear,
  SmartToy,
  Person
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

export default function AIChat({ chatKey, style }) {
  const theme = useTheme();
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isResetting, setIsResetting] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // System prompt for better coding responses
  const systemPrompt = `You are Code-uAi, an expert AI coding assistant. Follow these rules:
  - Provide clear, concise explanations
  - Format code properly with syntax highlighting
  - Offer multiple solutions when applicable
  - Explain complex concepts in simple terms
  - When asked about code, analyze it thoroughly
  - Suggest best practices and optimizations`;

  useEffect(() => {
    const storedMessages = localStorage.getItem(`chatHistory${chatKey}`);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, [chatKey]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chatHistory${chatKey}`, JSON.stringify(messages));
    }
  }, [chatKey, messages]);

  const genAiKey = "AIzaSyCR8d9YQd3yb0sJ4bhwcUpDLYMAw03sgm8";
  const genAI = new GoogleGenerativeAI(genAiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userMessage = { role: "user", text: userInput };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);
    inputRef.current.focus();

    try {
      // Combine system prompt with conversation history
      const conversation = [
        { role: "system", text: systemPrompt },
        ...newMessages.map(msg => ({ role: msg.role, text: msg.text }))
      ];
      
      const result = await model.generateContent({
        contents: conversation.map(msg => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        }))
      });
      
      const aiResponse = result?.response?.text() || "I couldn't generate a response. Please try again.";
      setMessages([...newMessages, { role: "ai", text: aiResponse }]);
    } catch (error) {
      console.error("Error generating AI response:", error);
      setMessages([...newMessages, { 
        role: "ai", 
        text: "Sorry, I encountered an error. Please try your request again." 
      }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const resetConversation = () => {
    setIsResetting(true);
    setTimeout(() => {
      setMessages([]);
      localStorage.removeItem(`chatHistory${chatKey}`);
      setIsResetting(false);
    }, 500);
  };

  const formatMessage = (text) => {
    // Add syntax highlighting for code blocks
    return text.replace(/```(\w+)?\n([\s\S]*?)\n```/g, (match, language, code) => {
      return `\`\`\`${language || ''}\n${code}\n\`\`\``;
    });
  };

  return (
    <Paper 
      elevation={6} 
      sx={{
        height: style?.height || "100%",
        display: "flex",
        flexDirection: "column",
        background: theme.palette.mode === 'dark' ? "#121212" : "#f5f5f5",
        borderRadius: 2,
        overflow: "hidden",
        ...style
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          p: 1, 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          bgcolor: theme.palette.mode === 'dark' ? "#1e1e1e" : "#2979ff",
          color: theme.palette.mode === 'dark' ? "#fff" : "#fff"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SmartToy sx={{ fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 300 }}>
            Code-uAi Assistant
          </Typography>
        </Box>
        <Tooltip title="Reset conversation">
          <IconButton
            onClick={resetConversation}
            disabled={isResetting || messages.length === 0}
            sx={{ color: theme.palette.mode === 'dark' ? "#fff" : "#fff" }}
          >
            {isResetting ? <CircularProgress size={24} /> : <Clear />}
          </IconButton>
        </Tooltip>
      </Box>

      <Divider />

      {/* Messages area */}
      <Box 
        sx={{ 
          flex: 1, 
          overflowY: "auto", 
          p: 2,
          bgcolor: theme.palette.mode === 'dark' ? "#121212" : "#f5f5f5",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: theme.palette.mode === 'dark' ? "#2d2d2d" : "#e0e0e0",
          },
          "&::-webkit-scrollbar-thumb": {
            background: theme.palette.mode === 'dark' ? "#555" : "#bdbdbd",
            borderRadius: "4px",
          },
        }}
      >
        {messages.length === 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              textAlign: "center",
              color: theme.palette.mode === 'dark' ? "#aaa" : "#666",
            }}
          >
            <SmartToy sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              How can I help you today?
            </Typography>
            <Typography variant="body2">
              Ask me about coding, debugging, or best practices.
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Try: "How do I fix this React error?" or "Explain closures in JavaScript"
            </Typography>
          </Box>
        )}

        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: msg.role === "user" ? "flex-end" : "flex-start",
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 0.5,
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: msg.role === "user" 
                    ? theme.palette.primary.main 
                    : theme.palette.secondary.main,
                }}
              >
                {msg.role === "user" ? <Person fontSize="small" /> : <SmartToy fontSize="small" />}
              </Avatar>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                {msg.role === "user" ? "You" : "Code-uAi"}
              </Typography>
            </Box>
            <Box
              sx={{
                maxWidth: "90%",
                position: "relative",
                p: 2,
                borderRadius: 2,
                bgcolor: msg.role === "user" 
                  ? theme.palette.primary.main 
                  : theme.palette.mode === 'dark' ? "#2d2d2d" : "#fff",
                color: msg.role === "user" ? "#fff" : theme.palette.text.primary,
                boxShadow: theme.shadows[1],
                border: msg.role === "user" 
                  ? "none" 
                  : `1px solid ${theme.palette.divider}`,
              }}
            >
              <ReactMarkdown
                children={formatMessage(msg.text)}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <Box sx={{ position: "relative" }}>
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            display: "flex",
                            gap: 1,
                            zIndex: 1,
                          }}
                        >
                          <Tooltip title="Copy code">
                            <IconButton
                              size="small"
                              onClick={() => copyToClipboard(String(children), index)}
                              sx={{
                                color: "#fff",
                                bgcolor: "rgba(0,0,0,0.2)",
                                "&:hover": { bgcolor: "rgba(0,0,0,0.3)" },
                              }}
                            >
                              {copiedIndex === index ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <SyntaxHighlighter
                          style={materialDark}
                          language={match[1]}
                          PreTag="div"
                          showLineNumbers
                          wrapLines
                          customStyle={{
                            margin: 0,
                            borderRadius: 4,
                            fontSize: "0.85rem",
                            background: "#1e1e1e",
                          }}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      </Box>
                    ) : (
                      <code
                        className={className}
                        style={{
                          background: theme.palette.mode === 'dark' ? "#2d2d2d" : "#f0f0f0",
                          padding: "0.2em 0.4em",
                          borderRadius: 3,
                          fontSize: "0.9em",
                          color: theme.palette.mode === 'dark' ? "#ff79c6" : "#d6336c",
                        }}
                        {...props}
                      >
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
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 2,
            }}
          >
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>

      {/* Input area */}
      <Box
        sx={{
          p: 2,
          bgcolor: theme.palette.mode === 'dark' ? "#1e1e1e" : "#fff",
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            inputRef={inputRef}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a coding question..."
            variant="outlined"
            multiline
            maxRows={4}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'dark' ? "#2d2d2d" : "#f5f5f5",
              },
              "& .MuiInputBase-input": {
                fontSize: "0.95rem",
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={loading || !userInput.trim()}
            sx={{
              minWidth: "auto",
              width: 48,
              height: 48,
              borderRadius: "50%",
              bgcolor: theme.palette.primary.main,
              "&:hover": { bgcolor: theme.palette.primary.dark },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              <Send />
            )}
          </Button>
        </Box>
        <Typography 
          variant="caption" 
          sx={{ 
            display: "block", 
            mt: 1, 
            textAlign: "center",
            color: theme.palette.text.secondary,
          }}
        >
          Code-uAi may produce inaccurate information. Verify critical code.
        </Typography>
      </Box>
    </Paper>
  );
}