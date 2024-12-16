import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.tsx'; // Public page
import TasksPage from '../pages/TasksPage.tsx'; // Protected page
import AppLayout from '../AppLayout.tsx';
import UpdateProfilePage from '../pages/UserPage.tsx';
import RegisterPage from '../pages/RegisterPage.tsx';

// Protect routes that require authentication
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/tasks" replace /> : <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route for Login */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />

        {/* Private Route for Tasks */}
        <Route path="/" element={
          <PrivateRoute>
            <AppLayout /> {/* Sidebar layout with protected routes */}
          </PrivateRoute>
        }>
            <Route path='myaccount' element={
                <UpdateProfilePage />
            } />
          <Route path="tasks" element={<TasksPage />} />
          {/* Add more routes here, all will use LayoutWithSidebar */}
        </Route>
            <Route path='register' element={<RegisterPage />} />
        {/* Redirect any unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
