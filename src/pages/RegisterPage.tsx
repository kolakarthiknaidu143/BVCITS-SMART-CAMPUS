import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User as UserIcon, Phone, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';
import { UserRole } from '../types';
import bvcitsLogo from '../assets/bvcits-logo.png';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);

    try {
      await register({
        name,
        email,
        password,
        phone,
        role,
        rollNumber: role === 'student' ? rollNumber || '21BVC' + Math.floor(1000 + Math.random() * 9000) : undefined,
        department,
      });

      // Redirect to student dashboard if student
      if (role === 'student') {
        navigate('/student/dashboard');
      } else {
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center justify-center mb-4">
          <div className="h-16 w-16 flex items-center justify-center p-1 rounded-2xl bg-white/5 border border-slate-800 shadow-xl hover:scale-105 transition-transform">
            <img
              src={bvcitsLogo}
              alt="BVCITS Logo"
              className="h-14 w-auto max-h-14 max-w-14 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </Link>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          BVCITS Institutional Registration
        </h2>
        <p className="mt-1.5 text-xs text-slate-400">
          Create your Smart Campus account to access institutional portals
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900/60 py-8 px-4 shadow-2xl border border-slate-800 sm:rounded-3xl sm:px-10 backdrop-blur-md">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 border border-slate-800 rounded-xl bg-slate-950 text-white text-sm focus:ring-2 focus:ring-indigo-500"
                  placeholder="Karthik Naidu"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Institutional Email *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 border border-slate-800 rounded-xl bg-slate-950 text-white text-sm focus:ring-2 focus:ring-indigo-500"
                  placeholder="karthik@bvcits.edu.in"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 border border-slate-800 rounded-xl bg-slate-950 text-white text-sm focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 border border-slate-800 rounded-xl bg-slate-950 text-white text-sm focus:ring-2 focus:ring-indigo-500"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="block w-full px-3 py-2.5 border border-slate-800 rounded-xl bg-slate-950 text-white text-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="faculty">Faculty</option>
                <option value="recruiter">Recruiter</option>
                <option value="trainer">Trainer</option>
              </select>
            </div>

            {role === 'student' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-800 rounded-xl bg-slate-950 text-white text-sm focus:ring-2 focus:ring-indigo-500"
                    placeholder="21BVC0501"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-800 rounded-xl bg-slate-950 text-white text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Electrical & Electronics">Electrical & Electronics</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-6"
            >
              {submitting ? (
                <span>Registering...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
            Already have an institutional account?{' '}
            <Link to="/login" className="font-semibold text-indigo-400 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
