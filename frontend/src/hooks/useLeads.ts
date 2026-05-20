import { useState, useCallback } from 'react';
import api from '../services/api';
import { Lead, PaginatedResponse } from '../types';

interface FetchLeadsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  source?: string;
}

export const useLeads = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async (params: FetchLeadsParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Remove empty params
      const cleanedParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && v !== '')
      );

      const response = await api.get<PaginatedResponse<Lead>>('/leads', { params: cleanedParams });
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch leads';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createLead = async (data: Omit<Lead, '_id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<{ success: boolean; data: Lead }>('/leads', data);
      return response.data.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create lead';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateLead = async (id: string, data: Partial<Lead>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put<{ success: boolean; data: Lead }>(`/leads/${id}`, data);
      return response.data.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update lead';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const deleteLead = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/leads/${id}`);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete lead';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = async (params: FetchLeadsParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const cleanedParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && v !== '')
      );
      const response = await api.get('/leads/export/csv', {
        params: cleanedParams,
        responseType: 'blob', // Important for file download
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to export CSV';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchLeads,
    createLead,
    updateLead,
    deleteLead,
    downloadCSV
  };
};
