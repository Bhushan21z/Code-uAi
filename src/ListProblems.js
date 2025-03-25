import React from "react";
import PROBLEM_DATA from './ReactProblemsData';

const ListProblems = ({ handleShowProblems, onFinishChallenge }) => {
  const challengeKeys = Object.keys(PROBLEM_DATA);

  return (
    <div style={{ 
      flex: 1, 
      overflow: 'auto',
      backgroundColor: '#1a1a1a',
      height: '100%',
      padding: '10px'
    }}>
      <div style={{ padding: '10px', color: 'white' }}>
        <h3>Available Challenges</h3>
        {challengeKeys.map((challengeKey) => {
          const challenge = PROBLEM_DATA[challengeKey];
          return (
            <button
              key={challengeKey}
              onClick={() => handleShowProblems(challengeKey)}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: '#6851ff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#5a46db'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#6851ff'}
            >
              {challenge.title}
            </button>
          );
        })}
      </div>
      <button
        onClick={onFinishChallenge}
        style={{
          width: '100%',
          padding: '10px',
          marginTop: '20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
      >
        Finish Challenge
      </button>
    </div>
  );
};

export default ListProblems;
