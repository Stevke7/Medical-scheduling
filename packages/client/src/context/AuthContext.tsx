import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { clinicAuthStatus, clinicLogin, clinicLogout } from '../api/clinic.api';
import { patientAuthStatus, patientLogin, patientLogout } from '../api/patient.api';
import { getUserTimezone } from '../utils/timezone.utils';

interface User {
  _id: string;
  email: string;
  name: string;
  timezone: string;
}

interface AuthContextType {
  // Clinic auth
  clinicUser: User | null;
  clinicLoading: boolean;
  clinicLogin: (email: string, password: string) => Promise<boolean>;
  clinicLogout: () => Promise<void>;
  checkClinicAuth: () => Promise<void>;

  // Patient auth
  patient: User | null;
  patientLoading: boolean;
  patientLogin: (email: string, password: string) => Promise<boolean>;
  patientLogout: () => Promise<void>;
  checkPatientAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clinicUser, setClinicUser] = useState<User | null>(null);
  const [clinicLoading, setClinicLoading] = useState(true);
  
  const [patient, setPatient] = useState<User | null>(null);
  const [patientLoading, setPatientLoading] = useState(true);

  // Check clinic auth status
  const checkClinicAuth = async () => {
    try {
      setClinicLoading(true);
      const response = await clinicAuthStatus();
      if (response.authenticated && response.user) {
        setClinicUser(response.user);
      } else {
        setClinicUser(null);
      }
    } catch (error) {
      setClinicUser(null);
    } finally {
      setClinicLoading(false);
    }
  };

  // Check patient auth status
  const checkPatientAuth = async () => {
    try {
      setPatientLoading(true);
      const response = await patientAuthStatus();
      if (response.authenticated && response.patient) {
        setPatient(response.patient);
      } else {
        setPatient(null);
      }
    } catch (error) {
      setPatient(null);
    } finally {
      setPatientLoading(false);
    }
  };

  // Clinic login
  const handleClinicLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const timezone = getUserTimezone();
      const response = await clinicLogin({ email, password, timezone });
      if (response.success && response.user) {
        setClinicUser(response.user);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  // Clinic logout
  const handleClinicLogout = async () => {
    try {
      await clinicLogout();
    } finally {
      setClinicUser(null);
    }
  };

  // Patient login
  const handlePatientLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const timezone = getUserTimezone();
      const response = await patientLogin({ email, password, timezone });
      if (response.success && response.patient) {
        setPatient(response.patient);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  // Patient logout
  const handlePatientLogout = async () => {
    try {
      await patientLogout();
    } finally {
      setPatient(null);
    }
  };

  // Check auth on mount
  useEffect(() => {
    checkClinicAuth();
    checkPatientAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        clinicUser,
        clinicLoading,
        clinicLogin: handleClinicLogin,
        clinicLogout: handleClinicLogout,
        checkClinicAuth,
        patient,
        patientLoading,
        patientLogin: handlePatientLogin,
        patientLogout: handlePatientLogout,
        checkPatientAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
