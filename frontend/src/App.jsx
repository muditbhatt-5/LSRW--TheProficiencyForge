import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import Layout from './Admin/Layout.jsx'; // Admin layout
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ParagraphReader from './pages/ParagraphReader.jsx';
import ParagraphListener from './pages/ParagraphListener.jsx';
import Exam from './pages/Exam.jsx';

// Admin-specific components
import AdminParagraphReaders from './Admin/AdminParagraphReaders.jsx';
import AdminParagraphListeners from './Admin/AdminParagraphListeners.jsx';
import Users from './Admin/Users.jsx';
import Mcqs from './Admin/Mcqs.jsx'; // Import the MCQs component

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Protected routes for regular users */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/paragraph-reader" element={<ProtectedRoute><ParagraphReader /></ProtectedRoute>} />
            <Route path="/paragraph-listener" element={<ProtectedRoute><ParagraphListener /></ProtectedRoute>} />
            <Route path="/exam" element={<ProtectedRoute><Exam /></ProtectedRoute>} />

            {/* Protected admin routes with Layout */}
            <Route path="/admin" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<ProtectedRoute><Users /></ProtectedRoute>} />
              <Route path="admin-paragraph-readers" element={<ProtectedRoute><AdminParagraphReaders /></ProtectedRoute>} />
              <Route path="admin-paragraph-listeners" element={<ProtectedRoute><AdminParagraphListeners /></ProtectedRoute>} />
              <Route path="mcqs" element={<ProtectedRoute><Mcqs /></ProtectedRoute>} /> {/* Add route for MCQs */}
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
