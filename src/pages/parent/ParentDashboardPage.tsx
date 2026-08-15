import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  Award,
  Briefcase,
  AlertTriangle,
  BellRing,
  Calendar,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  ArrowUpRight,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { apiFetch } from '../../services/api';
import { NoticeItem, EventItem, NotificationItem } from '../../types';

interface DashboardData {
  student: {
    _id: string;
    userId: {
      _id: string;
      name: string;
      email: string;
      phone?: string;
    };
    rollNumber: string;
    department: string;
    semester: number;
    cgpa: number;
    attendancePercentage: number;
    skills?: string[];
  };
  attendanceSummary: {
    overallPercentage: number;
    totalClasses: number;
    presentClasses: number;
    absentClasses: number;
    isLowAttendance: boolean;
    recentRecords: Array<{
      _id: string;
      subject: string;
      date: string;
      status: 'Present' | 'Absent';
    }>;
  };
  academicSummary: {
    cgpa: number;
    totalMarksEvaluated: number;
    recentMarks: Array<{
      _id: string;
      subject: string;
      examType: string;
      marksObtained: number;
      maxMarks: number;
    }>;
  };
  placementSummary: {
    eligibleDrivesCount: number;
    applicationsCount: number;
    shortlistedCount: number;
    selectedCount: number;
    recentApplications: Array<{
      _id: string;
      status: string;
      appliedAt: string;
      placementId: {
        companyName: string;
        jobRole: string;
        package: string;
      };
    }>;
  };
  trainingSummary: {
    enrolledCount: number;
    trainings: Array<{
      _id: string;
      title: string;
      trainerName: string;
      category?: string;
      duration: string;
      status: string;
      progressPercentage: number;
      grade: string;
      attendanceCount: number;
      totalSessions: number;
      feedback?: string;
    }>;
  };
  notices: NoticeItem[];
  events: EventItem[];
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
}

export const ParentDashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch<{ success: boolean; data: DashboardData }>('/parent/dashboard');
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError('Failed to load parent dashboard data.');
        }
      } catch (err: any) {
        setError(err.message || 'Error connecting to BVCITS server.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-400">Loading Ward Academic Portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center max-w-xl mx-auto my-12 shadow-2xl">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7 text-rose-400" />
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Student Information Unavailable</h2>
        <p className="text-xs text-slate-400 mb-6">{error || 'No student is currently linked to this parent account.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
        >
          Retry Fetching Data
        </button>
      </div>
    );
  }

  const { student, attendanceSummary, academicSummary, placementSummary, trainingSummary, notices, events } = data;

  return (
    <div className="space-y-8 font-sans">
      {/* Top Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Users className="w-3.5 h-3.5" />
            <span>Ward Academic Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {student.userId?.name || 'Student Portfolio'}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-300 font-medium">
            <span>Roll No: <strong className="text-white">{student.rollNumber}</strong></span>
            <span>•</span>
            <span>Department: <strong className="text-white">{student.department}</strong></span>
            <span>•</span>
            <span>Semester: <strong className="text-white">{student.semester}th Sem</strong></span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/parent/attendance"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <CalendarCheck className="w-4 h-4 text-emerald-400" />
            <span>Attendance Log</span>
          </Link>
          <Link
  to="/parent/marks"
  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
>
  <img
    src="/bvcits-logo.jpeg"
    alt="BVCITS Logo"
    className="w-full h-full object-fill"
  />
  <span>View Marks</span>
</Link>
        </div>
      </div>

      {/* Attendance Warning Banner if below threshold */}
      {attendanceSummary.isLowAttendance && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/40 border border-amber-800/60 flex items-start space-x-4">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-amber-200">Attendance Alert: Below Mandatory 75% Threshold</h3>
            <p className="text-xs text-amber-300/80 mt-1">
              Your ward has maintained <strong className="text-amber-200">{attendanceSummary.overallPercentage}%</strong> attendance.
              A minimum of 75% overall attendance is required by the university to be eligible for semester end examinations.
            </p>
          </div>
          <Link
            to="/parent/attendance"
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shrink-0 self-center hidden sm:inline-block"
          >
            Details
          </Link>
        </div>
      )}

      {/* High-Level Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* CGPA Card */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cumulative GPA</span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white tracking-tight">{student.cgpa.toFixed(2)}</div>
            <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Out of 10.0 Scale</span>
            </div>
          </div>
        </div>

        {/* Overall Attendance Card */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Attendance</span>
            <div className={`p-2.5 rounded-2xl border ${attendanceSummary.isLowAttendance ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-3xl font-extrabold tracking-tight ${attendanceSummary.isLowAttendance ? 'text-amber-400' : 'text-white'}`}>
              {attendanceSummary.overallPercentage}%
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">
              {attendanceSummary.presentClasses} of {attendanceSummary.totalClasses} classes attended
            </div>
          </div>
        </div>

        {/* Placement Applications Card */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Placement Drives</span>
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white tracking-tight">{placementSummary.applicationsCount}</div>
            <div className="text-[11px] text-blue-400 font-semibold mt-1">
              {placementSummary.shortlistedCount} shortlisted • {placementSummary.eligibleDrivesCount} eligible drives
            </div>
          </div>
        </div>

        {/* Training Programs Card */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skill Trainings</span>
            <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white tracking-tight">{trainingSummary.enrolledCount}</div>
            <div className="text-[11px] text-purple-400 font-semibold mt-1">
              Active Bootcamp Enrollment
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Training Progress & Placements + Notices & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Training & Academic Snapshot */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Training Program Progress with Live Trainer Updates */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white">Skill Training & Bootcamp Progress</h2>
              </div>
              <Link to="/parent/training" className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1">
                <span>View Full Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {trainingSummary.trainings.length > 0 ? (
              <div className="space-y-4">
                {trainingSummary.trainings.map((t) => (
                  <div
                    key={t._id}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3 hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-white">{t.title}</h3>
                        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>Trainer: <strong className="text-slate-200">{t.trainerName}</strong></span>
                          <span>•</span>
                          <span>Duration: {t.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                          Grade: {t.grade}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {t.status}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                        <span>Curriculum Completion</span>
                        <span className="text-emerald-400 font-bold">{t.progressPercentage}%</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(t.progressPercentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Sessions & Feedback Note */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-400 pt-1 border-t border-slate-800/50">
                      <span>Attendance: <strong className="text-white">{t.attendanceCount}</strong> of {t.totalSessions} Sessions</span>
                      {t.feedback && (
                        <span className="text-emerald-300 italic text-[11px]">
                          "{t.feedback}"
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl">
                No active training enrollments logged.
              </div>
            )}
          </div>

          {/* Placement Application Status */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                <h2 className="text-base font-bold text-white">Placement Applications Status</h2>
              </div>
              <Link to="/parent/placements" className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1">
                <span>View All Drives</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {placementSummary.recentApplications.length > 0 ? (
              <div className="divide-y divide-slate-800/60">
                {placementSummary.recentApplications.map((app) => (
                  <div key={app._id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-bold text-white">{app.placementId?.companyName || 'Campus Recruiter'}</div>
                      <div className="text-xs text-slate-400">{app.placementId?.jobRole || 'Engineering Graduate'} • {app.placementId?.package}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        app.status === 'Selected'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                          : app.status === 'Shortlisted'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl">
                No active placement applications submitted yet.
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Notices & Campus Events */}
        <div className="space-y-6">
          {/* Institutional Notices */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <BellRing className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white">Parent Notices</h2>
              </div>
              <Link to="/parent/notices" className="text-xs font-semibold text-emerald-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {notices.length > 0 ? (
                notices.slice(0, 3).map((notice) => (
                  <div key={notice._id} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/70 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{notice.category}</span>
                      <span className="text-[10px] text-slate-500">{new Date(notice.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-xs font-bold text-white">{notice.title}</div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{notice.description}</p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 text-center py-4">No recent parent notices.</div>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white">Upcoming Events</h2>
              </div>
              <Link to="/parent/events" className="text-xs font-semibold text-emerald-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {events.length > 0 ? (
                events.slice(0, 3).map((event) => (
                  <div key={event._id} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/70 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="text-emerald-400 font-semibold">{event.date}</span>
                      <span>{event.time}</span>
                    </div>
                    <div className="text-xs font-bold text-white">{event.title}</div>
                    <div className="text-[11px] text-slate-400">{event.venue}</div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 text-center py-4">No upcoming events scheduled.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
