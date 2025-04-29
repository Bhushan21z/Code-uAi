import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

// Note: You'll need to install these dependencies or replace with your own icons
// If you don't have Lucide React, you can use any other icon library or simple text
const Code = () => <span>👨‍💻</span>;
const Building = () => <span>🏢</span>;
const CheckCircle = () => <span>✓</span>;
const PenTool = () => <span>✏️</span>;
const Zap = () => <span>⚡</span>;
const GitBranch = () => <span>🔄</span>;
const Clock = () => <span>⏰</span>;
const Brain = () => <span>🧠</span>;
const Camera = () => <span>📷</span>;

export default function HomePage() {
  const googleClientId = "798578132639-o2jejbp39242as0m4v8mfvdhhm4irru7.apps.googleusercontent.com"; 
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
  
  // Admin login modal state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminFormData, setAdminFormData] = useState({
    email: '',
    password: ''
  });
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  
  const handleDeveloperClick = () => {
    // This will be handled by Google Sign-in
    console.log("Developer sign-in clicked");
    // You can trigger the Google login button click if needed
    const googleSignInButton = document.querySelector('.google-login-container button');
    if (googleSignInButton) {
      googleSignInButton.click();
    }
  };

  const handleCompanyClick = () => {
    // Show admin login modal
    setShowAdminModal(true);
    setAdminError('');
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      // Extract user info from Google response
      const idToken = credentialResponse.credential;
      const decodedToken = JSON.parse(atob(idToken.split('.')[1]));
      const email = decodedToken.email;
      const name = decodedToken.name;
      const password = email; // As per your requirement
      const role = 'candidate';

      // 1. Create user
      const userRes = await fetch(`${backendUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role })
      });
      
      const userResJson = await userRes.json();
      console.log(userResJson);
      
      if (userResJson.success || userResJson.existing) {
        // 2. Login
        const loginRes = await fetch(`${backendUrl}/api/auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'login', email, password })
        });
        
        console.log(email, password);
        const loginResJson = await loginRes.json();
        console.log(loginResJson);
        if (!loginResJson.success) throw new Error('Login failed');
        
        // Store user information in localStorage or session for future reference
        localStorage.setItem('user', JSON.stringify(loginResJson.user));
        
        navigate('/challenges');
      } else {
        throw new Error(userResJson.error || 'User creation failed');
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(err.message || 'Login failed. Please try again.');
    }
  };

  const onErrorGoogle = () => {
    console.error("Google Sign-In Failed");
    alert("Google sign-in failed. Please try again later.");
  };

  // Admin form handlers
  const handleAdminInputChange = (e) => {
    const { name, value } = e.target;
    setAdminFormData(prev => ({...prev, [name]: value}));
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setAdminError('');
    setAdminLoading(true);
    
    try {
      const { email, password } = adminFormData;
      
      // Login existing admin
      const loginRes = await fetch(`${backendUrl}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'login', email, password })
      });
      
      const loginData = await loginRes.json();
      
      if (!loginData.success) {
        throw new Error(loginData.error || 'Invalid credentials');
      }
      
      // Store user info
      localStorage.setItem('user', JSON.stringify(loginData.user));
      
      // Close modal and navigate to admin page
      setShowAdminModal(false);
      navigate('/admin');
    } catch (err) {
      console.error("Admin login error:", err);
      setAdminError(err.message || 'Login failed');
    } finally {
      setAdminLoading(false);
    }
  };

  const features = [
    { icon: <Code />, title: "Multi-Language Stack", desc: "Support for React, Vue, Angular, Svelte and more" },
    { icon: <CheckCircle />, title: "Test Case Evaluation", desc: "Comprehensive test coverage and analysis" },
    { icon: <Brain />, title: "AI-Powered Debugging", desc: "Automated bug generation for learning" },
    { icon: <PenTool />, title: "Prompt Evaluations", desc: "Problem diagnosis and constraint design" },
    { icon: <Zap />, title: "Performance Tracking", desc: "Detailed metrics on coding performance" },
    { icon: <GitBranch />, title: "Vibe Coding", desc: "Build projects from scratch to test creativity" },
    { icon: <Clock />, title: "Time-Based Assessment", desc: "Optimize for both quality and speed" },
    { icon: <Camera />, title: "Activity Monitoring", desc: "Track progress across all challenges" }
  ];

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(to right, #1a1a4e, #2e2e91, #1a1a4e)",
      fontFamily: "Arial, sans-serif",
    },
    innerContainer: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "16px",
      paddingTop: "48px",
      paddingBottom: "48px",
    },
    heroSection: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      paddingTop: "64px",
      paddingBottom: "64px",
    },
    title: {
      fontSize: "3.5rem",
      fontWeight: "bold",
      marginBottom: "16px",
      background: "linear-gradient(to right, #ff8a00, #e52e71)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      MozBackgroundClip: "text",
      MozTextFillColor: "transparent",
    },
    subtitle: {
      fontSize: "1.5rem",
      color: "#d1d1e0",
      marginBottom: "24px",
      maxWidth: "700px",
    },
    techStackContainer: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "8px",
      marginBottom: "32px",
    },
    techPill: {
      padding: "4px 16px",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: "9999px",
      color: "white",
    },
    buttonContainer: {
      display: "flex",
      flexDirection: window.innerWidth < 640 ? "column" : "row",
      gap: "16px",
      marginBottom: "48px",
    },
    buttonBase: {
      position: "relative",
      padding: "16px 32px",
      borderRadius: "8px",
      color: "white",
      fontWeight: "500",
      fontSize: "1.125rem",
      transition: "all 0.2s",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    devButton: {
      background: "linear-gradient(to right, #3b82f6, #1d4ed8)",
      boxShadow: hoveredButton === 'developer' ? "0 10px 15px -3px rgba(59, 130, 246, 0.3)" : "none",
    },
    companyButton: {
      background: "linear-gradient(to right, #8b5cf6, #6d28d9)",
      boxShadow: hoveredButton === 'company' ? "0 10px 15px -3px rgba(139, 92, 246, 0.3)" : "none",
    },
    buttonTooltip: {
      position: "absolute",
      bottom: "-32px",
      left: "0",
      right: "0",
      fontSize: "0.875rem",
      color: hoveredButton === 'developer' ? "#93c5fd" : "#c4b5fd",
    },
    taglineContainer: {
      color: "#d1d1e0",
      maxWidth: "700px",
    },
    featuresGrid: {
      display: "grid",
      gridTemplateColumns: window.innerWidth < 768 ? "1fr" : 
                          window.innerWidth < 1024 ? "1fr 1fr" : "1fr 1fr 1fr 1fr",
      gap: "24px",
      marginTop: "24px",
      marginBottom: "48px",
    },
    featureCard: {
      background: "linear-gradient(to bottom right, #1f1f3d, #121225)",
      padding: "24px",
      borderRadius: "12px",
      transition: "all 0.3s",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
    featureIcon: {
      color: "#fcd34d",
      marginBottom: "12px",
      fontSize: "24px",
    },
    featureTitle: {
      fontSize: "1.125rem",
      fontWeight: "600",
      color: "white",
      marginBottom: "8px",
    },
    featureDesc: {
      color: "#9ca3af",
    },
    footer: {
      textAlign: "center",
      color: "#6b7280",
      fontSize: "0.875rem",
      marginTop: "64px",
    },
    // Admin modal styles
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: "#1f1f3d",
      borderRadius: "12px",
      padding: "32px",
      width: "90%",
      maxWidth: "400px",
      position: "relative",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)"
    },
    modalClose: {
      position: "absolute",
      top: "15px",
      right: "20px",
      fontSize: "24px",
      color: "#6b7280",
      cursor: "pointer",
      background: "none",
      border: "none"
    },
    modalTitle: {
      fontSize: "1.5rem",
      fontWeight: "600",
      color: "white",
      marginBottom: "20px",
      textAlign: "center"
    },
    formGroup: {
      marginBottom: "16px"
    },
    formLabel: {
      display: "block",
      color: "#d1d1e0",
      marginBottom: "6px",
      fontSize: "0.875rem"
    },
    formInput: {
      width: "100%",
      padding: "10px 12px",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "6px",
      color: "white",
      fontSize: "1rem"
    },
    formButton: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#8b5cf6",
      borderRadius: "6px",
      color: "white",
      fontWeight: "500",
      border: "none",
      cursor: "pointer",
      marginTop: "10px",
      fontSize: "1rem"
    },
    errorMessage: {
      color: "#f87171",
      fontSize: "0.875rem",
      marginTop: "10px",
      textAlign: "center"
    }
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div style={styles.container}>
        <div style={styles.innerContainer}>
          {/* Hero Section */}
          <div style={styles.heroSection}>
            <h1 style={styles.title}>Code-uAi</h1>
            <h2 style={styles.subtitle}>
              The next-gen platform for AI-driven coding and product assessment
            </h2>
            
            {/* Tech stack pills */}
            <div style={styles.techStackContainer}>
              {["React", "Vue", "Angular", "Svelte", "Node.js", "Python", "AI Prompts"].map((tech) => (
                <span key={tech} style={styles.techPill}>
                  {tech}
                </span>
              ))}
            </div>
            
            {/* Buttons */}
            <div style={styles.buttonContainer}>
              <button
                style={{...styles.buttonBase, ...styles.devButton}}
                onClick={handleDeveloperClick}
                onMouseEnter={() => setHoveredButton('developer')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <Code /> For Developers
                {hoveredButton === 'developer' && (
                  <span style={styles.buttonTooltip}>
                    Sign in with Google
                  </span>
                )}
              </button>
              
              <button
                style={{...styles.buttonBase, ...styles.companyButton}}
                onClick={handleCompanyClick}
                onMouseEnter={() => setHoveredButton('company')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <Building /> For Companies
                {hoveredButton === 'company' && (
                  <span style={styles.buttonTooltip}>
                    Access admin portal
                  </span>
                )}
              </button>
            </div>
            
            {/* Developer button click will show the Google Sign-in */}
            <div style={{ marginTop: "20px" }} className="google-login-container">
              <GoogleLogin 
                onSuccess={handleGoogleLoginSuccess} 
                onError={onErrorGoogle}
                width="250"
                useOneTap
                text="signin_with"
                shape="rectangular"
              />
            </div>
            
            {/* Tagline */}
            <div style={styles.taglineContainer}>
              <p style={{ marginBottom: "16px" }}>
                Going beyond traditional code assessment with AI-powered evaluation of both technical skills and product thinking leveraging AI offcourse.
              </p>
            </div>
          </div>
          
          <div style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} style={styles.featureCard}>
                <div style={styles.featureIcon}>{feature.icon}</div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
          
          {/* Footer */}
          <div style={styles.footer}>
            <p> {new Date().getFullYear()} Code-uAi - The future of technical assessment</p>
          </div>
        </div>
      </div>
      
      {/* Admin Login Modal */}
      {showAdminModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button 
              style={styles.modalClose} 
              onClick={() => setShowAdminModal(false)}
            >
              ×
            </button>
            
            <h3 style={styles.modalTitle}>Admin Login</h3>
            
            {adminError && <p style={styles.errorMessage}>{adminError}</p>}
            
            <form onSubmit={handleAdminSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={adminFormData.email}
                  onChange={handleAdminInputChange}
                  style={styles.formInput}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={adminFormData.password}
                  onChange={handleAdminInputChange}
                  style={styles.formInput}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                style={styles.formButton}
                disabled={adminLoading}
              >
                {adminLoading ? 'Logging in...' : 'Login as Admin'}
              </button>
            </form>
          </div>
        </div>
      )}
    </GoogleOAuthProvider>
  );
}