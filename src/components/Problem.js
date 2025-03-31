import React from 'react';

const ProblemsComponent = ({ problem, problemKey }) => {

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '15px',
      backgroundColor: '#2a2a2a',
      height: '100vh',
      color: 'white',
      overflowY: 'auto',
      fontSize: '16px',
      maxHeight: '90vh',
    }}>
      <h2>{problem.title}</h2>
      
      <div style={{ marginTop: '10px' }}>
        <h3>Problem Description</h3>
        <p>{problem.description}</p>
      </div>

      {problemKey !== 'express-api' && (
        <div>
        {problem.preview && (
          <div style={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom: '15px' 
          }}>
            <img 
              src={problem.preview}
              alt={`${problem.title} Preview`} 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '300px', 
                borderRadius: '8px',
                objectFit: 'cover'
              }} 
            />
          </div>
        )}

        <div style={{ marginTop: '15px' }}>
          <h3>UI Requirements</h3>
          <ul>
            {problem.uiRequirements.map((requirement, index) => (
              <li key={index}>{requirement}</li>
            ))}
          </ul>
        </div>
      </div>
      )}

      <div style={{ marginTop: '15px' }}>
        <h3>Functional Requirements</h3>
        <ul>
          {problem.functionalRequirements.map((requirement, index) => (
            <li key={index}>{requirement}</li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '15px' }}>
        <h3>Learning Goals</h3>
        <ul>
          {problem.learningGoals.map((goal, index) => (
            <li key={index}>{goal}</li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '15px' }}>
        <h3>Test Cases</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {problem.testCases.map((testCase, index) => (
            <div 
              key={index} 
              style={{
                backgroundColor: '#3a3a3a',
                padding: '10px',
                borderRadius: '5px',
                flex: '1 1 calc(33.333% - 10px)',
                minWidth: '200px'
              }}
            >
              <strong>Scenario {index + 1}</strong>
              <p>Scenario: {testCase.scenario}</p>
              <p>Expected Behavior: {testCase.expectedBehavior}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '15px', marginBottom: '50px' }}>
        <h3>Recommended Technologies</h3>
        <ul>
          {problem.recommendedTechnologies.map((tech, index) => (
            <li key={index}>{tech}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProblemsComponent;
