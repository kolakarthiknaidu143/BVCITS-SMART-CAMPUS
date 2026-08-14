import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { JobApplication } from '../../types';
import { Users, Search, RefreshCw, AlertCircle, Building2, GraduationCap } from 'lucide-react';

export const RecruiterShortlistedPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<JobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchShortlisted = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<any>('/recruiter/shortlisted');
      if (res.success) {
        setCandidates(res.applications || []);
      } else {
        setError(res.message || 'Unable to load shortlisted candidates.');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to load shortlisted candidates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlisted();
  }, []);

  const filteredCandidates = candidates.filter((app: any) => {
    const name = (app.studentUserId?.name || '').toLowerCase();
    const rollNo = (app.studentProfile?.rollNumber || '').toLowerCase();
    const dept = (app.studentProfile?.department || '').toLowerCase();
    const role = (app.placementId?.jobRole || '').toLowerCase();
    const company = (app.placementId?.companyName || '').toLowerCase();

    return (
      name.includes(searchTerm.toLowerCase()) ||
      rollNo.includes(searchTerm.toLowerCase()) ||
      dept.includes(searchTerm.toLowerCase()) ||
      role.includes(searchTerm.toLowerCase()) ||
      company.includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading Shortlisted Candidates from MongoDB Atlas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-400" />
            Shortlisted Candidates
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Candidates qualified for technical screening and initial interviews
          </p>
        </div>
        <button
          onClick={fetchShortlisted}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex items-center justify-between max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search candidate name, roll no, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Candidates List */}
      {filteredCandidates.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto my-8 space-y-3">
          <Users className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No shortlisted candidates.</h3>
          <p className="text-xs text-slate-400">
            No candidates are currently marked as Shortlisted for your placement drives.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((app: any) => {
            const studentName = app.studentUserId?.name || 'Candidate';
            const email = app.studentUserId?.email || '';
            const phone = app.studentUserId?.phone || 'N/A';
            const rollNo = app.studentProfile?.rollNumber || 'N/A';
            const dept = app.studentProfile?.department || 'N/A';
            const cgpa = app.studentProfile?.cgpa ?? 'N/A';
            const company = app.placementId?.companyName || 'Company';
            const jobRole = app.placementId?.jobRole || 'Role';

            return (
              <div
                key={app._id}
                className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base">{studentName}</h3>
                      <p className="text-xs text-amber-400 font-semibold">{rollNo}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                      Shortlisted
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
                    <p className="text-slate-400 text-[11px] truncate">{email}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1 text-xs">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Placement Drive:</p>
                    <p className="font-semibold text-white">{jobRole}</p>
                    <p className="text-[11px] text-cyan-300">{company}</p>
                  </div>

                  {app.notes && (
                    <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-800/30 text-[11px] text-amber-200">
                      <strong>Notes:</strong> {app.notes}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
