import bcrypt from 'bcryptjs';
import { User, Patient, IUserDocument, IPatientDocument } from '../models/index.js';

export class AuthService {
  /**
   * Verify clinic user credentials and update timezone
   */
  static async verifyClinicUser(
    email: string,
    password: string,
    timezone: string
  ): Promise<IUserDocument | null> {
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return null;
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return null;
    }
    
    // Update timezone on each login
    user.timezone = timezone;
    await user.save();
    
    return user;
  }

  /**
   * Verify patient credentials and update timezone
   */
  static async verifyPatient(
    email: string,
    password: string,
    timezone: string
  ): Promise<IPatientDocument | null> {
    const patient = await Patient.findOne({ email: email.toLowerCase() });
    
    if (!patient) {
      return null;
    }
    
    const isMatch = await bcrypt.compare(password, patient.password);
    
    if (!isMatch) {
      return null;
    }
    
    // Update timezone on each login
    patient.timezone = timezone;
    await patient.save();
    
    return patient;
  }

  /**
   * Get clinic user by ID
   */
  static async getClinicUserById(id: string): Promise<IUserDocument | null> {
    return User.findById(id).select('-password');
  }

  /**
   * Get patient by ID
   */
  static async getPatientById(id: string): Promise<IPatientDocument | null> {
    return Patient.findById(id).select('-password');
  }

  /**
   * Hash a password
   */
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
