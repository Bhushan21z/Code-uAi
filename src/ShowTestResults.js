import React from 'react';

const ShowTestResults = ({ style, handleSubmit }) => {
  const testResults = [
    { id: 1, name: "Test Case 1", status: "passed", message: "Successfully completed" },
    { id: 2, name: "Test Case 2", status: "failed", message: "Expected 5 but got 3" },
    { id: 3, name: "Test Case 3", status: "passed", message: "Successfully completed" },
  ];

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
        <h3 style={{ marginBottom: '20px', color: '#fff' }}>Test Results</h3>
        <button
          onClick={handleSubmit}
          style={{
            padding: '5px 15px',
            margin: '9px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
           }}
        >
          Close
        </button>
      </div>
      {testResults.map((test) => (
        <div
          key={test.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            marginBottom: '10px',
            backgroundColor: '#2a2a2a',
            borderRadius: '4px',
            borderLeft: `4px solid ${test.status === 'passed' ? '#4CAF50' : '#f44336'}`
          }}
        >
          <div style={{ marginRight: '15px', fontSize: '20px' }}>
            {test.status === 'passed' ? 
              <span style={{ color: '#4CAF50' }}>✓</span> : 
              <span style={{ color: '#f44336' }}>✗</span>
            }
          </div>
          
          <div>
            <div style={{ 
              fontWeight: 'bold',
              marginBottom: '5px'
            }}>
              {test.name}
            </div>
            <div style={{ 
              fontSize: '0.9em',
              color: '#888'
            }}>
              {test.message}
            </div>
          </div>
        </div>
      ))}

      <div style={{
        marginTop: '20px',
        padding: '10px',
        borderTop: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>
          Total Tests: {testResults.length}
        </span>
        <span style={{ color: '#4CAF50' }}>
          Passed: {testResults.filter(t => t.status === 'passed').length}
        </span>
        <span style={{ color: '#f44336' }}>
          Failed: {testResults.filter(t => t.status === 'failed').length}
        </span>
      </div>
    </div>
  );
};

export default ShowTestResults;
