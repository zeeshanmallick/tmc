import { z } from 'zod';

// User schema
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['COMPANY', 'INVESTOR', 'ADMIN']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Company profile schema
export const companyProfileSchema = z.object({
  userId: z.string().uuid(),
  companyName: z.string().min(1).max(100),
  industry: z.string().min(1),
  location: z.string().min(1),
  foundingYear: z.number().int().positive().optional(),
  teamSize: z.number().int().positive().optional(),
  website: z.string().url().optional().nullable(),
  description: z.string().min(10).max(1000),
  fundingType: z.string().min(1),
  fundingAmountSought: z.number().positive(),
  equity: z.number().min(0).max(100).optional(),
  monthlyRevenue: z.number().optional(),
  pitchDeck: z.string().url().optional().nullable(),
  profileComplete: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Investor profile schema
export const investorProfileSchema = z.object({
  userId: z.string().uuid(),
  fullName: z.string().min(1).max(100),
  investorType: z.string().min(1),
  companyFundName: z.string().min(1).max(100).optional().nullable(),
  locationCity: z.string().min(1),
  locationCountry: z.string().min(1),
  investmentStages: z.string().min(1),
  typicalInvestmentSize: z.string().min(1),
  interestedIndustries: z.string().min(1),
  investmentCriteria: z.string().min(10).max(1000).optional(),
  linkedinProfile: z.string().url().optional().nullable(),
  website: z.string().url().optional().nullable(),
  profileComplete: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Conversation schema
export const conversationSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
});

// Conversation participant schema
export const conversationParticipantSchema = z.object({
  conversationId: z.string().uuid(),
  userId: z.string().uuid(),
  joinedAt: z.date(),
});

// Message schema
export const messageSchema = z.object({
  id: z.string().uuid(),
  conversationId: z.string().uuid(),
  senderId: z.string().uuid(),
  recipientId: z.string().uuid(),
  content: z.string().min(1),
  sentAt: z.date(),
  readAt: z.date().nullable().optional(),
});

// Input validation schemas for API requests

// Signup input schema
export const signupInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.enum(['COMPANY', 'INVESTOR']),
});

// Login input schema
export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Company profile input schema
export const companyProfileInputSchema = z.object({
  companyName: z.string().min(1).max(100),
  industry: z.string().min(1),
  location: z.string().min(1),
  foundingYear: z.number().int().positive().optional(),
  teamSize: z.number().int().positive().optional(),
  website: z.string().url().optional().nullable(),
  description: z.string().min(10).max(1000),
  fundingType: z.string().min(1),
  fundingAmountSought: z.number().positive(),
  equity: z.number().min(0).max(100).optional(),
  monthlyRevenue: z.number().optional(),
  pitchDeck: z.string().url().optional().nullable(),
  profileComplete: z.boolean().default(false),
});

// Investor profile input schema
export const investorProfileInputSchema = z.object({
  fullName: z.string().min(1).max(100),
  investorType: z.string().min(1),
  companyFundName: z.string().min(1).max(100).optional().nullable(),
  locationCity: z.string().min(1),
  locationCountry: z.string().min(1),
  investmentStages: z.string().min(1),
  typicalInvestmentSize: z.string().min(1),
  interestedIndustries: z.string().min(1),
  investmentCriteria: z.string().min(10).max(1000).optional(),
  linkedinProfile: z.string().url().optional().nullable(),
  website: z.string().url().optional().nullable(),
  profileComplete: z.boolean().default(false),
});

// Message input schema
export const messageInputSchema = z.object({
  content: z.string().min(1).max(5000),
});

// Search company input schema
export const searchCompanyInputSchema = z.object({
  industry: z.string().optional(),
  fundingType: z.string().optional(),
  location: z.string().optional(),
  minFunding: z.number().optional(),
  maxFunding: z.number().optional(),
});

// Search investor input schema
export const searchInvestorInputSchema = z.object({
  investorType: z.string().optional(),
  investmentStage: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  minInvestment: z.string().optional(),
});
