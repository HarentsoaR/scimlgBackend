// src/users/interfaces/user.interface.ts
import { Document } from 'mongoose';

export interface User extends Document {
  _id: string; // Mongoose uses _id instead of id
  id: string; // Add this line for compatibility with TypeScript
  name: string; // Changed from username to name to match the model
  email: string;
  password: string; // Include password if needed for comparison
  role: 'researcher' | 'evaluator' | 'admin'; // Include role to match the model
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>; // Method to compare passwords
}
