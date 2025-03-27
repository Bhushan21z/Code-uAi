import React from 'react';
import { Box, Typography, Paper, Grid } from "@mui/material";
import { useParams } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

export default function SummaryDashboard() {
  const { key } = useParams();

  const summaryData = JSON.parse(localStorage.getItem(`testSummary${key}`)) || {};
  const testcasesData = JSON.parse(localStorage.getItem(`testcaseData${key}`)) || [];

  return (
    <Box sx={{ 
        background: "linear-gradient(to right, #0f0c29, #302b63, #24243e)",
        minHeight: "100vh",
        p: 3,
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        fontSize: '17px' 
      }}>
      <Typography
        variant="h4"
        sx={{ textAlign: "center", mt: 4, mb: 3, fontWeight: "bold", color: "#fff" }}
      >
        Summary Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ bgcolor: "#1E1E1E", p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{color:'#fff'}}>Overall Score</Typography>
            <Typography variant="h3" sx={{ fontWeight: "bold", color: "#4CAF50" }}>
              {summaryData.overallScore} %
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ bgcolor: "#1E1E1E", p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{color:'#fff'}}>Code Quality</Typography>
            <Typography variant="h3" sx={{ fontWeight: "bold", color: "#4CAF50" }}>
             {summaryData.codeQuality.score} %
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "#4CAF50" }}>Strengths:</Typography>
            <ul style={{ color: "#fff" }}>
              {summaryData.codeQuality.strengths.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <Typography variant="body2" sx={{ mt: 1, color: "#FF5252" }}>Improvements:</Typography>
            <ul style={{ color: "#fff" }}>
              {summaryData.codeQuality.improvements.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ bgcolor: "#1E1E1E", p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{color:'#fff'}}>Functional Completion</Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#4CAF50" }}>
              {summaryData.functionalRequirements.completionPercentage}%
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "#4CAF50" }}>Fulfilled:</Typography>
            <ul style={{ color: "#fff" }}>
              {summaryData.functionalRequirements.fulfilledRequirements.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <Typography variant="body2" sx={{ mt: 1, color: "#FF5252" }}>Missed:</Typography>
            <ul style={{ color: "#fff" }}>
              {summaryData.functionalRequirements.missedRequirements.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ bgcolor: "#1E1E1E", p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{color:'#fff'}}>Learning Progress</Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#4CAF50" }}>
              {summaryData.learningProgress.progressIndicator}%
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "#4CAF50" }}>Concepts Mastered:</Typography>
            <ul style={{ color: "#fff" }}>
              {summaryData.learningProgress.conceptsMastered.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ bgcolor: "#1E1E1E", p: 3, borderRadius: 2, mt: 3 }}>
        <Typography variant="h6" sx={{ textAlign: "center", mb: 2, color: '#fff' }}>Skill Radar</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={Object.entries(summaryData.skillRadarData).map(([key, value]) => ({
            skill: key,
            score: value
          }))}>
            <PolarGrid stroke="#fff" />
            <PolarAngleAxis dataKey="skill" stroke="#fff" />
            <Radar name="Skill Level" dataKey="score" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </Paper>

      <Paper sx={{ bgcolor: "#1E1E1E", p: 3, borderRadius: 2, mt: 3 }}>
        <Typography variant="h6" sx={{color:'#fff'}}>Test Case Results</Typography>
        {testcasesData.map((test, idx) => (
          <Paper key={idx} sx={{ p: 2, mt: 2, bgcolor: test.status === "passed" ? "#4CAF50" : "#FF5252", borderRadius: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#fff" }}>{test.name}: {test.status.toUpperCase()}</Typography>
            <Typography variant="body2" sx={{ color: "#fff" }}>{test.message}</Typography>
          </Paper>
        ))}
      </Paper>
    </Box>
  );
}
