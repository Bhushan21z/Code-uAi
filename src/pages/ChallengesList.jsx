import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, Grid, CardMedia, CardContent, Typography, Chip, Button, Tabs, Tab } from "@mui/material";
import { motion } from "framer-motion";

export default function ChallengesList() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const userEmail = JSON.parse(localStorage.getItem('user')).email;
      const response = await fetch('http://localhost:5000/api/userChallenges/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });
      const data = await response.json();
      setChallenges(data.data);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #0f0c29, #302b63, #24243e)",
        color: "white",
        py: 6,
        px: { xs: 2, md: 6 },
      }}
    >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <Typography
          variant="h3"
          align="center"
          fontWeight="bold"
          sx={{
            background: "linear-gradient(90deg, #ff8a00, #e52e71)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 4,
          }}
        >
          Available Challenges
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {challenges.map((challenge) => {
            return (
              <Grid item xs={12} sm={6} md={4} key={challenge._id}>
                <Card
                  sx={{
                    backgroundColor: "#1e1e2f",
                    borderRadius: "15px",
                    overflow: "hidden",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  <CardMedia component="img" height="180" image={challenge.preview} alt={challenge.title} />
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="h5" fontWeight="bold" color="white" gutterBottom>
                      {challenge.title}
                      <Chip
                        label={challenge.difficulty}
                        size="small"
                        sx={{
                          backgroundColor:
                            challenge.difficulty === "Beginner" ? "#4caf50" :
                            challenge.difficulty === "Intermediate" ? "#ff9800" :
                            "#f44336",
                          color: "white",
                          fontWeight: "bold",
                          ml: 2,
                        }}
                      />
                    </Typography>

                    <Typography variant="body2" color="gray" mb={2}>
                      {challenge.description}
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2 }}>
                      {challenge.recommendedTechnologies.map((tech) => (
                        <Chip
                          key={tech}
                          label={tech}
                          sx={{
                            backgroundColor:
                              tech === "React" ? "#61dafb33" :
                              tech === "Vue" ? "#42b88333" :
                              tech === "Angular" ? "#dd003133" : "#333",
                            color: "#fff",
                          }}
                        />
                      ))}
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor:
                          challenge.status === "in-progress"
                            ? "#ff8a00"
                            : challenge.status === "result-generated"
                            ? "#4caf50"
                            : "#9e9e9e",
                        borderRadius: "30px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        "&:hover": {
                          backgroundColor:
                            challenge.status === "in-progress"
                              ? "#e52e71"
                              : challenge.status === "result-generated"
                              ? "#388e3c"
                              : "#9e9e9e",
                        },
                      }}
                      onClick={() => {
                        if (challenge.status === "in-progress") {
                          navigate(`/editor/${challenge.userChallengeId}`);
                        } else if (challenge.status === "result-generated") {
                          navigate(`/summary/${challenge.userChallengeId}`);
                        }
                      }}
                      disabled={challenge.status === "completed"}
                    >
                      {challenge.status === "in-progress"
                        ? "Load Challenge"
                        : challenge.status === "result-generated"
                        ? "Show Result"
                        : "Completed"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </motion.div>
    </Box>
  );
}
