// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdListPage from './pages/AdListPage';
import AdCreatePage from './pages/AdCreatePage';
import AdEditPage from './pages/AdEditPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/ads" element={<AdListPage />} />
              <Route path="/ads/create" element={<AdCreatePage />} />
              <Route path="/ads/edit/:id" element={<AdEditPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/" element={<AdListPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;