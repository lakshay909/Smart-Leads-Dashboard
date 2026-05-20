import { Document } from 'mongoose';

export enum UserRole {
  ADMIN = 'Admin',
  SALES_USER = 'Sales User',
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional for cases where we omit it in responses
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  LOST = 'Lost',
}

export enum LeadSource {
  WEBSITE = 'Website',
  INSTAGRAM = 'Instagram',
  REFERRAL = 'Referral',
}

export interface ILead extends Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: Date;
  updatedAt: Date;
}
