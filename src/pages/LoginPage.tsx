import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { GraduationCap, Lock, Mail, ChevronRight, AlertCircle, Users, UserCheck, ShieldAlert, Briefcase, Award, Eye, EyeOff, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, quickRoleLogin } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
  };

  const handleRedirectForRole = (role: UserRole) => {
    switch (role) {
      case 'student':
        navigate('/student/dashboard');
        break;
      case 'parent':
        navigate('/parent/dashboard');
        break;
      case 'faculty':
        navigate('/faculty/dashboard');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'recruiter':
        navigate('/recruiter/dashboard');
        break;
      case 'trainer':
        navigate('/trainer/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setSubmitting(true);

    try {
      await login(email, password);
      handleRedirectForRole(selectedRole);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOneClickLogin = async (role: UserRole) => {
    setError(null);
    setSubmitting(true);
    try {
      await quickRoleLogin(role);
      handleRedirectForRole(role);
    } catch (err: any) {
      setError(err.message || 'Quick login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const roles: { role: UserRole; title: string; icon: any }[] = [
    { role: 'student', title: 'Student', icon: GraduationCap },
    { role: 'parent', title: 'Parent', icon: Users },
    { role: 'faculty', title: 'Faculty', icon: UserCheck },
    { role: 'admin', title: 'Management', icon: ShieldAlert },
    { role: 'recruiter', title: 'Recruiter', icon: Briefcase },
    { role: 'trainer', title: 'Trainer', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-indigo-400" />
            </div>
          </div>
        </Link>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          BVCITS Smart Campus Login
        </h2>
        <p className="mt-1.5 text-xs text-slate-400">
          Select your portal role to log in with institutional credentials
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-slate-900/60 py-8 px-4 shadow-2xl border border-slate-800 sm:rounded-3xl sm:px-10 backdrop-blur-md">
          {/* Role Selector Tabs */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Role Portal
            </label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.role;
                return (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => handleRoleSelect(r.role)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300 ring-2 ring-indigo-500/20'
                        : 'border-slate-800 hover:bg-slate-800/50 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{r.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick 1-Click Demo Login Banner */}
          <div className="mb-6 p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-800/50 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>1-Click Hackathon Demo Login</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Log in instantly as <span className="text-white font-semibold uppercase">{selectedRole}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleOneClickLogin(selectedRole)}
              disabled={submitting}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all shrink-0 flex items-center gap-1 disabled:opacity-50"
            >
              <span>Demo {selectedRole.toUpperCase()}</span>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Institutional Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 border border-slate-800 rounded-xl bg-slate-950 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="user@bvcits.edu.in"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-10 py-2.5 border border-slate-800 rounded-xl bg-slate-950 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {submitting ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Log in as {selectedRole.toUpperCase()}</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
            Need an institutional account?{' '}
            <Link to="/register" className="font-semibold text-indigo-400 hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

