import React from 'react';
import { Menu, Bell, Briefcase, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

interface RecruiterTopNavProps {
  onMenuToggle: () => void;
}

export const RecruiterTopNav: React.FC<RecruiterTopNavProps> = ({ onMenuToggle }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>MongoDB Atlas Sync Active</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications Icon */}
        <Link
          to="/recruiter/notifications"
          className="relative p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          title="Recruiter Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500 ring-2 ring-slate-900" />
        </Link>

        {/* User Pill */}
        <div className="flex items-center space-x-3 border-l border-slate-800 pl-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-white">{user?.name || 'Recruiter'}</p>
            <p className="text-[11px] text-cyan-400 font-medium flex items-center justify-end gap-1">
              <Briefcase className="w-3 h-3" />
              <span>Placement Partner</span>
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-cyan-500/20 border border-cyan-400/30">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'R'}
          </div>
        </div>
      </div>
    </header>
  );
};
