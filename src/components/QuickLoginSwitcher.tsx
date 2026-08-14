import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { UserCheck, ShieldAlert, GraduationCap, Users, Briefcase, Award } from 'lucide-react';

export const QuickLoginSwitcher: React.FC = () => {
  const { user, quickRoleLogin } = useAuth();

  const roles: { role: UserRole; label: string; icon: any; color: string }[] = [
    { role: 'student', label: 'Student', icon: GraduationCap, color: 'bg-blue-500 hover:bg-blue-600' },
    { role: 'parent', label: 'Parent', icon: Users, color: 'bg-emerald-500 hover:bg-emerald-600' },
    { role: 'faculty', label: 'Faculty', icon: UserCheck, color: 'bg-indigo-500 hover:bg-indigo-600' },
    { role: 'admin', label: 'Management/Admin', icon: ShieldAlert, color: 'bg-purple-500 hover:bg-purple-600' },
    { role: 'recruiter', label: 'Recruiter', icon: Briefcase, color: 'bg-cyan-600 hover:bg-cyan-700' },
    { role: 'trainer', label: 'Trainer', icon: Award, color: 'bg-amber-500 hover:bg-amber-600' },
  ];

  return (
    <div className="bg-slate-900 text-white py-2.5 px-4 border-b border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            HACKATHON DEMO MODE
          </span>
          <span className="text-slate-400 hidden sm:inline">1-Click Switch Roles:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {roles.map((r) => {
            const Icon = r.icon;
            const isCurrent = user?.role === r.role;
            return (
              <button
                key={r.role}
                onClick={() => quickRoleLogin(r.role)}
                id={`switch-role-${r.role}`}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center space-x-1 font-medium ${
                  isCurrent
                    ? 'bg-white text-slate-900 ring-2 ring-indigo-400 font-bold shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
                title={`Switch to ${r.label}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
