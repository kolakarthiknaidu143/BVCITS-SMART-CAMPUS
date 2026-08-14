import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import bvcitsLogo from '../../assets/bvcits-logo.png';
import {
  Award,
  LayoutDashboard,
  BookOpen,
  Users,
  Bell,
  LogOut,
  X,
  User,
  GraduationCap,
} from 'lucide-react';

interface TrainerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrainerSidebar: React.FC<TrainerSidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/trainer/dashboard', icon: LayoutDashboard },
    { label: 'Training Programs', path: '/trainer/trainings', icon: BookOpen },
    { label: 'Participant Progress', path: '/trainer/participants', icon: Users },
    { label: 'Notifications', path: '/trainer/notifications', icon: Bell },
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

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Close Button */}
          <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
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
                <h1 className="text-sm font-extrabold text-white tracking-tight leading-none">BVCITS Smart Campus</h1>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Trainer Portal</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Brief */}
          <div className="p-4 mx-3 my-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Trainer Specialist'}</p>
              <p className="text-[10px] text-amber-400 truncate font-semibold">Technical Instructor</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
