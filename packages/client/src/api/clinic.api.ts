import api from './index';
import { ILoginRequest, IEventCreate, IEventBatchCreate } from '@medical/shared';

// Auth
export const clinicLogin = async (data: ILoginRequest) => {
  const response = await api.post('/clinic/auth/login', data);
  return response.data;
};

export const clinicLogout = async () => {
  const response = await api.post('/clinic/auth/logout');
  return response.data;
};

export const clinicAuthStatus = async () => {
  const response = await api.get('/clinic/auth/status');
  return response.data;
};

// Events
export const getClinicEvents = async (startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  const response = await api.get(`/clinic/events?${params.toString()}`);
  return response.data;
};

export const getDaysWithEvents = async (startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  const response = await api.get(`/clinic/events/days-with-events?${params.toString()}`);
  return response.data;
};

export const createEvent = async (data: IEventCreate) => {
  const response = await api.post('/clinic/events', data);
  return response.data;
};

export const createBatchEvents = async (data: IEventBatchCreate) => {
  const response = await api.post('/clinic/events/batch', data);
  return response.data;
};

// Patients
export const getPatients = async () => {
  const response = await api.get('/clinic/patients');
  return response.data;
};
