import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { 
  SandpackProvider, 
  SandpackLayout, 
  SandpackPreview,
  SandpackConsole,
  useSandpack
} from "@codesandbox/sandpack-react";
import { amethyst } from "@codesandbox/sandpack-themes";
import ShowTestResults from "../components/ShowTestResults";
import CODE_TEMPLATES from '../Constants/challengesCodeTemplates.json';
import PROBLEMS_DATA from "../Constants/challenges.json";
import AIChat from '../components/AIChat';
import ProblemsComponent from '../components/Problem';
import GenerateReview from '../components/GenerateReview';
import GenerateSummary from '../components/GenerateSummary';
import { Circles } from 'react-loader-spinner';
import { usePageLoader } from "../contexts/PageLoaderContext";

export default function VSEditor() {
  const { key } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState('react');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showProblem, setShowProblem] = useState(false);
  const [userCode, setUserCode] = useState({});
  const [currentProblem, setCurrentProblem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setLoading } = usePageLoader();
  const [error, setError] = useState(null);
  const [isTestsSet, setIsTestsSet] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [reviewPoints, setReviewPoints] = useState([]);
  const [vscodeUrl, setVscodeUrl] = useState('');
  const backendUrl = 'https://vsnode.paclabs.com';

  // Add this to your VSEditor component
  useEffect(() => {
    const initializeWorkspace = async () => {
      try {
        // Generate or get a unique user ID (you might use auth system in production)
        const projectTemplate = PROBLEMS_DATA[key].guthubLink;
        const userId = localStorage.getItem('userId') || `temp-${Date.now()}`;
        localStorage.setItem('userId', userId);
        
        const response = await fetch(`${backendUrl}/api/init-workspace`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, projectTemplate }),
        });
        
        const data = await response.json();
        if (data.success) {
          setVscodeUrl(data.vscodeUrl);
          console.log('Workspace initialized');
        }
      } catch (error) {
        console.error('Failed to initialize workspace:', error);
      }
    };

    initializeWorkspace();
  }, [key, vscodeUrl]);

  useEffect(() => {
    const setupTestsEnvironment = async () => {
      try {
        console.log('Setting up tests environment...');
        const userId = localStorage.getItem('userId');
        const response = await fetch(`${backendUrl}/api/build-docker-image/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (data.success) {
          setIsTestsSet(true);
          console.log('Tests environment setup:');
        }
      } catch (error) {
        console.error('Failed to setup tests environment:', error);
      }
    };

    setupTestsEnvironment();
  }, [key]);

  useEffect(() => {
    const fetchProjectFiles = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`${backendUrl}/api/project-files/${userId}`);
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
          return;
        }
        
        setUserCode(data.files);
        localStorage.setItem(`userCode-${key}`, JSON.stringify(data.files));
        setError(null);
      } catch (err) {
        setError('Failed to fetch project files');
        console.error('Error fetching files:', err);
      }
    };

    fetchProjectFiles();

    const pollInterval = setInterval(fetchProjectFiles, 5000);

    return () => clearInterval(pollInterval);
  }, [key]);

  useEffect(() => {
    setCurrentProblem(PROBLEMS_DATA[key]);
    localStorage.setItem(`problemData-${key}`, JSON.stringify(PROBLEMS_DATA[key]));
  }, [key]);

  const runTestcases = async () => {
    console.log('Running testcases...');
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`${backendUrl}/api/run-tests/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      console.log('Test Results:');
      setTestResults(data);
      setError(null);
    } catch (err) {
      setError('Failed to run testcases');
      console.error('Error running testcases:', err);
    }
  };

  const handleClose = () => {
    setIsSubmit(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!isSubmit) {
      await runTestcases();
      const challengeData = JSON.parse(localStorage.getItem(`problemData-${key}`));
      const resultData = await GenerateReview(challengeData, userCode);
      setReviewPoints(resultData);
    }
    setIsSubmit(!isSubmit);
    setIsLoading(false);
  };

  const handleTemplateChange = (e) => {
    setTemplate(e.target.value);
  };

  const handleShowProblem = (toggle) => {
    setShowProblem(toggle);
    const newProblemData = PROBLEMS_DATA[key];
    setCurrentProblem(newProblemData);
  };

  const destroyWorkspace = async () => {
    console.log('Destroying workspace...');
    const userId = localStorage.getItem('userId');
    const response = await fetch(`${backendUrl}/api/destroy-workspace/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (data.error) {
      setError(data.error);
      return;
    }
    console.log('Workspace destroyed');
  };

  const handleFinishChallenge = async () => {
    setLoading(true);
    const summaryResult = await GenerateSummary(
      currentProblem,
      userCode,
      PROBLEMS_DATA[key],
      JSON.parse(localStorage.getItem(`chatHistory${key}`)) || []
    );
    await runTestcases();
    const resultData = testResults;
    
    if(summaryResult && resultData){
      localStorage.setItem(`testSummary${key}`, JSON.stringify(summaryResult));
      localStorage.setItem(`testcaseData${key}`, JSON.stringify(resultData));
    } else if(summaryResult && !resultData) {
      localStorage.setItem(`testSummary${key}`, JSON.stringify(summaryResult));
    } else {
      alert('Error Generating your result Summary. Please Try Again.')
    }
    await destroyWorkspace();
    navigate(`/summary/${key}`); 
    setLoading(false);
  };

  return (
    <SandpackProvider
      key={key}
      theme={amethyst}
      template={template}
      files={userCode}
    >
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh'
      }}>
        <SandpackLayout style={{ flex: 1 }}>
        
          { !isFullScreen && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              flex: 1 
            }}>
              <div className="file-management"
                style={{
                  display: 'flex',
                  padding: '10px',
                  alignItems: 'center',
                  width: '60vw',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => handleShowProblem(!showProblem)}
                    style={{
                      padding: '5px 10px',
                      marginLeft: '50px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {showProblem ? 'Hide Challenge' : 'Show Challenge'}
                  </button>
                </div>
              </div>
              <div style={{ 
                display: 'flex', 
                flex: 1
              }}>
                {showProblem && (
                  <div style={{ 
                    width: '40%', 
                    overflowY: 'auto', 
                    backgroundColor: '#2a2a2a',
                    color: 'white',
                    padding: '15px'
                  }}>
                    <ProblemsComponent 
                      problem={currentProblem}
                      problemKey={key}
                      onFinishChallenge={handleFinishChallenge}
                    />
                  </div>
                )}
                
                <div style={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column' 
                }}>
                <div style={{ 
                  flex: 1, 
                  overflowY: 'auto', 
                  maxHeight: isSubmit ? '60vh' : '89vh',
                  paddingBottom: '10px',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <iframe 
                    src={vscodeUrl} 
                    title="VS Code Editor" 
                    className="vscode-frame"
                    allow="clipboard-read; clipboard-write"
                    style={{ flex: 1, width: '100%', border: 'none' }}
                  />
                </div>
                  <div
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'flex-end',
                      padding: '0 10px'
                    }}
                  >
                    {isLoading ? (
                      <div style={{ padding: '10px 15px', margin: '10px' }}>
                        <Circles
                          height="40"
                          width="40"
                          color="#4CAF50"
                          ariaLabel="circles-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                          visible={true}
                        />
                      </div>
                    ) : (
                      !isSubmit ? (
                        <div>
                          {isTestsSet && (
                            <button
                              onClick={handleSubmit}
                              style={{
                                padding: '10px 15px',
                                margin: '10px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              Run Tests
                            </button>
                          )}
                          <button
                            onClick={handleFinishChallenge}
                            style={{
                              padding: '10px 15px',
                              backgroundColor: '#4CAF50',
                              margin: '10px',
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
                      ) : (
                        <ShowTestResults
                          aiReviewPoints={reviewPoints}
                          testSummary={testResults?.summary || []}
                          stats={testResults?.stats || []}
                          handleClose={handleClose}
                          style={{
                            height: '100%',
                            width: '100%'
                          }}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ flex: 1 }}>
            <div
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '0 10px',
              }}
            >
              <div>
                <button
                  onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                  style={{
                    padding: '5px 15px',
                    margin: '10px',
                    backgroundColor: '#6851ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {isConsoleOpen ? 'Hide Console' : 'Show Console'}
                </button>
                <button
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  style={{
                    padding: '5px 15px',
                    margin: '10px',
                    backgroundColor: '#6851ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {isChatOpen ? 'Close Chat' : 'Chat with AI'}
                </button>
              </div>
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                style={{
                  padding: '7px 15px',
                  margin: '9px',
                  backgroundColor: '#6851ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
              </button>
            </div>

            {isChatOpen ? (
              <AIChat
                style={{ 
                  height: isConsoleOpen ? '55%' : '94%',
                  flex: 1
                }}
                chatKey={key}
              />
            ) : (
              <SandpackPreview
              style={{ 
                height: isConsoleOpen ? '55%' : '94%',
                flex: 1
              }}
              showOpenInCodeSandbox={false}
              showNavigator={true}
            />
            )}
            {isConsoleOpen && !isChatOpen && (
              <SandpackConsole style={{ height: '40%', backgroundColor: '#272729' }} />
            )}
          </div>
        </SandpackLayout>
      </div>
    </SandpackProvider>
  );
}
