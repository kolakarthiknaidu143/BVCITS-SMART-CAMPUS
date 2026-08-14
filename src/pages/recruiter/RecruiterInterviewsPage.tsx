import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { JobApplication } from '../../types';
import {
  Calendar,
  Search,
  RefreshCw,
  AlertCircle,
  Building2,
  GraduationCap,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';

export const RecruiterInterviewsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [interviews, setInterviews] = useState<JobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Action state
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchInterviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<any>('/recruiter/interviews');
      if (res.success) {
        setInterviews(res.applications || []);
      } else {
        setError(res.message || 'Unable to load interview candidates.');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to load interview candidates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleFinalDecision = async (appId: string, status: 'Selected' | 'Rejected') => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await apiFetch<any>(`/recruiter/applications/${appId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, notes: actionNotes }),
      });

      if (res.success) {
        setSuccess(`Candidate decision updated to '${status}'. Saved to MongoDB Atlas.`);
        setUpdatingId(null);
        setActionNotes('');
        fetchInterviews();
      } else {
        setError(res.message || 'Failed to update interview decision.');
      }
    } catch (err: any) {
      setError(err.message || 'Error updating decision.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredInterviews = interviews.filter((app: any) => {
    const name = (app.studentUserId?.name || '').toLowerCase();
    const rollNo = (app.studentProfile?.rollNumber || '').toLowerCase();
    const dept = (app.studentProfile?.department || '').toLowerCase();
    const role = (app.placementId?.jobRole || '').toLowerCase();

    return (
      name.includes(searchTerm.toLowerCase()) ||
      rollNo.includes(searchTerm.toLowerCase()) ||
      dept.includes(searchTerm.toLowerCase()) ||
      role.includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading Interview Candidates from MongoDB Atlas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-400" />
            Interview Candidates & Rounds
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track interview stage candidates, log feedback, and declare final hiring decisions
          </p>
        </div>
        <button
          onClick={fetchInterviews}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
          <span>Refresh</span>
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

      {/* Search Bar */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex items-center justify-between max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search candidate, roll no, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Interviews Grid */}
      {filteredInterviews.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto my-8 space-y-3">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No upcoming interviews.</h3>
          <p className="text-xs text-slate-400">
            No candidates are currently scheduled in the Interview stage.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInterviews.map((app: any) => {
            const studentName = app.studentUserId?.name || 'Candidate';
            const rollNo = app.studentProfile?.rollNumber || 'N/A';
            const dept = app.studentProfile?.department || 'N/A';
            const cgpa = app.studentProfile?.cgpa ?? 'N/A';
            const company = app.placementId?.companyName || 'Company';
            const jobRole = app.placementId?.jobRole || 'Role';
            const isEditing = updatingId === app._id;

            return (
              <div
                key={app._id}
                className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base">{studentName}</h3>
                      <p className="text-xs text-indigo-400 font-semibold">{rollNo}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                      In Interview
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-300">
                    <p className="text-slate-400 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                      <span>{dept}</span>
                    </p>
                    <p className="flex items-center gap-1.5 font-medium">
                      <span>CGPA:</span>
                      <strong className="text-white">{cgpa}</strong>
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1 text-xs">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Role Details:</p>
                    <p className="font-semibold text-white">{jobRole}</p>
                    <p className="text-[11px] text-cyan-300">{company}</p>
                  </div>

                  {app.notes && (
                    <div className="p-2.5 rounded-xl bg-indigo-950/20 border border-indigo-800/30 text-[11px] text-indigo-200">
                      <strong>Interview Notes:</strong> {app.notes}
                    </div>
                  )}

                  {isEditing && (
                    <div className="pt-2 space-y-2 border-t border-slate-800">
                      <textarea
                        rows={2}
                        value={actionNotes}
                        onChange={(e) => setActionNotes(e.target.value)}
                        placeholder="Feedback / Offer details..."
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleFinalDecision(app._id, 'Selected')}
                          disabled={submitting}
                          className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Select (Hire)</span>
                        </button>
                        <button
                          onClick={() => handleFinalDecision(app._id, 'Rejected')}
                          disabled={submitting}
                          className="flex-1 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {!isEditing && (
                  <div className="pt-4 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setUpdatingId(app._id);
                        setActionNotes(app.notes || '');
                      }}
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold transition-all"
                    >
                      Declare Hiring Decision
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
