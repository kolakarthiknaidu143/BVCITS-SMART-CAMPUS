import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { User } from '../../types';
import {
  UserCheck,
  Building2,
  Mail,
  Phone,
  Shield,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const RecruiterProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<any>('/recruiter/profile');
      if (res.success && res.user) {
        setUser(res.user);
        setName(res.user.name || '');
        setPhone(res.user.phone || '');
        setProfileImage(res.user.profileImage || '');
      } else {
        setError(res.message || 'Unable to load recruiter profile.');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to load recruiter profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await apiFetch<any>('/recruiter/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, phone, profileImage }),
      });

      if (res.success) {
        setSuccess('Profile details saved successfully to MongoDB Atlas.');
        if (res.user) {
          setUser(res.user);
        }
      } else {
        setError(res.message || 'Failed to update profile.');
      }
    } catch (err: any) {
      setError(err.message || 'Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading Recruiter Profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-cyan-400" />
            Recruiter Profile
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your corporate contact information and recruiter account details
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 uppercase tracking-wider">
          Verified Recruiter
        </span>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Profile Form Card */}
      <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Recruiter Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Recruiter Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Email (Read Only) */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1">
                <span>Corporate Email</span>
                <Lock className="w-3 h-3 text-slate-500" />
              </label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60 text-slate-400 text-sm cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Managed by BVCITS Placement Office</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Direct Contact Phone
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Role (Read Only) */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1">
                <span>Institutional Role</span>
                <Lock className="w-3 h-3 text-slate-500" />
              </label>
              <input
                type="text"
                disabled
                value={(user?.role || 'recruiter').toUpperCase()}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60 text-cyan-400 font-bold text-sm cursor-not-allowed"
              />
            </div>
          </div>

          {/* Profile Image URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Profile Image URL (Optional)
            </label>
            <input
              type="text"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
