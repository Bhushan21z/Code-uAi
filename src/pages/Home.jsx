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
  const [showFeatures, setShowFeatures] = useState(false);

  const handleDeveloperClick = () => {
    // This will be handled by Google Sign-in
    console.log("Developer sign-in clicked");
  };

  const handleCompanyClick = () => {
    // In a real implementation, this would navigate to admin page
    navigate("/admin");
  };

  const onSuccessGoogle = (credentialResponse) => {
    const idToken = credentialResponse.credential;

    if (idToken) {
      const decodedToken = JSON.parse(atob(idToken.split('.')[1]));
      // Handle successful login
      navigate("/challenges");
    } else {
      console.error("ID token not found in credential response.");
    }
  };

  const onErrorGoogle = () => {
    console.error("Google Sign-In Failed");
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
    featuresToggle: {
      color: "#fcd34d",
      textDecoration: "underline",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "8px 0",
      marginTop: "8px",
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
            <div style={{ marginTop: "20px" }}>
              <GoogleLogin 
                onSuccess={onSuccessGoogle} 
                onError={onErrorGoogle}
                width="250"
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
            <p>© {new Date().getFullYear()} Code-uAi - The future of technical assessment</p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}