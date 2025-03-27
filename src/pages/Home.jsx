import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function HomePage() {
  // const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const googleClientId = "798578132639-o2jejbp39242as0m4v8mfvdhhm4irru7.apps.googleusercontent.com"; 
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const onSuccess = (credentialResponse) => {
    const idToken = credentialResponse.credential;

    if (idToken) {
      const decodedToken = JSON.parse(atob(idToken.split('.')[1]));
      setIsLoggedIn(true);
    } else {
      console.error("ID token not found in credential response.");
    }
  };

  const onError = () => {
    console.error("Google Sign-In Failed");
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(to right, #0f0c29, #302b63, #24243e)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          color: "white",
        }}
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(90deg, #ff8a00, #e52e71)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
            }}
          >
            Code-uAi
          </Typography>
          <Typography variant="h5" sx={{ maxWidth: "600px", mx: "auto", mb: 4 }}>
            Your Frontend Coding Assessment Platform
          </Typography>

          <Box sx={{ mb: 4 }}>
            {["React", "Vue", "Angular", "Svelte", "Static"].map((lang) => (
              <Box
                key={lang}
                sx={{
                  display: "inline-block",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "20px",
                  px: 3,
                  py: 1,
                  mx: 1,
                  fontSize: "18px",
                }}
              >
                {lang}
              </Box>
            ))}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            {isLoggedIn ? (
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "#ff8a00",
                  borderRadius: "30px",
                  padding: "12px 24px",
                  fontSize: "18px",
                  "&:hover": { backgroundColor: "#e52e71" },
                }}
                onClick={() => navigate("/challenges")}
              >
                View Challenges
              </Button>
            ) : (
              <GoogleLogin onSuccess={onSuccess} onError={onError} width="250" />
            )}
          </Box>

          <Typography variant="body1" sx={{ mt: 2 }}>
            Compile your code in real-time, leverage AI for debugging and test cases, and receive instant result summaries.
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Optimize performance, resolve errors efficiently, and enhance your coding skills with AI-driven insights.
          </Typography>
        </motion.div>
      </Box>
    </GoogleOAuthProvider>
  );
}
