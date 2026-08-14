import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import bvcitsLogo from '../../assets/bvcits-logo.png';
import {
  LayoutDashboard,
  GraduationCap,
  UserCheck,
  Users,
  Building2,
  BookOpen,
  Clock,
  Award,
  Bell,
  Calendar,
  Briefcase,
  FileText,
  Sparkles,
  MessageSquare,
  Settings,
  LogOut,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Students', path: '/admin/students', icon: GraduationCap },
    { name: 'Faculty', path: '/admin/faculty', icon: UserCheck },
    { name: 'Parents', path: '/admin/parents', icon: Users },
    { name: 'Departments', path: '/admin/departments', icon: Building2 },
    { name: 'Courses', path: '/admin/courses', icon: BookOpen },
    { name: 'Attendance', path: '/admin/attendance', icon: Clock },
    { name: 'Marks', path: '/admin/marks', icon: Award },
    { name: 'Notices', path: '/admin/notices', icon: Bell },
    { name: 'Events', path: '/admin/events', icon: Calendar },
    { name: 'Placements', path: '/admin/placements', icon: Briefcase },
    { name: 'Applications', path: '/admin/applications', icon: FileText },
    { name: 'Training', path: '/admin/training', icon: Sparkles },
    { name: 'Notifications', path: '/admin/notifications', icon: MessageSquare },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
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
        className={`fixed top-0 left-0 bottom-0 w-64 bg-slate-900/95 border-r border-slate-800/80 flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
              <img
                src={bvcitsLogo}
                alt="BVCITS Logo"
                className="h-10 w-auto max-h-10 max-w-10 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="font-bold text-base text-white tracking-tight">BVCITS</h1>
              <p className="text-xs text-blue-400 font-medium">Management Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-slate-800/50 bg-slate-900/40">
          <div className="flex items-center space-x-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <div className="w-9 h-9 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-indigo-400 uppercase tracking-wider font-bold">System Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Footer */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-red-500/10 text-slate-300 hover:text-red-400 border border-slate-700/60 hover:border-red-500/30 text-sm font-medium transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
