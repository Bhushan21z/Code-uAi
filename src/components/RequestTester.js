import React, { useState } from 'react';
import CODE_TEMPLATES from '../Constants/challengesCodeTemplates.json';
import axios from 'axios';

function RequestTester({problemKey}) {
  const [url, setUrl] = useState('/your-endpoint');
  const [method, setMethod] = useState('POST');
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState('{\n  "key": "value"\n}');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const serverUrl = 'http://localhost:5000';

  const fetchUserCodeforServer = () => {
    const storedCode = localStorage.getItem(`userCode-${problemKey}`);
    const files = storedCode ? JSON.parse(storedCode) : CODE_TEMPLATES[problemKey]?.files;
  
    if (!files) return null;
  
    return {
      project: Object.fromEntries(
        Object.entries(files).map(([filePath, { code }]) => [
          filePath.replace("/", ""), // Remove leading slash
          filePath.endsWith(".json") ? JSON.parse(code) : code,
        ])
      ),
    };
  }

  const frameRequestBody = () => {
    const projectFiles = fetchUserCodeforServer()?.project;
    if (!projectFiles) return null;
    const objectToReturn = {
      containerId: localStorage.getItem(`containerId-${problemKey}`),
      method,
      route: url,
      project_files: projectFiles,
    }

    return objectToReturn;
  }

  const handleSendRequest = async () => {
    try {
      setLoading(true);
      const reqBody = frameRequestBody();
      const res = await axios.post(`${serverUrl}/execute`, reqBody);
      
      const contentType = res.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = await res.text();
      }
      
      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries([...res.headers.entries()]),
        data
      });
    } catch (error) {
      setResponse({
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '10px', height: '100%', overflow: 'auto', backgroundColor: '#1e1e1e', color: '#ffffff' }}>
      <h3>API Request Tester</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>URL:</label>
        <input 
          type="text" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: '100%', padding: '5px', backgroundColor: '#2d2d2d', color: '#ffffff', border: '1px solid #444' }}
        />
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Method:</label>
        <select 
          value={method} 
          onChange={(e) => setMethod(e.target.value)}
          style={{ width: '100%', padding: '5px', backgroundColor: '#2d2d2d', color: '#ffffff', border: '1px solid #444' }}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Headers (JSON):</label>
        <textarea 
          value={headers} 
          onChange={(e) => setHeaders(e.target.value)}
          style={{ width: '100%', height: '80px', padding: '5px', backgroundColor: '#2d2d2d', color: '#ffffff', border: '1px solid #444' }}
        />
      </div>
      
      {method !== 'GET' && (
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Body:</label>
          <textarea 
            value={body} 
            onChange={(e) => setBody(e.target.value)}
            style={{ width: '100%', height: '100px', padding: '5px', backgroundColor: '#2d2d2d', color: '#ffffff', border: '1px solid #444' }}
          />
        </div>
      )}
      
      <button 
        onClick={handleSendRequest}
        disabled={loading}
        style={{
          padding: '8px 15px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Sending...' : 'Send Request'}
      </button>
      
      {response && (
        <div style={{ marginTop: '20px' }}>
          <h4>Response:</h4>
          <div style={{ backgroundColor: '#2d2d2d', padding: '10px', borderRadius: '4px' }}>
            <p><strong>Status:</strong> {response.status} {response.statusText}</p>
            {response.error ? (
              <p><strong>Error:</strong> {response.error}</p>
            ) : (
              <>
                <p><strong>Headers:</strong></p>
                <pre style={{ maxHeight: '100px', overflow: 'auto' }}>
                  {JSON.stringify(response.headers, null, 2)}
                </pre>
                <p><strong>Body:</strong></p>
                <pre style={{ maxHeight: '200px', overflow: 'auto' }}>
                  {typeof response.data === 'object' 
                    ? JSON.stringify(response.data, null, 2) 
                    : response.data}
                </pre>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestTester;
