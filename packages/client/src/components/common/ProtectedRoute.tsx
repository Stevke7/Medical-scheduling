import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  type: 'clinic' | 'patient';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, type }) => {
  const { clinicUser, clinicLoading, patient, patientLoading } = useAuth();

  if (type === 'clinic') {
    if (clinicLoading) {
      return (
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      );
    }

    if (!clinicUser) {
      return <Navigate to="/clinic/login" replace />;
    }
  }

  if (type === 'patient') {
    if (patientLoading) {
      return (
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      );
    }

    if (!patient) {
      return <Navigate to="/patient/login" replace />;
    }
  }

  return <>{children}</>;
};
