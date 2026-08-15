import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  Briefcase,
  FileText,
  Users,
  Calendar,
  Award,
  Bell,
  LogOut,
  X,
  Building2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface RecruiterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecruiterSidebar: React.FC<RecruiterSidebarProps> = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/recruiter/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/recruiter/profile', icon: UserCheck },
    { name: 'Job Postings', path: '/recruiter/jobs', icon: Briefcase },
    { name: 'Applications', path: '/recruiter/applications', icon: FileText },
    { name: 'Shortlisted', path: '/recruiter/shortlisted', icon: Users },
    { name: 'Interviews', path: '/recruiter/interviews', icon: Calendar },
    { name: 'Campus Events', path: '/recruiter/events', icon: Award },
    { name: 'Notifications', path: '/recruiter/notifications', icon: Bell },
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
           <div className="w-10 h-10 rounded-xl bg-white border border-slate-700 overflow-hidden flex items-center justify-center shadow-lg shadow-cyan-500/20">
  <img
    src="/bvcits-logo.jpeg"
    alt="BVCITS Logo"
    className="w-full h-full object-contain p-0.5"
  />
</div>
            <div>
              <h1 className="font-bold text-base text-white tracking-tight">BVCITS</h1>
              <p className="text-xs text-cyan-400 font-medium">Recruiter Portal</p>
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
            <div className="w-9 h-9 rounded-lg bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'R'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Recruiter'}</p>
              <p className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold truncate">Corporate Partner</p>
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
                      ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-500/20 font-semibold'
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
