import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../services/api';
import {
  CalendarCheck,
  GraduationCap,
  Briefcase,
  Award,
  Bell,
  Calendar,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  MapPin,
  RefreshCw,
  AlertCircle,
  UserCheck,
  Building2,
  ChevronRight,
  Code,
  Layers,
} from 'lucide-react';
import {
  StudentProfile,
  CourseItem,
  AttendanceRecord,
  MarkRecord,
  NoticeItem,
  EventItem,
  PlacementDrive,
  JobApplication,
  TrainingProgram,
} from '../../types';

interface DashboardData {
  profile: StudentProfile & {
    userId: { name: string; email: string; phone?: string };
    parent?: { name: string; email: string; phone?: string };
  };
  courses: CourseItem[];
  attendanceRecords: AttendanceRecord[];
  marksRecords: MarkRecord[];
  notices: NoticeItem[];
  events: EventItem[];
  placementDrives: PlacementDrive[];
  applications: JobApplication[];
  trainings: TrainingProgram[];
}

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ success: boolean; data: DashboardData }>('/students/dashboard');
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setError('Unable to load dashboard information.');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to connect to BVCITS Smart Campus servers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 rounded-3xl bg-slate-900 border border-slate-800" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-slate-900 border border-slate-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 rounded-2xl bg-slate-900 border border-slate-800" />
          <div className="h-72 rounded-2xl bg-slate-900 border border-slate-800" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-slate-900/60 rounded-3xl border border-slate-800">
        <AlertCircle className="w-12 h-12 text-rose-400 mb-3" />
        <h3 className="text-lg font-bold text-white mb-1">Dashboard Data Unavailable</h3>
        <p className="text-xs text-slate-400 max-w-md mb-6">{error || 'Failed to fetch student data from server.'}</p>
        <button
          onClick={fetchDashboard}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  const { profile, courses, attendanceRecords, marksRecords, notices, events, placementDrives, applications, trainings } = data;

  // Calculate placement status
  const shortlistApp = applications.find((a) => a.status === 'Shortlisted' || a.status === 'Selected');
  const placementStatusText = shortlistApp
    ? `${shortlistApp.status}`
    : applications.length > 0
    ? 'Applied'
    : profile.cgpa >= 7.0
    ? 'Eligible'
    : 'Ineligible';

  // Subject attendance breakdown calculation
  const subjectAttendance: Record<string, { total: number; present: number; percentage: number }> = {};
  attendanceRecords.forEach((rec) => {
    if (!subjectAttendance[rec.subject]) {
      subjectAttendance[rec.subject] = { total: 0, present: 0, percentage: 0 };
    }
    subjectAttendance[rec.subject].total += 1;
    if (rec.status === 'Present') {
      subjectAttendance[rec.subject].present += 1;
    }
  });

  Object.keys(subjectAttendance).forEach((subj) => {
    const item = subjectAttendance[subj];
    item.percentage = item.total > 0 ? Math.round((item.present / item.total) * 100) : 0;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* 1. WELCOME SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 border border-indigo-500/20 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>BVCITS Student Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {getGreeting()}, <span className="text-indigo-400">{user?.name || profile.userId?.name}</span>!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Here's what's happening with your campus journey today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/student/profile"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 transition-all flex items-center gap-1.5"
            >
              <span>{profile.rollNumber}</span>
              <span className="text-slate-400">•</span>
              <span>Sem {profile.semester}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Attendance */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attendance</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{profile.attendancePercentage}%</div>
          <div className="mt-2 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                profile.attendancePercentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(profile.attendancePercentage, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            {profile.attendancePercentage >= 75 ? (
              <span className="text-emerald-400 font-medium">Eligible for examinations</span>
            ) : (
              <span className="text-rose-400 font-medium">Below required 75% threshold</span>
            )}
          </p>
        </div>

        {/* Card 2: CGPA */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cumulative GPA</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <img
    src="/bvcits-logo.jpeg"
    alt="BVCITS Logo"
    className="w-full h-full object-fill"
  />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{profile.cgpa.toFixed(2)}</div>
          <p className="text-[11px] text-slate-400 mt-2">
            Academic standing: <span className="text-indigo-300 font-semibold">First Class Distinction</span>
          </p>
        </div>

        {/* Card 3: Semester */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Semester</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">Semester {profile.semester}</div>
          <p className="text-[11px] text-slate-400 mt-2 truncate">
            Dept: <span className="text-purple-300 font-semibold">{profile.department}</span>
          </p>
        </div>

        {/* Card 4: Placement Status */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Placement Status</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 uppercase">{placementStatusText}</div>
          <p className="text-[11px] text-slate-400 mt-2">
            Active applications: <span className="text-emerald-300 font-semibold">{applications.length} Drives</span>
          </p>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* ATTENDANCE BREAKDOWN */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <CalendarCheck className="w-5 h-5 text-blue-400" />
                <h2 className="text-base font-bold text-white">Subject-wise Attendance</h2>
              </div>
              <Link to="/student/attendance" className="text-xs font-semibold text-indigo-400 hover:underline">
                Full Summary →
              </Link>
            </div>

            {Object.keys(subjectAttendance).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(subjectAttendance).map(([subj, item]) => (
                  <div key={subj} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-slate-200 truncate pr-2">{subj}</span>
                      <span className={`font-bold ${item.percentage >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          item.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2">
                      <span>Attended: {item.present}/{item.total} classes</span>
                      <span>Target: 75%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800/50">
                No subject-wise attendance logs recorded yet.
              </div>
            )}
          </div>

          {/* ACADEMIC MARKS */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-bold text-white">Academic Performance & Internal Marks</h2>
              </div>
              <Link to="/student/marks" className="text-xs font-semibold text-indigo-400 hover:underline">
                View Report Card →
              </Link>
            </div>

            {marksRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                      <th className="pb-3 px-2">Subject</th>
                      <th className="pb-3 px-2">Exam Type</th>
                      <th className="pb-3 px-2">Score</th>
                      <th className="pb-3 px-2 text-right">Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {marksRecords.map((m) => {
                      const pct = Math.round((m.marksObtained / m.maxMarks) * 100);
                      return (
                        <tr key={m._id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-2 font-medium text-slate-200">{m.subject}</td>
                          <td className="py-3 px-2 text-slate-400">
                            <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 text-[10px] font-bold">
                              {m.examType}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-slate-200 font-semibold">
                            {m.marksObtained} / {m.maxMarks}
                          </td>
                          <td className="py-3 px-2 text-right font-bold text-emerald-400">{pct}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800/50">
                No exam marks published for current semester yet.
              </div>
            )}
          </div>

          {/* PLACEMENT OPPORTUNITIES */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white">Eligible Placement Drives</h2>
              </div>
              <Link to="/student/placements" className="text-xs font-semibold text-indigo-400 hover:underline">
                View All Jobs →
              </Link>
            </div>

            {placementDrives.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {placementDrives.map((p) => {
                  const applied = applications.some((a) => (typeof a.placementId === 'object' ? a.placementId._id : a.placementId) === p._id);
                  return (
                    <div key={p._id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                            {p.package}
                          </span>
                          <span className="text-[11px] text-slate-400">{p.location}</span>
                        </div>
                        <h3 className="text-sm font-bold text-white">{p.companyName}</h3>
                        <p className="text-xs font-medium text-indigo-300 mt-0.5">{p.jobRole}</p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-slate-500">CGPA ≥ {p.eligibilityCGPA}</span>
                        <Link
                          to="/student/placements"
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                            applied ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                          }`}
                        >
                          {applied ? 'Applied ✓' : 'View Job'}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800/50">
                No active placement drives currently match your CGPA profile.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN (1 Col) */}
        <div className="space-y-6">
          {/* PROFILE CARD */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Student Profile</span>
              <Link to="/student/profile" className="text-xs font-semibold text-indigo-400 hover:underline">
                Edit Profile
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500">Name:</span>
                <p className="font-bold text-white text-sm">{user?.name || profile.userId?.name}</p>
              </div>
              <div>
                <span className="text-slate-500">Roll Number:</span>
                <p className="font-medium text-slate-200">{profile.rollNumber}</p>
              </div>
              <div>
                <span className="text-slate-500">Email:</span>
                <p className="font-medium text-slate-200">{user?.email || profile.userId?.email}</p>
              </div>
              <div>
                <span className="text-slate-500">Department:</span>
                <p className="font-medium text-indigo-300">{profile.department}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500">Semester:</span>
                  <p className="font-medium text-slate-200">{profile.semester}</p>
                </div>
                <div>
                  <span className="text-slate-500">Phone:</span>
                  <p className="font-medium text-slate-200">{user?.phone || '+91 --'}</p>
                </div>
              </div>

              {profile.skills && profile.skills.length > 0 && (
                <div className="pt-2">
                  <span className="text-slate-500">Skills:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {profile.skills.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300 text-[10px] font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* LATEST NOTICES */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Campus Notices</h3>
              </div>
              <Link to="/student/notices" className="text-[11px] font-semibold text-indigo-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {notices.length > 0 ? (
                notices.slice(0, 3).map((n) => (
                  <div key={n._id} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40 uppercase">
                      {n.category}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-1.5 line-clamp-1">{n.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{n.description}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">No active notices</div>
              )}
            </div>
          </div>

          {/* UPCOMING EVENTS */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Campus Events</h3>
              </div>
              <Link to="/student/events" className="text-[11px] font-semibold text-indigo-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {events.length > 0 ? (
                events.slice(0, 2).map((e) => (
                  <div key={e._id} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start space-x-3">
                    <div className="p-2 rounded-xl bg-purple-950 text-purple-300 border border-purple-800/40 shrink-0 text-center min-w-[48px]">
                      <div className="text-[10px] font-bold uppercase">{e.date.split('-')[1] || 'MAR'}</div>
                      <div className="text-sm font-black">{e.date.split('-')[2] || '12'}</div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{e.title}</h4>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                        <span>{e.time}</span>
                        <span>•</span>
                        <span>{e.venue}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">No upcoming events scheduled</div>
              )}
            </div>
          </div>

          {/* TRAINING PROGRAMS */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Skill Training</h3>
              </div>
              <Link to="/student/training" className="text-[11px] font-semibold text-indigo-400 hover:underline">
                View Bootcamps
              </Link>
            </div>

            {trainings.length > 0 ? (
              trainings.slice(0, 1).map((t) => (
                <div key={t._id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                    {t.duration}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1.5">{t.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{t.description}</p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-500">No skill bootcamps active</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
