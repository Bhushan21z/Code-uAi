import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChallengesList from './pages/ChallengesList';
import VSEditor from './pages/VSEditor';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SummaryDashboard from './pages/SummaryDashboard';
import NodeEditor from './pages/NodeEditor';
import { PageLoaderProvider } from './contexts/PageLoaderContext';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <PageLoaderProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/challenges" element={<ChallengesList />} />
            <Route path="/editor/:key" element={<VSEditor />} />
            <Route path="/node-editor/:key" element={<NodeEditor />} />
            <Route path="/summary/:key" element={<SummaryDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Router>
      </PageLoaderProvider>
    </GoogleOAuthProvider>
  );
}
