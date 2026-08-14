import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import {
  Briefcase,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Building2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { PlacementDrive, JobApplication, StudentProfile } from '../../types';

export const StudentPlacementsPage: React.FC = () => {
  const [placements, setPlacements] = useState<PlacementDrive[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [placementsRes, appsRes, profileRes] = await Promise.all([
        apiFetch<{ success: boolean; placements: PlacementDrive[] }>('/placements'),
        apiFetch<{ success: boolean; data: JobApplication[] }>('/students/applications'),
        apiFetch<{ success: boolean; data: StudentProfile }>('/students/profile'),
      ]);

      if (placementsRes.success) setPlacements(placementsRes.placements || []);
      if (appsRes.success) setApplications(appsRes.data || []);
      if (profileRes.success) setStudentProfile(profileRes.data || null);
    } catch (err: any) {
      setError(err.message || 'Error fetching placement drives.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApply = async (placementId: string) => {
    setApplyingId(placementId);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await apiFetch<{ success: boolean; message: string; application: JobApplication }>(
        `/placements/${placementId}/apply`,
        { method: 'POST' }
      );

      if (res.success) {
        setSuccessMsg(res.message || 'Application submitted successfully!');
        setApplications((prev) => [...prev, res.application]);
      } else {
        setError(res.message || 'Failed to submit application.');
      }
    } catch (err: any) {
      setError(err.message || 'Error applying for placement drive.');
    } finally {
      setApplyingId(null);
    }
  };

  const filteredPlacements = placements.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.companyName.toLowerCase().includes(q) ||
      p.jobRole.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.package.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse font-sans">
        <div className="h-32 rounded-3xl bg-slate-900 border border-slate-800" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-slate-900 border border-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Campus Placement Cell</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Campus Recruitment Drives</h1>
          <p className="text-xs text-slate-300 mt-1">
            Apply to top IT, software, and engineering corporations active for BVCITS students
          </p>
        </div>

        {studentProfile && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs flex items-center space-x-4 shrink-0">
            <div>
              <span className="text-slate-400 block text-[10px]">Your CGPA</span>
              <span className="text-lg font-black text-emerald-400">{studentProfile.cgpa.toFixed(2)}</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-slate-400 block text-[10px]">Applications</span>
              <span className="text-lg font-black text-indigo-400">{applications.length} Drives</span>
            </div>
          </div>
        )}
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex items-center space-x-3">
        <Search className="w-4 h-4 text-slate-500 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by company name, job role, package, or location..."
          className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Placements Grid */}
      {filteredPlacements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPlacements.map((drive) => {
            const app = applications.find(
              (a) => (typeof a.placementId === 'object' ? a.placementId._id : a.placementId) === drive._id
            );
            const isApplied = !!app;
            const isEligible = studentProfile ? studentProfile.cgpa >= drive.eligibilityCGPA : true;

            return (
              <div
                key={drive._id}
                className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-indigo-500/40 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40 uppercase tracking-wider">
                        {drive.jobRole}
                      </span>
                      <h2 className="text-lg font-bold text-white mt-2">{drive.companyName}</h2>
                    </div>
                    <span className="text-base font-black text-emerald-400 px-3 py-1 rounded-xl bg-emerald-950/50 border border-emerald-800/50">
                      {drive.package}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                    {drive.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 mb-4 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{drive.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Deadline: {drive.deadline}</span>
                    </div>
                  </div>

                  {drive.requirements && drive.requirements.length > 0 && (
                    <div className="mb-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Requirements
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {drive.requirements.map((req, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs">
                    {isEligible ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Eligible (CGPA ≥ {drive.eligibilityCGPA})
                      </span>
                    ) : (
                      <span className="text-rose-400 font-semibold flex items-center gap-1 text-[11px]">
                        <XCircle className="w-3.5 h-3.5" />
                        Ineligible (Req CGPA ≥ {drive.eligibilityCGPA})
                      </span>
                    )}
                  </div>

                  {isApplied ? (
                    <span className="px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Applied ({app.status})</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(drive._id)}
                      disabled={!isEligible || applyingId === drive._id}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:hover:bg-indigo-600"
                    >
                      {applyingId === drive._id ? (
                        <span>Applying...</span>
                      ) : (
                        <>
                          <span>Apply Now</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center text-xs text-slate-500 bg-slate-900/60 rounded-3xl border border-slate-800">
          No active recruitment drives match your search query.
        </div>
      )}
    </div>
  );
};
