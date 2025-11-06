import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ToastContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Write from './pages/Write';
import EditBlog from './pages/EditBlog';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import Login from './pages/Login';
import Register from './pages/Register';
import BlogDetail from './pages/BlogDetail';

function AppRoutes() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="cyber-loader"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar user={user} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/write" element={user ? <Write user={user} /> : <Navigate to="/login" />} />
        <Route path="/edit/:id" element={user ? <EditBlog user={user} /> : <Navigate to="/login" />} />
        <Route path="/profile/:username" element={<Profile currentUser={user} />} />
        <Route path="/explore" element={<Explore user={user} />} />
        <Route path="/blog/:id" element={<BlogDetail user={user} />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
