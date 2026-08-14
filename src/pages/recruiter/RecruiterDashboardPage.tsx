import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { PlacementDrive, JobApplication, EventItem } from '../../types';
import {
  Briefcase,
  Users,
  UserCheck,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Building2,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecruiterDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    activeJobPostings: number;
    totalApplications: number;
    shortlistedCandidates: number;
    interviewCandidates: number;
    selectedCandidates: number;
    rejectedCandidates: number;
  } | null>(null);
  const [recentApplications, setRecentApplications] = useState<JobApplication[]>([]);
  const [activePlacements, setActivePlacements] = useState<PlacementDrive[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<Record<string, number>>({});

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<any>('/recruiter/stats');
      if (res.success) {
        setStats(res.stats);
        setRecentApplications(res.recentApplications || []);
        setActivePlacements(res.activePlacements || []);
        setEvents(res.events || []);
        setStatusDistribution(res.statusDistribution || {});
      } else {
        setError(res.message || 'Unable to load recruiter data.');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to load recruiter data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading Recruiter Dashboard from MongoDB Atlas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900/80 border border-rose-800/50 rounded-2xl p-8 text-center max-w-xl mx-auto my-12 shadow-xl">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">Dashboard Error</h3>
        <p className="text-sm text-slate-300 mb-6">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    Applied: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Shortlisted: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Interview: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    Selected: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Building2 className="w-64 h-64 text-cyan-400" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Corporate Placement Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Recruiter Command Center
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Manage your company's placement drives, review student applications, schedule interviews, and select top BVCITS talent.
          </p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Postings</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats?.activeJobPostings ?? 0}</p>
          <p className="text-[11px] text-slate-400 mt-1">Active drives in portal</p>
        </div>

        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Applications</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats?.totalApplications ?? 0}</p>
          <p className="text-[11px] text-slate-400 mt-1">Total received</p>
        </div>

        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Shortlisted</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats?.shortlistedCandidates ?? 0}</p>
          <p className="text-[11px] text-amber-400 font-medium mt-1">Qualified candidates</p>
        </div>

        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Interviews</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats?.interviewCandidates ?? 0}</p>
          <p className="text-[11px] text-indigo-400 font-medium mt-1">In interview stage</p>
        </div>

        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Selected</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats?.selectedCandidates ?? 0}</p>
          <p className="text-[11px] text-emerald-400 font-medium mt-1">Hired candidates</p>
        </div>

        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rejected</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats?.rejectedCandidates ?? 0}</p>
          <p className="text-[11px] text-rose-400 font-medium mt-1">Not selected</p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3): Recent Applications & Active Drives */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Applications Table */}
          <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Recent Student Applications</h2>
                <p className="text-xs text-slate-400">Latest applicants across your job drives</p>
              </div>
              <Link
                to="/recruiter/applications"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentApplications.length === 0 ? (
              <p className="text-sm text-slate-400 py-8 text-center italic">No data available.</p>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs text-slate-300 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="py-3 px-3">Student Name</th>
                      <th className="py-3 px-3">Roll No & Dept</th>
                      <th className="py-3 px-3">Job Role</th>
                      <th className="py-3 px-3">CGPA</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {recentApplications.map((app: any) => {
                      const studentName = app.studentUserId?.name || 'Student';
                      const rollNumber = app.studentProfile?.rollNumber || 'N/A';
                      const department = app.studentProfile?.department || 'N/A';
                      const cgpa = app.studentProfile?.cgpa ?? 'N/A';
                      const jobRole = app.placementId?.jobRole || 'Placement Role';

                      return (
                        <tr key={app._id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-3 font-semibold text-white">{studentName}</td>
                          <td className="py-3 px-3">
                            <span className="text-slate-200 font-semibold">{rollNumber}</span>
                            <span className="block text-[10px] text-slate-400 truncate max-w-[120px]">{department}</span>
                          </td>
                          <td className="py-3 px-3 text-cyan-300 font-medium">{jobRole}</td>
                          <td className="py-3 px-3 font-bold text-white">{cgpa}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                statusColors[app.status] || 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {app.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Active Placement Drives */}
          <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Active Placement Drives</h2>
                <p className="text-xs text-slate-400">Current open job postings for BVCITS students</p>
              </div>
              <Link
                to="/recruiter/jobs"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
              >
                <span>Manage Postings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {activePlacements.length === 0 ? (
              <p className="text-sm text-slate-400 py-8 text-center italic">No active job postings.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activePlacements.map((drive) => (
                  <div key={drive._id} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-white text-sm">{drive.companyName}</h3>
                        <p className="text-xs text-cyan-300 font-semibold">{drive.jobRole}</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {drive.package}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>📍 {drive.location}</span>
                      <span>Min CGPA: {drive.eligibilityCGPA}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-800">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        Deadline: {drive.deadline}
                      </span>
                      <Link
                        to="/recruiter/jobs"
                        className="text-cyan-400 hover:underline font-semibold"
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1/3): Status Distribution & Upcoming Events */}
        <div className="space-y-8">
          {/* Status Breakdown Panel */}
          <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white">Application Pipeline</h2>
            <p className="text-xs text-slate-400">Distribution across selection stages</p>

            <div className="space-y-3 pt-2">
              {['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'].map((st) => {
                const count = statusDistribution[st] || 0;
                const total = stats?.totalApplications || 1;
                const percentage = Math.round((count / (total === 0 ? 1 : total)) * 100);

                return (
                  <div key={st} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300">{st}</span>
                      <span className="font-bold text-white">
                        {count} <span className="text-[10px] text-slate-500">({percentage}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          st === 'Applied'
                            ? 'bg-blue-500'
                            : st === 'Shortlisted'
                            ? 'bg-amber-500'
                            : st === 'Interview'
                            ? 'bg-indigo-500'
                            : st === 'Selected'
                            ? 'bg-emerald-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.max(percentage, count > 0 ? 5 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Campus Events */}
          <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Campus Recruitment Events</h2>
              <Link to="/recruiter/events" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300">
                View
              </Link>
            </div>

            {events.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center italic">No upcoming events.</p>
            ) : (
              <div className="space-y-3">
                {events.map((evt) => (
                  <div key={evt._id} className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
                    <h3 className="font-semibold text-xs text-white">{evt.title}</h3>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>📅 {evt.date}</span>
                      <span>📍 {evt.venue}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
