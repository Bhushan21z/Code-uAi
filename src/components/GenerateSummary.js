import { GoogleGenerativeAI } from "@google/generative-ai";

const GenerateSummary = async (challengeData, submittedCode, starterTemplate, promptsData) => {
  const genAiKey = "AIzaSyCR8d9YQd3yb0sJ4bhwcUpDLYMAw03sgm8";
  const genAI = new GoogleGenerativeAI(genAiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemPrompt = `
You are an advanced AI code analyst and learning progress evaluator. Your task is to provide a comprehensive, multi-dimensional analysis of a coding challenge attempt.

Challenge Context:
1. Challenge Details:
   - Problem Description: ${challengeData.description}
   - Learning Goals: ${challengeData.learningGoals.join(", ")}

2. Submitted Code Analysis:
   Starter Template Code:
   ${JSON.stringify(starterTemplate)}

   User Submitted Code:
   ${JSON.stringify(submittedCode)}

3. AI Interaction History:
   Total Prompts Used: ${promptsData.length}
   Prompt Details: ${promptsData.map(p => p.type).join(", ")}

Comprehensive Analysis Requested:

A. Code Quality Assessment:
   - Analyze code structure, readability, and best practices
   - Identify potential improvements and optimization opportunities
   - Evaluate code complexity and maintainability
   - Check for proper error handling and edge case management

B. Functional Requirements Evaluation:
   - Percentage of functional requirements met
   - Specific requirements fulfilled or missed
   - Depth of implementation for each requirement

C. Learning Progress Metrics:
   - Complexity of initial vs final solution
   - Concepts demonstrated in the code
   - Learning curve and skill progression
   - Key skills applied from challenge learning goals

D. AI Interaction Insights:
   - Types of AI prompts used (debug, explain, generate)
   - Frequency of AI assistance
   - Learning support effectiveness
   - Knowledge transfer quality

E. Performance and Optimization:
   - Code efficiency analysis
   - Potential performance bottlenecks
   - Scalability considerations
   - Comparison with optimal solution

F. Visualization and Scoring:
   - Generate a comprehensive scoring system
   - Create radar/spider chart of skills
   - Provide percentage-based evaluations

Return the result in a detailed, structured JSON format with rich insights:

{
  "overallScore": 85,
  "codeQuality": {
    "score": 80,
    "strengths": ["Clean structure", "Good naming conventions"],
    "improvements": ["Add more comments", "Reduce complexity"]
  },
  "functionalRequirements": {
    "completionPercentage": 90,
    "fulfilledRequirements": ["User authentication", "Form validation"],
    "missedRequirements": ["Advanced error handling"]
  },
  "learningProgress": {
    "skillsLearned": ["React hooks", "State management"],
    "progressIndicator": 75,
    "conceptsMastered": ["Component composition", "Event handling"]
  },
  "aiInteractionSummary": {
    "totalPrompts": 5,
    "promptTypes": ["debugging", "code generation", "explanation"],
    "learningEffectiveness": 85
  },
  "performanceInsights": {
    "codeEfficiency": 75,
    "potentialOptimizations": ["Memoization", "Reduced re-renders"]
  },
  "skillRadarData": {
    "reactProficiency": 80,
    "stateManagement": 70,
    "componentDesign": 85,
    "errorHandling": 60
  },
  "recommendations": [
    "Focus on improving error handling",
    "Explore advanced React patterns",
    "Practice code optimization techniques"
  ]
}

Provide a comprehensive, insightful, and constructive analysis that supports the learner's growth.`;

  try {
    const result = await model.generateContent(systemPrompt);
    let rawText = result.response.text().trim();

    if (rawText.startsWith("```json") && rawText.endsWith("```")) {
      rawText = rawText.slice(7, -3).trim();
    }

    const parsedSummary = JSON.parse(rawText);
    return parsedSummary;
  } catch (error) {
    console.error("Error generating summary:", error);
    return {
      error: "Failed to generate summary",
      details: error.message
    };
  }
};

export default GenerateSummary;
