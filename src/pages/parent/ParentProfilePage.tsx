import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Briefcase, GraduationCap, ShieldCheck, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiFetch } from '../../services/api';

interface ParentProfileData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  occupation: string;
  relationship: string;
  studentRollNumber: string;
  student: {
    name: string;
    email: string;
    phone?: string;
    rollNumber: string;
    department: string;
    semester: number;
    cgpa: number;
  } | null;
}

export const ParentProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<ParentProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form editable states
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch<{ success: boolean; data: ParentProfileData }>('/parent/profile');
        if (res.success && res.data) {
          setProfile(res.data);
          setPhone(res.data.phone || '');
          setOccupation(res.data.occupation || '');
        } else {
          setError('Could not retrieve parent profile.');
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching parent profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await apiFetch<{ success: boolean; message: string; data: ParentProfileData }>('/parent/profile', {
        method: 'PUT',
        body: JSON.stringify({ phone, occupation }),
      });

      if (res.success && res.data) {
        setProfile(res.data);
        setSuccessMessage('Parent profile contact details updated successfully.');
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
            <Users className="w-3.5 h-3.5" />
            <span>Guardian Identity Profile</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Parent & Student Information</h1>
          <p className="text-xs text-slate-300 mt-1">
            Manage your verified contact details and view linked student records.
          </p>
        </div>
      </div>

      {/* Success / Error Feedback */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Parent Editable Profile Form */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Guardian Details</span>
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
              Verified
            </span>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Parent Full Name</label>
              <input
                type="text"
                disabled
                value={profile?.name || ''}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Official institutional name cannot be altered online.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Registered Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="email"
                  disabled
                  value={profile?.email || ''}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Occupation / Profession</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. Senior Software Engineer / Business"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Relationship</label>
              <input
                type="text"
                disabled
                value={profile?.relationship || 'Parent / Guardian'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 cursor-not-allowed"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving Changes...' : 'Save Profile Details'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Linked Student Academic Profile (Read-Only) */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Linked Student Record</span>
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40">
              Read-Only
            </span>
          </div>

          {profile?.student ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Student Full Name</span>
                  <div className="text-sm font-bold text-white mt-0.5">{profile.student.name}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/60">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Roll Number</span>
                    <div className="text-xs font-bold text-emerald-400 mt-0.5">{profile.student.rollNumber}</div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Current CGPA</span>
                    <div className="text-xs font-bold text-white mt-0.5">{profile.student.cgpa.toFixed(2)} / 10.0</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/60">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Department</span>
                    <div className="text-xs font-medium text-slate-200 mt-0.5">{profile.student.department}</div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Semester</span>
                    <div className="text-xs font-medium text-slate-200 mt-0.5">{profile.student.semester}th Semester</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Institutional Student Email</span>
                  <div className="text-xs font-medium text-slate-300 mt-0.5">{profile.student.email}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 flex items-start space-x-3 text-xs text-emerald-300">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  This student record is cryptographically mapped to your guardian ID in MongoDB Atlas.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl">
              No linked student record found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
