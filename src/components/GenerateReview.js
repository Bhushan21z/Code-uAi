const { GoogleGenerativeAI } = require("@google/generative-ai");

const GenerateReview = async (challengeData, submittedCode) => {
  const genAiKey = "AIzaSyCR8d9YQd3yb0sJ4bhwcUpDLYMAw03sgm8";
  const genAI = new GoogleGenerativeAI(genAiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemPrompt = `
You are a senior frontend code reviewer. A candidate has submitted code for a challenge. Your task is to:
1. Do a quick review of the code.
2. Identify 3-4 key observations about what they did well or where they can improve.

Do not evaluate test cases, just review the structure, logic, and style of the code.

Here is the challenge description:
${challengeData.description}

Submitted Code:
${JSON.stringify(submittedCode)}

Return a plain JSON array of review points like:
[
  "Good use of reusable components.",
  "Needs better error handling in form submission.",
  "CSS styling could be more modular."
]
  `;

  const result = await model.generateContent(systemPrompt);
  let rawText = result.response.text().trim();

  if (rawText.startsWith("```json") && rawText.endsWith("```")) {
    rawText = rawText.slice(7, -3).trim();
  }

  return JSON.parse(rawText);
};

export default GenerateReview;
