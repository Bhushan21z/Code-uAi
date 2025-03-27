import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { 
  SandpackProvider, 
  SandpackLayout, 
  SandpackCodeEditor, 
  SandpackPreview,
  SandpackFileExplorer,
  SandpackConsole,
  useSandpack
} from "@codesandbox/sandpack-react";
import { amethyst } from "@codesandbox/sandpack-themes";
import ShowTestResults from "../components/ShowTestResults";
import CODE_TEMPLATES from '../Constants/challengesCodeTemplates.json';
import FileManagement from '../components/FileManagement';
import PROBLEMS_DATA from "../Constants/challenges.json";
import AIChat from '../components/AIChat';
import ProblemsComponent from '../components/Problem';
import GenerateResult from '../components/GenerateResult';
import GenerateSummary from '../components/GenerateSummary';
import { Circles } from 'react-loader-spinner';
import { usePageLoader } from "../contexts/PageLoaderContext";

export default function Editor() {
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
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setLoading } = usePageLoader();

  const AutoSaveComponent = () => {
    const { sandpack } = useSandpack();

    useEffect(() => {
      const autoSaveInterval = setInterval(() => {
        const excludedFiles = [
          '/index.js', 
          '/package.json', 
          '/public/index.html'
        ];

        const filteredFiles = Object.fromEntries(
          Object.entries(sandpack.files).filter(
            ([filename]) => !excludedFiles.includes(filename)
          )
        );

        if (Object.keys(filteredFiles).length > 0) {
          setUserCode(filteredFiles);
          localStorage.setItem(`userCode-${key}`, JSON.stringify(filteredFiles));
        }
      }, 5000);

      return () => clearInterval(autoSaveInterval);
    }, [sandpack.files]);

    return null;
  };

  useEffect(() => {
    setCurrentProblem(PROBLEMS_DATA[key]);
    localStorage.setItem(`problemData-${key}`, JSON.stringify(PROBLEMS_DATA[key]));
  }, [key]);

  useEffect(() => {
    const storedCode = JSON.parse(localStorage.getItem(`userCode-${key}`));
    if (storedCode) {
      setUserCode(storedCode);
    } else {
      setUserCode(CODE_TEMPLATES[key]?.files || {});
    }
  }, [key]);

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!isSubmit) {
      const challengeData = JSON.parse(localStorage.getItem(`problemData-${key}`));
      const resultData = await GenerateResult(challengeData, userCode);
      setTestResults(resultData);
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

  const handleFinishChallenge = async () => {
    setLoading(true);
    const summaryResult = await GenerateSummary(
      currentProblem, 
      userCode, 
      PROBLEMS_DATA[key], 
      JSON.parse(localStorage.getItem(`chatHistory${key}`)) || []
    );
    const resultData = await GenerateResult(currentProblem, userCode);
    
    if(summaryResult && resultData){
      localStorage.setItem(`testSummary${key}`, JSON.stringify(summaryResult));
      localStorage.setItem(`testcaseData${key}`, JSON.stringify(resultData));
      navigate(`/summary/${key}`); 
    } else {
      alert('Error Generating your result Summary. Please Try Again.')
    }
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
          <div style={{
            width: '250px', 
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#2a2a2a',
            borderRight: '1px solid #333'
          }}>
            <div style={{
              padding: '10px',
              borderBottom: '1px solid #333'
            }}>
              <FileManagement/>
            </div>
            
            <SandpackFileExplorer 
              style={{ 
                flex: 1,
                overflow: 'auto',
                backgroundColor: '#2a2a2a',
              }} 
            />
            <button
              onClick={handleFinishChallenge}
              style={{
                width: '80%',
                padding: '10px',
                marginBottom: '20px',
                marginLeft: '25px',
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
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <select
                    value={template} 
                    onChange={handleTemplateChange}
                    style={{
                      padding: '5px',
                      backgroundColor: '#6851ff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px'
                    }}
                  >
                    <option value="static">Static (HTML/CSS/JS)</option>
                    <option value="react">React</option>
                  </select>
                  
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
                  paddingBottom: '10px'
                }}>
                  <AutoSaveComponent />
                  <SandpackCodeEditor
                    style={{ minHeight: '89vh' }}
                    showTabs
                    showLineNumbers
                    showInlineErrors
                    wrapContent
                    closableTabs
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
                          Submit Code
                        </button>
                      ) : (
                        <ShowTestResults
                          testResults={testResults}
                          handleSubmit={handleSubmit}
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
