export enum UserRole {
  ADMIN = 'Admin',
  SALES_USER = 'Sales User',
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  token?: string;
  createdAt: string;
  updatedAt: string;
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

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
  };
}
