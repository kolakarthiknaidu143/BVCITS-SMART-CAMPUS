import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { JobApplication, PlacementDrive } from '../../types';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Calendar,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  MessageSquare,
} from 'lucide-react';

export const RecruiterApplicationsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [placements, setPlacements] = useState<PlacementDrive[]>([]);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [placementFilter, setPlacementFilter] = useState('All');

  // Status Change Modal / Drawer State
  const [updatingApp, setUpdatingApp] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState<string>('Shortlisted');
  const [statusNotes, setStatusNotes] = useState<string>('');
  const [updating, setUpdating] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<any>('/recruiter/applications');
      if (res.success) {
        setApplications(res.applications || []);
        setPlacements(res.placements || []);
      } else {
        setError(res.message || 'Unable to load candidate applications.');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to load candidate applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const openStatusModal = (app: any) => {
    setUpdatingApp(app);
    setNewStatus(app.status || 'Shortlisted');
    setStatusNotes(app.notes || '');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingApp) return;

    setUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await apiFetch<any>(`/recruiter/applications/${updatingApp._id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus, notes: statusNotes }),
      });

      if (res.success) {
        setSuccess(`Status for student application updated to '${newStatus}' and saved to MongoDB Atlas.`);
        setUpdatingApp(null);
        fetchApplications();
      } else {
        setError(res.message || 'Failed to update application status.');
      }
    } catch (err: any) {
      setError(err.message || 'Error updating application status.');
    } finally {
      setUpdating(false);
    }
  };

  const filteredApplications = applications.filter((app: any) => {
    const studentName = (app.studentUserId?.name || '').toLowerCase();
    const rollNumber = (app.studentProfile?.rollNumber || '').toLowerCase();
    const department = (app.studentProfile?.department || '').toLowerCase();
    const jobRole = (app.placementId?.jobRole || '').toLowerCase();
    const company = (app.placementId?.companyName || '').toLowerCase();

    const matchesSearch =
      studentName.includes(searchTerm.toLowerCase()) ||
      rollNumber.includes(searchTerm.toLowerCase()) ||
      department.includes(searchTerm.toLowerCase()) ||
      jobRole.includes(searchTerm.toLowerCase()) ||
      company.includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesPlacement =
      placementFilter === 'All' ||
      (app.placementId?._id || app.placementId) === placementFilter;

    return matchesSearch && matchesStatus && matchesPlacement;
  });

  const statusColors: Record<string, string> = {
    Applied: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Shortlisted: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Interview: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    Selected: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading Student Applications from MongoDB Atlas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            Candidate Applications
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review student applicants, update selection stages, and communicate interview status
          </p>
        </div>
        <button
          onClick={fetchApplications}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Refresh Data</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search student, roll no, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-cyan-500"
            >
              <option value="All">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Job Drive Filter */}
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span>Job Drive:</span>
            <select
              value={placementFilter}
              onChange={(e) => setPlacementFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-cyan-500 max-w-[200px]"
            >
              <option value="All">All Placement Drives</option>
              {placements.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.companyName} - {p.jobRole}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      {filteredApplications.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto my-8 space-y-3">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No applications found.</h3>
          <p className="text-xs text-slate-400">
            No student applications match the selected filter criteria.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/60 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Student Info</th>
                  <th className="py-3.5 px-4">Department & Roll No</th>
                  <th className="py-3.5 px-4">Job Role</th>
                  <th className="py-3.5 px-4">CGPA</th>
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredApplications.map((app: any) => {
                  const studentName = app.studentUserId?.name || 'Student';
                  const studentEmail = app.studentUserId?.email || '';
                  const rollNumber = app.studentProfile?.rollNumber || 'N/A';
                  const department = app.studentProfile?.department || 'N/A';
                  const cgpa = app.studentProfile?.cgpa ?? 'N/A';
                  const companyName = app.placementId?.companyName || 'Company';
                  const jobRole = app.placementId?.jobRole || 'Role';
                  const appliedDate = app.createdAt
                    ? new Date(app.createdAt).toLocaleDateString()
                    : 'Recent';

                  return (
                    <tr key={app._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{studentName}</div>
                        <div className="text-[11px] text-slate-400">{studentEmail}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-cyan-300">{rollNumber}</span>
                        <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{department}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{jobRole}</div>
                        <div className="text-[11px] text-slate-400">{companyName}</div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-white text-sm">{cgpa}</td>

                      <td className="py-3.5 px-4 text-slate-400">{appliedDate}</td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                            statusColors[app.status] || 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => openStatusModal(app)}
                          className="px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all inline-flex items-center gap-1"
                        >
                          <span>Update Stage</span>
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {updatingApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative">
            <div>
              <h2 className="text-lg font-bold text-white">Update Application Status</h2>
              <p className="text-xs text-slate-400 mt-1">
                Updating stage for <span className="text-white font-semibold">{updatingApp.studentUserId?.name}</span> ({updatingApp.placementId?.companyName})
              </p>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Select Selection Stage</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setNewStatus(st)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        newStatus === st
                          ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-500/20'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Notes / Interview Instructions (Optional)
                </label>
                <textarea
                  rows={3}
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="e.g., Technical Interview scheduled on March 18th at 10:00 AM IST via Google Meet."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setUpdatingApp(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Save Stage Update</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
