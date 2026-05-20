import { z } from 'zod';
import { LeadStatus, LeadSource } from '../types';

export const createLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  status: z.nativeEnum(LeadStatus).optional(),
  source: z.nativeEnum(LeadSource),
});

export const updateLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  status: z.nativeEnum(LeadStatus).optional(),
  source: z.nativeEnum(LeadSource).optional(),
});
