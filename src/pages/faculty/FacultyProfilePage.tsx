import React, { useState, useEffect } from 'react';
import { User as UserIcon, Building2, IdCard, Phone, Mail, BookOpen, ShieldCheck, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { FacultyProfile } from '../../types';

export const FacultyProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<FacultyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Editable phone
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiFetch<{ success: boolean; data: FacultyProfile }>('/faculty/profile');
        if (res.success && res.data) {
          setProfile(res.data);
          setPhone(res.data.phone || '');
        } else {
          setError('Failed to fetch faculty profile details.');
        }
      } catch (err: any) {
        setError(err.message || 'Error loading profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccessMsg(null);

      const res = await apiFetch<{ success: boolean; message: string }>('/faculty/profile', {
        method: 'PUT',
        body: JSON.stringify({ phone }),
      });

      if (res.success) {
        setSuccessMsg('Phone number updated successfully in MongoDB!');
      } else {
        setError('Failed to update profile.');
      }
    } catch (err: any) {
      setError(err.message || 'Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-4xl mx-auto">
        <div className="h-40 bg-slate-900 border border-slate-800 rounded-3xl" />
        <div className="h-64 bg-slate-900 border border-slate-800 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-xl shadow-indigo-600/30 shrink-0">
          {profile?.name
            ? profile.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase()
            : 'FC'}
        </div>

        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-extrabold text-white">{profile?.name}</h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60">
              FACULTY ROLE
            </span>
          </div>

          <div className="text-xs text-slate-300 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <span className="flex items-center gap-1">
              <IdCard className="w-4 h-4 text-indigo-400" />
              Employee ID: <strong className="text-white">{profile?.employeeId}</strong>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="flex items-center gap-1">
              <Building2 className="w-4 h-4 text-indigo-400" />
              {profile?.department}
            </span>
          </div>
          <p className="text-xs text-indigo-400 font-semibold">{profile?.designation}</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Details */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <h2 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          Faculty Profile Credentials & Data
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Faculty ID (Disabled) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Faculty Employee ID (Immutable)
              </label>
              <input
                type="text"
                disabled
                value={profile?.employeeId || ''}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 font-semibold cursor-not-allowed"
              />
            </div>

            {/* Department (Disabled) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Department (Academic Controlled)
              </label>
              <input
                type="text"
                disabled
                value={profile?.department || ''}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 font-semibold cursor-not-allowed"
              />
            </div>

            {/* Email (Disabled) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Institutional Email Address
              </label>
              <input
                type="email"
                disabled
                value={profile?.email || ''}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 font-semibold cursor-not-allowed"
              />
            </div>

            {/* Designation (Disabled) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Designation
              </label>
              <input
                type="text"
                disabled
                value={profile?.designation || ''}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 font-semibold cursor-not-allowed"
              />
            </div>

            {/* Phone Number (Editable) */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1.5">
                Phone Number (Editable)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Assigned Subjects Badges */}
          <div className="space-y-2 pt-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Assigned Subjects & Curriculum
            </label>
            <div className="flex flex-wrap gap-2">
              {profile?.assignedSubjects?.map((sub, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-indigo-950 text-indigo-300 border border-indigo-800/50 text-xs font-bold flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{sub}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Update Phone Number'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
