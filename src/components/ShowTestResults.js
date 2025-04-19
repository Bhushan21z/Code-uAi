import React from 'react';

const ShowTestResults = ({ testSummary, stats, aiReviewPoints = [], style, handleClose }) => {
  return (
    <div style={{
      ...style,
      backgroundColor: '#1d1d1d',
      padding: '20px',
      borderRadius: '4px',
      color: 'white',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3 style={{ marginBottom: '20px' }}>Test Results</h3>
        <button onClick={handleClose} style={{
          padding: '5px 15px',
          margin: '9px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Close
        </button>
      </div>

      {testSummary.map((line, index) => (
        <div key={index} style={{
          padding: '10px',
          marginBottom: '8px',
          backgroundColor: '#2a2a2a',
          borderLeft: `4px solid ${line.includes('PASS') ? '#4CAF50' : '#f44336'}`
        }}>
          {line}
        </div>
      ))}

      <div style={{
        marginTop: '15px',
        padding: '10px',
        borderTop: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>Total Suites: {stats.totalSuites}</span>
        <span style={{ color: '#4CAF50' }}>Passed: {stats.passedSuites}</span>
        <span style={{ color: '#f44336' }}>Failed: {stats.totalSuites - stats.passedSuites}</span>
        <span>Tests Passed: {stats.passedTests}/{stats.totalTests}</span>
        <span>Time: {stats.time}</span>
      </div>

      {aiReviewPoints.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h4>🧠 Code Review Summary</h4>
          <ul>
            {aiReviewPoints.map((point, idx) => (
              <li key={idx} style={{ margin: '8px 0', color: '#ccc' }}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ShowTestResults;
