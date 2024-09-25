import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginRegisterPage from './pages/LoginRegisterPage';
import SessionPage from './pages/SessionPage';
import UserInfoPage from './pages/UserInfoPage';
import ReasonPage from './pages/ReasonPage';
import ProfilePage from './pages/ProfilePage';
import TermsPage from './pages/TermsPage';
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component

const App = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/login' && location.pathname !== '/session' && <Navbar />}
      <Routes>
        <Route path="/" element={<LoginRegisterPage />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<LoginRegisterPage />} />
        <Route
          path="/session"
          element={
            <PrivateRoute>
              <SessionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/userinfo"
          element={
            <PrivateRoute>
              <UserInfoPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/reason"
          element={
            <PrivateRoute>
              <ReasonPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/terms"
          element={
            <PrivateRoute>
              <TermsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;