import { Request, Response } from 'express';
import Lead from '../models/Lead';
import { createLeadSchema, updateLeadSchema } from '../validators/lead.validator';
import { FilterQuery } from 'mongoose';
import { ILead } from '../types';

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = createLeadSchema.parse(req.body);
    
    const lead = await Lead.create(validatedData);
    
    res.status(201).json({ success: true, data: lead });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, message: 'Validation Error', errors: error.errors });
    } else {
      res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
  }
};

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = updateLeadSchema.parse(req.body);
    
    const lead = await Lead.findByIdAndUpdate(req.params.id, validatedData, {
      new: true,
      runValidators: true,
    });

    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }
    
    res.json({ success: true, data: lead });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, message: 'Validation Error', errors: error.errors });
    } else {
      res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
export const getLeadById = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }
    
    res.json({ success: true, data: lead });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private (Admin Only)
export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    
    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }
    
    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// Helper for building search/filter query
const buildLeadQuery = (queryInfo: any): FilterQuery<ILead> => {
  const query: FilterQuery<ILead> = {};
  
  if (queryInfo.status) {
    query.status = queryInfo.status;
  }
  
  if (queryInfo.source) {
    query.source = queryInfo.source;
  }
  
  if (queryInfo.search) {
    const searchRegex = new RegExp(queryInfo.search as string, 'i');
    query.$or = [
      { name: searchRegex },
      { email: searchRegex }
    ];
  }
  
  return query;
};

// @desc    Get all leads (with search, filter, pagination, sorting)
// @route   GET /api/leads
// @access  Private
export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = buildLeadQuery(req.query);
    
    // Sorting
    const sortOrder = req.query.sort === 'oldest' ? 1 : -1; // Default to latest
    
    // Pagination
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    
    // Execute query
    const leads = await Lead.find(query)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit);
      
    // Get total document count for pagination info
    const totalRecords = await Lead.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limit);
    
    res.json({
      success: true,
      data: leads,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Export leads to CSV
// @route   GET /api/leads/export/csv
// @access  Private
export const exportLeadsCSV = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = buildLeadQuery(req.query);
    const sortOrder = req.query.sort === 'oldest' ? 1 : -1;
    
    const leads = await Lead.find(query).sort({ createdAt: sortOrder });
    
    // Generate CSV string
    const headers = ['ID,Name,Email,Status,Source,Created At\n'];
    const rows = leads.map(lead => {
      // Basic escaping for CSV fields
      const escapeField = (field: string) => `"${field.replace(/"/g, '""')}"`;
      
      return [
        lead._id,
        escapeField(lead.name),
        escapeField(lead.email),
        lead.status,
        lead.source,
        lead.createdAt.toISOString()
      ].join(',');
    });
    
    const csvContent = headers.concat(rows).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.status(200).send(csvContent);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};
