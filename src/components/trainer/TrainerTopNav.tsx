import React from 'react';
import { Menu, Award, User, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { QuickLoginSwitcher } from '../QuickLoginSwitcher';
import { NotificationMenu } from '../NotificationMenu';

interface TrainerTopNavProps {
  onMenuToggle: () => void;
}

export const TrainerTopNav: React.FC<TrainerTopNavProps> = ({ onMenuToggle }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <QuickLoginSwitcher />
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 border border-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-extrabold uppercase tracking-wider">
              Trainer Workspace
            </span>
            <span className="text-slate-500 text-xs hidden sm:inline">•</span>
            <span className="text-slate-300 text-xs hidden sm:inline font-medium">BVCITS Smart Campus System</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <NotificationMenu />

          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-white leading-tight">{user?.name || 'Trainer'}</p>
              <p className="text-[10px] text-amber-400 font-semibold leading-none">Industry Instructor</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
