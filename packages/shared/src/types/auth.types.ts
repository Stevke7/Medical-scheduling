// Login request - same for both user types
export interface ILoginRequest {
  email: string;
  password: string;
  timezone: string; // IANA timezone from client
}

// Login response for clinic users
export interface IClinicLoginResponse {
  success: boolean;
  user?: {
    _id: string;
    email: string;
    name: string;
    timezone: string;
  };
  message?: string;
}

// Login response for patients
export interface IPatientLoginResponse {
  success: boolean;
  patient?: {
    _id: string;
    email: string;
    name: string;
    timezone: string;
  };
  message?: string;
}

// Session data stored in cookie
export interface ISessionData {
  userId?: string;
  patientId?: string;
  userType: 'clinic' | 'patient';
}

// Auth status response
export interface IAuthStatusResponse {
  authenticated: boolean;
  user?: {
    _id: string;
    email: string;
    name: string;
    timezone: string;
  };
  patient?: {
    _id: string;
    email: string;
    name: string;
    timezone: string;
  };
}
