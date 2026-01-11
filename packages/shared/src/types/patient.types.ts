export interface IPatient {
  _id: string;
  email: string;
  password: string; // hashed
  name: string;
  timezone: string; // IANA timezone string - updated on each login
  createdAt: Date;
  updatedAt: Date;
}

// For API responses - exclude password
export interface IPatientPublic {
  _id: string;
  email: string;
  name: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

// For creating new patient
export interface IPatientCreate {
  email: string;
  password: string;
  name: string;
}
