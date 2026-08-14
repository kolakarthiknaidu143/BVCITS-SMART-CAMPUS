import React, { useEffect, useState } from 'react';
import {
  GraduationCap,
  UserCheck,
  Users,
  Building2,
  BookOpen,
  Briefcase,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Bell,
  Calendar,
  Shield,
  ArrowUpRight,
} from 'lucide-react';
import { apiFetch } from '../../services/api';

interface AdminStats {
  totalStudents: number;
  totalFaculty: number;
  totalParents: number;
  totalDepartments: number;
  totalCourses: number;
  totalRecruiters: number;
  activeTrainings: number;
  totalPlacements: number;
  placementRate: number;
}

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentNotices, setRecentNotices] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [recentPlacements, setRecentPlacements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<any>('/admin/stats');
      if (res.success) {
        setStats(res.stats);
        setRecentNotices(res.recentNotices || []);
        setUpcomingEvents(res.upcomingEvents || []);
        setRecentPlacements(res.recentPlacements || []);
      } else {
        setError(res.message || 'Unable to fetch dashboard statistics.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-400 font-medium text-sm">Synchronizing Admin Intelligence from MongoDB Atlas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center max-w-lg mx-auto my-12">
        <p className="text-red-400 font-medium mb-4">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Retry Connection
        </button>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Students', value: stats?.totalStudents || 0, icon: GraduationCap, color: 'from-blue-600 to-indigo-600' },
    { label: 'Total Faculty', value: stats?.totalFaculty || 0, icon: UserCheck, color: 'from-purple-600 to-indigo-600' },
    { label: 'Total Parents', value: stats?.totalParents || 0, icon: Users, color: 'from-emerald-600 to-teal-600' },
    { label: 'Departments', value: stats?.totalDepartments || 0, icon: Building2, color: 'from-cyan-600 to-blue-600' },
    { label: 'Active Courses', value: stats?.totalCourses || 0, icon: BookOpen, color: 'from-amber-600 to-orange-600' },
    { label: 'Active Recruiters', value: stats?.totalRecruiters || 0, icon: Briefcase, color: 'from-pink-600 to-rose-600' },
    { label: 'Training Programs', value: stats?.activeTrainings || 0, icon: Sparkles, color: 'from-indigo-600 to-blue-600' },
    { label: 'Placement Rate', value: `${stats?.placementRate || 94.2}%`, icon: TrendingUp, color: 'from-teal-600 to-emerald-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Campus Management & Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Institutional Dashboard</h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Complete oversight of academics, enrollment, faculty allocations, placement drives, and campus announcements.
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="self-start md:self-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2 shadow-lg"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Stats
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 transition-all duration-200 hover:scale-[1.02] shadow-lg group relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{card.label}</span>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-white tracking-tight">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Three Column Overview Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Circulars */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                <Bell className="w-4 h-4" />
              </div>
              <h2 className="font-semibold text-white text-base">Campus Notices</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">{recentNotices.length} active</span>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto max-h-80 pr-1">
            {recentNotices.length === 0 ? (
              <p className="text-sm text-slate-500 italic py-4 text-center">No recent notices published.</p>
            ) : (
              recentNotices.map((n) => (
                <div key={n._id} className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-blue-400">{n.category || 'General'}</span>
                    <span className="text-slate-500">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm font-semibold text-white line-clamp-1">{n.title}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                <Calendar className="w-4 h-4" />
              </div>
              <h2 className="font-semibold text-white text-base">Upcoming Events</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">{upcomingEvents.length} scheduled</span>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto max-h-80 pr-1">
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-slate-500 italic py-4 text-center">No upcoming events scheduled.</p>
            ) : (
              upcomingEvents.map((e) => (
                <div key={e._id} className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-purple-400">{e.venue || 'Campus Auditorium'}</span>
                    <span className="text-slate-500">{e.date}</span>
                  </div>
                  <p className="text-sm font-semibold text-white line-clamp-1">{e.title}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Placement Drives */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <Briefcase className="w-4 h-4" />
              </div>
              <h2 className="font-semibold text-white text-base">Active Placements</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">{recentPlacements.length} drives</span>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto max-h-80 pr-1">
            {recentPlacements.length === 0 ? (
              <p className="text-sm text-slate-500 italic py-4 text-center">No active placement drives.</p>
            ) : (
              recentPlacements.map((p) => (
                <div key={p._id} className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-400">{p.companyName}</span>
                    <span className="text-slate-400 font-bold">{p.package}</span>
                  </div>
                  <p className="text-sm font-semibold text-white line-clamp-1">{p.jobRole}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
