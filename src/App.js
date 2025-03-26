import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChallengesList from './pages/ChallengesList';
import Editor from './pages/Editor';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/challenges" element={<ChallengesList />} />
          <Route path="/editor/:key" element={<Editor />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}
