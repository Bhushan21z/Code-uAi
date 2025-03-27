const { GoogleGenerativeAI } = require("@google/generative-ai");

const GenerateResult = async (challengeData, submittedCode) => {
  // const genAiKey = process.env.REACT_APP_GEMINI_API_KEY;
  const genAiKey = "AIzaSyCR8d9YQd3yb0sJ4bhwcUpDLYMAw03sgm8";
  const genAI = new GoogleGenerativeAI(genAiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemPrompt = `
  You are a highly skilled code evaluator, and your task is to analyze the following frontend coding challenge and determine if all the test cases pass.
  The challenge consists of the problem description, the UI and functional requirements, and the submitted code.
  Evaluate the test cases by running the code logic and providing an analysis for each test case.

  Here is the challenge data:
  Problem Description:
  ${challengeData.description}

  UI Requirements:
  ${challengeData.uiRequirements.join("\n")}

  Functional Requirements:
  ${challengeData.functionalRequirements.join("\n")}

  Learning Goals:
  ${challengeData.learningGoals.join("\n")}

  Test Cases:
  ${challengeData.testCases.map((testCase, index) => {
    return `Test Case ${index + 1}:
    Scenario: ${testCase.scenario}
    Expected Behavior: ${testCase.expectedBehavior}`;
  }).join("\n")}

  Now, here is the code submitted by the user:
  ${JSON.stringify(submittedCode)}

  Please evaluate the test cases and determine whether each test case passes or fails based on the submitted code. Provide a detailed message for each test case with a pass or fail status, and a message that describes the outcome.

  Return the result in the following format and message of just one line:
  [
    { id: 1, name: "Test Case 1", status: "passed", message: "Successfully completed" },
    { id: 2, name: "Test Case 2", status: "failed", message: "Expected 5 but got 3" },
    { id: 3, name: "Test Case 3", status: "passed", message: "Successfully completed" },
  ]
  `;


  const result = await model.generateContent(systemPrompt);
  let rawText = result.response.text().trim();

  if (rawText.startsWith("```json") && rawText.endsWith("```")) {
    rawText = rawText.slice(7, -3).trim();
  }
  const parsedObject = JSON.parse(rawText);

  return parsedObject;
};

export default GenerateResult;
