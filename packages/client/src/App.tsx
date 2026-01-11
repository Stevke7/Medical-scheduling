import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Clinic pages
import { ClinicLoginPage } from './pages/clinic/LoginPage';
import { ClinicDashboardPage } from './pages/clinic/DashboardPage';

// Patient pages
import { PatientLoginPage } from './pages/patient/LoginPage';
import { PatientDashboardPage } from './pages/patient/DashboardPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/clinic" replace />} />

            {/* Clinic routes */}
            <Route path="/clinic/login" element={<ClinicLoginPage />} />
            <Route
              path="/clinic"
              element={
                <ProtectedRoute type="clinic">
                  <ClinicDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Patient routes */}
            <Route path="/patient/login" element={<PatientLoginPage />} />
            <Route
              path="/patient"
              element={
                <ProtectedRoute type="patient">
                  <PatientDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* 404 - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
