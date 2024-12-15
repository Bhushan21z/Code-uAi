import { OpenAI } from 'openai';

const GenerateResult = async (challengeData, submittedCode) => {
    const baseURL = "https://api.aimlapi.com/v1";
    const apiKey = process.env.OPENAI_API_KEY;
    console.log("API Key:", apiKey);

    const systemPrompt = `
    You are a highly skilled code evaluator, and your task is to analyze the following coding challenge and determine if all the test cases pass.
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
    ${submittedCode}

    Please evaluate the test cases and determine whether each test case passes or fails based on the submitted code. Provide a detailed message for each test case with a pass or fail status, and a message that describes the outcome.

    Return the result in the following format:
    [
      { id: 1, name: "Test Case 1", status: "passed", message: "Successfully completed" },
      { id: 2, name: "Test Case 2", status: "failed", message: "Expected 5 but got 3" },
      { id: 3, name: "Test Case 3", status: "passed", message: "Successfully completed" },
    ]
    `;

    const api = new OpenAI({
      apiKey,
      baseURL,
      dangerouslyAllowBrowser: true
    });

    const completion = await api.chat.completions.create({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content;
    
    console.log("AI Response:", response);

    return JSON.parse(response);
};

export default GenerateResult;
