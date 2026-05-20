import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Plus,
  Download,
  Filter,
  ChevronDown,
  Loader2,
  Inbox,
  ArrowUpDown,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { LeadStatus, LeadSource, Lead, UserRole } from '../types';
import { useLeads } from '../hooks/useLeads';
import { useDebounce } from '../hooks/useDebounce';
import LeadModal, { LeadFormData } from '../components/leads/LeadModal';
import { useAuth } from '../context/AuthContext';
const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { fetchLeads, createLead, updateLead, deleteLead, downloadCSV, loading: apiLoading } = useLeads();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const loadLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchLeads({
        page: currentPage,
        limit: 10,
        search: debouncedSearch,
        status: statusFilter,
        source: sourceFilter,
      });
      setLeads(response.data);
      setTotalPages(response.pagination.totalPages || 1);
    } catch (error) {
      console.error('Failed to load leads', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchLeads, currentPage, debouncedSearch, statusFilter, sourceFilter]);
  useEffect(() => {
    loadLeads();
  }, [loadLeads]);
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, sourceFilter]);
  const handleCreateOrEdit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    try {
      if (editingLead) {
        await updateLead(editingLead._id, data);
      } else {
        await createLead(data);
      }
      setIsModalOpen(false);
      setEditingLead(null);
      loadLeads(); 
    } catch (error) {
      console.error('Failed to save lead', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteLead(id);
        loadLeads();
      } catch (error) {
        console.error('Failed to delete lead', error);
      }
    }
  };
  const handleExportCSV = () => {
    downloadCSV({
      search: debouncedSearch,
      status: statusFilter,
      source: sourceFilter,
    });
  };
  const openCreateModal = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };
  const openEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };
  const statusOptions = Object.values(LeadStatus);
  const sourceOptions = Object.values(LeadSource);
  return (
    <div className="space-y-6">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Leads
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage all your leads in one place.
          </p>
        </div>
        <button
          id="create-lead-btn"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white
            bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25
            hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/40
            active:scale-[0.98] transition-all duration-200 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Create Lead
        </button>
      </div>
      {}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          {}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              id="search-input"
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50
                text-sm text-gray-900 placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
                transition-all duration-200"
            />
          </div>
          {}
          <div className="flex flex-wrap items-center gap-3">
            {}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50
                  text-sm text-gray-700 cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
                  transition-all duration-200"
              >
                <option value="">All Statuses</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            </div>
            {}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              <select
                id="source-filter"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="appearance-none pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50
                  text-sm text-gray-700 cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
                  transition-all duration-200"
              >
                <option value="">All Sources</option>
                {sourceOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            </div>
            {}
            <button
              id="export-csv-btn"
              onClick={handleExportCSV}
              disabled={apiLoading || isLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white
                text-sm font-medium text-gray-700
                hover:bg-gray-50 hover:border-gray-300
                active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
            >
              {apiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>
      </div>
      {}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm" id="leads-table">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {['Name', 'Email', 'Status', 'Source', 'Created At', 'Actions'].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-1.5">
                        {header}
                        {header !== 'Actions' && (
                          <ArrowUpDown className="h-3 w-3 text-gray-300" />
                        )}
                      </div>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {}
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full border-4 border-blue-100"></div>
                        <Loader2 className="h-10 w-10 text-blue-600 animate-spin absolute top-0 left-0" />
                      </div>
                      <p className="text-sm font-medium text-gray-400 animate-pulse">
                        Loading leads...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                                <tr>
                  <td colSpan={6} className="px-6 py-20">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gray-100">
                        <Inbox className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-base font-semibold text-gray-900">
                          No leads found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
                          Get started by creating your first lead, or adjust your filters to see results.
                        </p>
                      </div>
                      <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white
                          bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20
                          hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/35
                          active:scale-[0.98] transition-all duration-200"
                      >
                        <Plus className="h-4 w-4" />
                        Create Lead
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                                leads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="hover:bg-blue-50/30 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs font-bold uppercase">
                          {lead.name?.charAt(0) || '?'}
                        </div>
                        <span className="font-medium text-gray-900">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {lead.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                      {new Date(lead.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(lead)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        {user?.role === UserRole.ADMIN && (
                          <button
                            onClick={() => handleDelete(lead._id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {}
        {!isLoading && leads.length > 0 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/50">
            <div className="text-sm text-gray-500">
              Page <span className="font-medium text-gray-900">{currentPage}</span> of{' '}
              <span className="font-medium text-gray-900">{totalPages}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrEdit}
        initialData={editingLead}
        isLoading={isSubmitting}
      />
    </div>
  );
};
interface StatusBadgeProps {
  status: LeadStatus;
}
const statusStyles: Record<LeadStatus, string> = {
  [LeadStatus.NEW]:
    'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
  [LeadStatus.CONTACTED]:
    'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20',
  [LeadStatus.QUALIFIED]:
    'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
  [LeadStatus.LOST]:
    'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
};
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${statusStyles[status] ?? 'bg-gray-100 text-gray-700'}`}
  >
    {status}
  </span>
);
export default Dashboard;
