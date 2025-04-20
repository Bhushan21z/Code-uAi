import { GoogleGenerativeAI } from "@google/generative-ai";

const GenerateSummary = async (challengeData, submittedCode, starterTemplate, promptsData) => {
  const genAiKey = "AIzaSyCR8d9YQd3yb0sJ4bhwcUpDLYMAw03sgm8";
  const genAI = new GoogleGenerativeAI(genAiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemPrompt = `
    You are an advanced AI code assessment engine for a learning platform. Provide a detailed, structured evaluation of a coding challenge submission with the following data format:

    Required Evaluation Format:
    {
      "overallScore": number (0-100),
      "codeQuality": {
        "score": number (0-100),
        "strengths": string[] (specific code examples),
        "improvements": string[] (actionable suggestions)
      },
      "functionalRequirements": {
        "completionPercentage": number (0-100),
        "fulfilledRequirements": string[] (exact features implemented),
        "missedRequirements": string[] (exact features missing)
      },
      "learningProgress": {
        "skillsLearned": string[] (specific technologies/concepts),
        "progressIndicator": number (0-100),
        "TimeProgress": { "time": string("5 mins"), "progress": number }[] (time-based progress)
      },
      "aiInteractionSummary": {
        "totalPrompts": number,
        "interactionScores": { "name": string, "score": number }[] (cognitive skills)
      },
      "performanceInsights": {
        "codeEfficiency": number (0-100),
        "potentialOptimizations": string[] (specific techniques),
        "scalability": string (qualitative assessment),
        "performanceMetrics": { "name": string, "value": number }[]
      },
      "skillRadarData": [
        { "subject": string, "A": number, "fullMark": 100 } (6-8 key skills)
      ],
      "recommendations": string[] (prioritized next steps),
      "categoryScores": [
        { "name": string, "value": number } (5-7 key categories)
      ]
    }

    Evaluation Guidelines:

    1. Code Quality Analysis:
    - Use concrete examples from the code (e.g., "Clean useState implementation in App.js")
    - Highlight both architectural and implementation-level qualities
    - Provide specific, actionable improvement suggestions
    - Consider: readability, maintainability, best practices, error handling

    2. Functional Requirements:
    - List exact requirements met/missed from the challenge specs
    - Calculate percentage based on core functionality
    - Note partially implemented features separately

    3. Learning Progress:
    - Identify specific skills demonstrated in the code
    - Track progress timeline with milestones
    - Relate to the challenge's learning objectives
    - Assess conceptual understanding beyond just completion

    4. AI Interaction:
    - Analyze prompt types and frequency
    - Evaluate problem-solving approaches
    - Score cognitive dimensions: problem diagnosis, decomposition, etc.

    5. Performance:
    - Assess both current efficiency and scalability
    - Suggest concrete optimization techniques
    - Include relevant metrics for the tech stack

    6. Scoring:
    - Use consistent 0-100 scale across all metrics
    - Ensure scores reflect real-world proficiency levels
    - Balance strictness with encouragement

    7. Recommendations:
    - Prioritize by impact and learning value
    - Mix quick wins with longer-term goals
    - Include both technical and conceptual next steps

    Input Data:
    - Challenge Description: ${challengeData.description}
    - Learning Objectives: ${challengeData.learningGoals.join(", ")}
    - Starter Code: ${JSON.stringify(starterTemplate)}
    - Submitted Solution: ${JSON.stringify(submittedCode)}
    - AI Interaction History: ${promptsData.length} prompts (${promptsData.map(p => p.type).join(", ")})

    Deliverables:
    1. Comprehensive evaluation in exact specified JSON format
    2. Specific code references for all assessments
    3. Balanced perspective highlighting strengths and growth areas
    4. Professional, constructive tone focused on learning
    5. Technically accurate recommendations for the stack
    6. Clear progression path from current to next skill level

    Additional Requirements:
    - Never include markdown syntax in the output
    - Output must be valid JSON parsable as-is
    - Use double quotes consistently
    - Omit any explanatory text outside the JSON structure
    - Ensure all scores are properly calibrated (70 = good, 80 = very good, 90+ = excellent)
    - Include 4-6 items in each array for balance
    `;

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
