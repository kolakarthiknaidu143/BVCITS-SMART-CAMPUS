import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../services/api';
import {
  User as UserIcon,
  Phone,
  Mail,
  GraduationCap,
  Award,
  BookOpen,
  CalendarCheck,
  ShieldCheck,
  Save,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Users,
} from 'lucide-react';
import { StudentProfile } from '../../types';

export const StudentProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Editable fields
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ success: boolean; data: any }>('/students/profile');
      if (res.success && res.data) {
        setProfile(res.data);
        setPhone(res.data.userId?.phone || user?.phone || '');
        setSkills(res.data.skills || []);
      } else {
        setError('Failed to fetch student profile.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching student profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill.trim())) return;
    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await apiFetch<{ success: boolean; message: string; data: any }>('/students/profile', {
        method: 'PUT',
        body: JSON.stringify({
          phone,
          skills,
        }),
      });

      if (res.success) {
        setSuccessMsg('Profile updated successfully.');
        setProfile(res.data);
        if (refreshUser) refreshUser();
      } else {
        setError(res.message || 'Failed to update profile.');
      }
    } catch (err: any) {
      setError(err.message || 'Error saving profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-40 rounded-3xl bg-slate-900 border border-slate-800" />
        <div className="h-64 rounded-3xl bg-slate-900 border border-slate-800" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-slate-900/60 rounded-3xl border border-slate-800">
        <AlertCircle className="w-12 h-12 text-rose-400 mb-3" />
        <h3 className="text-lg font-bold text-white mb-1">Profile Loading Error</h3>
        <p className="text-xs text-slate-400 max-w-md mb-6">{error}</p>
        <button
          onClick={fetchProfile}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
          {(profile?.userId?.name || user?.name || 'ST')
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase()}
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-extrabold text-white">{profile?.userId?.name || user?.name}</h1>
          <p className="text-xs text-indigo-300 font-semibold mt-0.5">
            Roll No: {profile?.rollNumber} • {profile?.department}
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3 text-[11px]">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/40">
              Semester {profile?.semester}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/40">
              CGPA: {profile?.cgpa?.toFixed(2)}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/40">
              Attendance: {profile?.attendancePercentage}%
            </span>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Profile Form & Details */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Editable Section */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white">Editable Student Information</h2>
              <p className="text-xs text-slate-400">Update your contact details and technical skill profile</p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Technical Skills</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Add skill (e.g. Python, Docker)"
                  className="flex-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-500 hover:text-rose-400 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Read-Only Academic Fields */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white">Institutional Records (Read-Only)</h2>
            <p className="text-xs text-slate-400">Official academic data controlled by BVCITS Administration</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500">Roll Number</span>
              <p className="font-extrabold text-white text-sm mt-1">{profile?.rollNumber}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500">Institutional Email</span>
              <p className="font-semibold text-slate-200 text-xs mt-1 truncate">{profile?.userId?.email || user?.email}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500">Department</span>
              <p className="font-semibold text-indigo-300 text-xs mt-1">{profile?.department}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500">Semester</span>
              <p className="font-bold text-white text-xs mt-1">Semester {profile?.semester}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500">CGPA Score</span>
              <p className="font-extrabold text-emerald-400 text-sm mt-1">{profile?.cgpa?.toFixed(2)} / 10.0</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500">Overall Attendance</span>
              <p className="font-extrabold text-blue-400 text-sm mt-1">{profile?.attendancePercentage}%</p>
            </div>
          </div>

          {profile?.parent && (
            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <h3 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Linked Parent Account</span>
              </h3>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white">{profile.parent.name}</span>
                  <p className="text-slate-400 text-[11px]">{profile.parent.email}</p>
                </div>
                <span className="text-slate-400">{profile.parent.phone}</span>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
