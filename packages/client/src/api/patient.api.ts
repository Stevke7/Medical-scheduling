import api from './index';
import { ILoginRequest } from '@medical/shared';

// Auth
export const patientLogin = async (data: ILoginRequest) => {
  const response = await api.post('/patient/auth/login', data);
  return response.data;
};

export const patientLogout = async () => {
  const response = await api.post('/patient/auth/logout');
  return response.data;
};

export const patientAuthStatus = async () => {
  const response = await api.get('/patient/auth/status');
  return response.data;
};

// Events
export const getPatientEvents = async () => {
  const response = await api.get('/patient/events');
  return response.data;
};
