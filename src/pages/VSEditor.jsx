import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { 
  SandpackProvider, 
  SandpackLayout, 
  SandpackPreview,
  SandpackConsole,
} from "@codesandbox/sandpack-react";
import { amethyst } from "@codesandbox/sandpack-themes";
import Split from 'react-split';
import ShowTestResults from "../components/ShowTestResults";
import AIChat from '../components/AIChat';
import ProblemsComponent from '../components/Problem';
import GenerateReview from '../components/GenerateReview';
import { Circles } from 'react-loader-spinner';
import RequestTester from '../components/RequestTester';
import { usePageLoader } from "../contexts/PageLoaderContext";
import './editor.css';

export default function VSEditor() {
  const { key } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState('react');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isProjectDirectorySet, setIsProjectDirectorySet] = useState(false);
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
  const [challengeType, setChallengeType] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const backendUrl = 'http://localhost:5000';

  useEffect(() => {
    const fetchProblem = async () => {
      const problem = await fetch(`${backendUrl}/api/challenges/userChallenge/${key}`);
      const data = await problem.json();
      const parsedData = data.data;
      setCurrentProblem(parsedData);
      setChallengeType(parsedData.type);
      localStorage.setItem('userId', key);
      if (localStorage.getItem(`timeLeft-${key}`)) {
        setTimeLeft(parseInt(localStorage.getItem(`timeLeft-${key}`)));
      } else {
        setTimeLeft(parseInt(parsedData.time * 60));
      }
    };
    fetchProblem();
  }, [key]);

  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft > 0) {
      localStorage.setItem(`timeLeft-${key}`, timeLeft.toString());
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 0) {
          clearInterval(timer);
          localStorage.removeItem(`timeLeft-${key}`);
          handleFinishChallenge();
          return 0;
        }
        const newTime = prevTime - 1;
        localStorage.setItem(`timeLeft-${key}`, newTime.toString());
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, key]);

  useEffect(() => {
    return () => {
      if (timeLeft && timeLeft > 0) {
        localStorage.setItem(`timeLeft-${key}`, timeLeft.toString());
      }
    };
  }, [timeLeft, key]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!currentProblem) return;
    const initializeWorkspace = async () => {
      try {
        const projectTemplate = currentProblem.githubLink;
        
        const response = await fetch(`${backendUrl}/api/init-workspace`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: key, projectTemplate }),
        });
        
        const data = await response.json();
        if (data.success) {
          setVscodeUrl(data.vscodeUrl);
          console.log('Workspace initialized');
          setIsProjectDirectorySet(true);
        }
      } catch (error) {
        console.error('Failed to initialize workspace:', error);
      }
    };

    initializeWorkspace();
  }, [key, vscodeUrl, currentProblem]);

  useEffect(() => {
    const setupTestsEnvironment = async () => {
      try {
        console.log('Setting up tests environment...');
        const userId = key;
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

    if (isProjectDirectorySet) {
      setupTestsEnvironment();
    }
  }, [key, isProjectDirectorySet]);

  const fetchProjectFiles = async () => {
    try {
      const userId = key;
      const response = await fetch(`${backendUrl}/api/project-files/${userId}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        return;
      }
    
      setUserCode(data.files);
      setError(null);
    } catch (err) {
      setError('Failed to fetch project files');
      console.error('Error fetching files:', err);
    }
  };

  useEffect(() => {
    if (!currentProblem) return;

    fetchProjectFiles();
    if(currentProblem && currentProblem.type === 'frontend'){
      const pollInterval = setInterval(fetchProjectFiles, 5000);
      return () => clearInterval(pollInterval);
    }
  }, [key]);

  // Store User Code every 2 minutes
  useEffect(() => {
    const storeUserCode = async () => {
      try {
        const userId = key;
        const response = await fetch(`${backendUrl}/api/store-user-code/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: userCode, userChallengeId: key }),
        });
        const data = await response.json();
        if (data.error) {
          setError(data.error);
          return;
        }
        console.log('User code stored successfully');
      } catch (err) {
        setError('Failed to store user code');
        console.error('Error storing user code:', err);
      }
    };

    const interval = setInterval(storeUserCode, 120000);
    return () => clearInterval(interval);
  }, [key, userCode]);

  const runTestcases = async () => {
    console.log('Running testcases...');
    try {
      const userId = key;
      const response = await fetch(`${backendUrl}/api/run-tests/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data);
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

  // store Chat History
  const storeChatHistory = async () => {
    try {
      const userId = key;
      const response = await fetch(`${backendUrl}/api/store-user-chat-history/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userChallengeId: key, messages: localStorage.getItem(`chatHistory${key}`) }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      console.log('Chat history stored successfully');
    } catch (err) {
      setError('Failed to store chat history');
      console.error('Error storing chat history:', err);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!isSubmit) {
      await fetchProjectFiles();
      await runTestcases();
      const resultData = await GenerateReview(currentProblem, userCode);
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
  };

  // const destroyWorkspace = async () => {
  //   console.log('Destroying workspace...');
  //   const userId = key;
  //   const response = await fetch(`${backendUrl}/api/destroy-workspace/${userId}`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });
  //   const data = await response.json();
  //   if (data.error) {
  //     setError(data.error);
  //     return;
  //   }
  //   console.log('Workspace destroyed');
  // };

  const finishChallenge = async () => {
    console.log('Finishing challenge...');
    const userId = key;
    const response = await fetch(`${backendUrl}/api/finish/${userId}`, {
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
    console.log('Challenge finished');
  };

  const handleFinishChallenge = async () => {
    if (!currentProblem) return;
    setLoading(true);
    await storeChatHistory();
    // await destroyWorkspace();
    await finishChallenge();
    navigate(`/`); 
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
        <SandpackLayout />
        <Split 
          className="split-pane"
          sizes={[65, 35]}
          minSize={[300, 300]}
          expandToMin={false}
          gutterSize={10}
          gutterAlign="center"
          snapOffset={30}
          dragInterval={1}
          direction="horizontal"
          cursor="col-resize"
          style={{ display: 'flex', flex: 1, backgroundColor: '#0A0A23' }}
        >
          {/* Left Panel (Editor) */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
            overflow: 'hidden'
          }}>
            <div className="file-management"
              style={{
                display: 'flex',
                padding: '10px',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img 
                  src="/elitmus.png" 
                  alt="eLitmus Logo" 
                  style={{
                    height: '35px'
                  }}
                />
                <button
                  onClick={() => handleShowProblem(!showProblem)}
                  style={{
                    padding: '5px 10px',
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
              <div style={{
                padding: '5px 10px',
                backgroundColor: timeLeft <= 300 ? '#ff4444' : 'grey',
                color: 'white',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <span role="img" aria-label="timer">⏱️</span>
                {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              flex: 1,
              overflow: 'hidden'
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
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  flex: 1, 
                  overflow: 'hidden',
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
                          <button
                            onClick={handleSubmit}
                            style={{
                              padding: '10px 15px',
                              margin: '10px',
                              backgroundColor: isTestsSet ? '#4CAF50' : 'grey',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                            disabled={!isTestsSet}
                          >
                            Run Tests
                          </button>
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
                          stats={testResults?.result || []}
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
          {/* Right Panel (Preview/Chat) */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden'
          }}>
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
              {/* <button
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
              </button> */}
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
              challengeType === 'backend' ? (
                <RequestTester
                  style={{ 
                    height: isConsoleOpen ? '55%' : '94%',
                    flex: 1
                  }}
                  problemKey={key}
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
              )
            )}
            {isConsoleOpen && !isChatOpen && (
              <SandpackConsole style={{ height: '40%', backgroundColor: '#272729' }} />
            )}
            </div>
        </Split>
      </div>
    </SandpackProvider>
  );
}
