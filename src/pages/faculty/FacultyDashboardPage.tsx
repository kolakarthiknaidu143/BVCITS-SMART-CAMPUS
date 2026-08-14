import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Clock,
  CheckSquare,
  CalendarCheck,
  GraduationCap,
  BellRing,
  Calendar,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Building2,
  IdCard,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { apiFetch } from '../../services/api';
import { FacultyProfile, CourseItem, NoticeItem, EventItem, TimetableSlot } from '../../types';

interface DashboardData {
  profile: FacultyProfile;
  statistics: {
    assignedSubjectsCount: number;
    totalStudentsCount: number;
    todaysClassesCount: number;
    pendingTasksCount: number;
  };
  courses: CourseItem[];
  students: any[];
  timetable: TimetableSlot[];
  notices: NoticeItem[];
  events: EventItem[];
}

export const FacultyDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiFetch<{ success: boolean; data: DashboardData }>('/faculty/dashboard');
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError('Failed to fetch faculty dashboard records.');
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
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-slate-900 border border-slate-800 rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-900 border border-slate-800 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-slate-900 border border-slate-800 rounded-2xl" />
          <div className="h-64 bg-slate-900 border border-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 bg-rose-950/20 border border-rose-800/50 rounded-3xl text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Dashboard Loading Issue</h3>
        <p className="text-xs text-rose-300 max-w-md mx-auto">{error || 'Unable to load MongoDB data.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { profile, statistics, courses, timetable, notices, events } = data;

  const statCards = [
    {
      title: 'Assigned Subjects',
      value: statistics.assignedSubjectsCount,
      subtitle: `${profile.assignedSubjects?.length || 0} active courses`,
      icon: BookOpen,
      color: 'from-blue-600 to-indigo-600',
      link: '/faculty/subjects',
    },
    {
      title: 'Total Students',
      value: statistics.totalStudentsCount,
      subtitle: `${profile.department} Department`,
      icon: Users,
      color: 'from-indigo-600 to-purple-600',
      link: '/faculty/students',
    },
    {
      title: "Today's Schedule",
      value: statistics.todaysClassesCount,
      subtitle: 'Class slots today',
      icon: Clock,
      color: 'from-purple-600 to-pink-600',
      link: '/faculty/timetable',
    },
    {
      title: 'Pending Tasks',
      value: statistics.pendingTasksCount,
      subtitle: 'Attendance/Marks to log',
      icon: CheckSquare,
      color: statistics.pendingTasksCount > 0 ? 'from-amber-500 to-orange-600' : 'from-emerald-600 to-teal-600',
      link: '/faculty/attendance',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BVCITS Faculty Management System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome, {profile.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1">
                <IdCard className="w-4 h-4 text-indigo-400" />
                ID: <strong className="text-white">{profile.employeeId}</strong>
              </span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4 text-indigo-400" />
                {profile.department} ({profile.designation})
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/faculty/attendance"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Mark Attendance</span>
            </Link>
            <Link
              to="/faculty/marks"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Enter Marks</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-2xl font-black text-white tracking-tight">{card.value}</div>
              <div className="text-xs font-bold text-slate-300 mt-1">{card.title}</div>
              <div className="text-[10px] font-medium text-slate-500 mt-0.5">{card.subtitle}</div>
            </Link>
          );
        })}
      </div>

      {/* Quick Schedule & Subjects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Subjects Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              My Assigned Subjects
            </h2>
            <Link to="/faculty/subjects" className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courses.length > 0 ? (
              courses.slice(0, 4).map((course) => (
                <div
                  key={course._id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                      {course.code}
                    </span>
                    <span className="text-[10px] text-slate-400">Sem {course.semester} • {course.credits} Credits</span>
                  </div>
                  <h3 className="text-xs font-bold text-white line-clamp-1">{course.name}</h3>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <Link
                      to={`/faculty/attendance?subject=${encodeURIComponent(course.name)}`}
                      className="text-[11px] font-bold text-indigo-400 hover:underline"
                    >
                      Log Attendance →
                    </Link>
                    <Link
                      to={`/faculty/marks?subject=${encodeURIComponent(course.name)}`}
                      className="text-[11px] font-bold text-purple-400 hover:underline"
                    >
                      Enter Marks →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-500">
                No assigned subjects found in MongoDB database.
              </div>
            )}
          </div>

          {/* Today's Classes List */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                Today's Lecture Schedule
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Weekly Schedule</span>
            </div>

            <div className="divide-y divide-slate-800/60">
              {timetable.length > 0 ? (
                timetable.slice(0, 4).map((slot, i) => (
                  <div key={i} className="py-3 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-white">{slot.subject}</div>
                      <div className="text-[10px] text-slate-400">
                        Room: <span className="text-slate-300 font-semibold">{slot.room}</span> • Section: <span className="text-indigo-400 font-semibold">{slot.section}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-indigo-400">{slot.time}</div>
                      <div className="text-[10px] text-slate-500">{slot.day}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-xs text-slate-500">
                  No classes scheduled for today.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notices & Events Column */}
        <div className="space-y-6">
          {/* Recent Campus Notices */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <BellRing className="w-4 h-4 text-indigo-400" />
                Campus Notices
              </h3>
              <Link to="/faculty/notices" className="text-[10px] font-bold text-indigo-400 hover:underline">
                Manage
              </Link>
            </div>

            <div className="space-y-3">
              {notices.length > 0 ? (
                notices.slice(0, 3).map((notice) => (
                  <div key={notice._id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                        {notice.category}
                      </span>
                      <span className="text-[9px] text-slate-500">
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white line-clamp-1">{notice.title}</div>
                    <p className="text-[10px] text-slate-400 line-clamp-2">{notice.description}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-xs text-slate-500 py-4">No active notices</div>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                Upcoming Events
              </h3>
              <Link to="/faculty/events" className="text-[10px] font-bold text-indigo-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {events.length > 0 ? (
                events.slice(0, 2).map((evt) => (
                  <div key={evt._id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                    <div className="text-xs font-bold text-white">{evt.title}</div>
                    <div className="text-[10px] text-indigo-400 font-semibold">
                      {evt.date} • {evt.time}
                    </div>
                    <div className="text-[10px] text-slate-400">{evt.venue}</div>
                  </div>
                ))
              ) : (
                <div className="text-center text-xs text-slate-500 py-4">No upcoming events</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
