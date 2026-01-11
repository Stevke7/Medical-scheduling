// User = Doctor / Clinic staff
export interface IUser {
  _id: string;
  email: string;
  password: string; // hashed
  name: string;
  timezone: string; // IANA timezone string (e.g., "Europe/Belgrade")
  createdAt: Date;
  updatedAt: Date;
}

// For API responses - exclude password
export interface IUserPublic {
  _id: string;
  email: string;
  name: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

// For creating new user
export interface IUserCreate {
  email: string;
  password: string;
  name: string;
}
