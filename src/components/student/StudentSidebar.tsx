import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  CalendarCheck,
  GraduationCap,
  Calendar,
  Briefcase,
  Award,
  BellRing,
  CalendarDays,
  Bell,
  X,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface StudentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', path: '/student/profile', icon: User },
    { label: 'Attendance', path: '/student/attendance', icon: CalendarCheck },
    { label: 'Marks & Academics', path: '/student/marks', icon: GraduationCap },
    { label: 'Timetable', path: '/student/timetable', icon: CalendarDays },
    { label: 'Placements', path: '/student/placements', icon: Briefcase },
    { label: 'Training', path: '/student/training', icon: Award },
    { label: 'Notices', path: '/student/notices', icon: BellRing },
    { label: 'Events', path: '/student/events', icon: Calendar },
    { label: 'Notifications', path: '/student/notifications', icon: Bell },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo Header */}
        <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <NavLink to="/student/dashboard" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-700 shadow-md shadow-indigo-500/20 overflow-hidden flex items-center justify-center">
  <img
    src="/bvcits-logo.jpeg"
    alt="BVCITS Logo"
    className="w-full h-full object-fill p-0.5"
  />
</div>
            <div>
              <span className="font-extrabold text-sm text-white tracking-wide block leading-none">BVCITS</span>
              <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase block mt-0.5">Smart Campus</span>
            </div>
          </NavLink>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Student Portal
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Sidebar Footer Badge */}
        <div className="p-4 border-t border-slate-800/80 shrink-0">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold text-slate-200 truncate">Authenticated Session</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Protected JWT</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
