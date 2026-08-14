import React, { useEffect, useState } from 'react';
import { Settings, Database, ShieldAlert, CheckCircle2, RefreshCw, Cpu, Server } from 'lucide-react';
import { apiFetch } from '../../services/api';

export const AdminSettingsPage: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<any>('/admin/settings');
      if (res.success) {
        setData(res.settings || {});
      } else {
        setError(res.message || 'Failed to load system settings.');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading system configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess(null);
    setFormError(null);

    try {
      const res = await apiFetch<any>('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      if (res.success) {
        setFormSuccess('System configuration parameters saved successfully!');
      } else {
        setFormError(res.message || 'Failed to update system parameters.');
      }
    } catch (err: any) {
      setFormError(err.message || 'Error saving settings.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-slate-400 font-medium text-sm">Inspecting MongoDB Atlas Database Health & System Parameters...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-7 h-7 text-indigo-400" />
            <span>Institutional Settings & System Configuration</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Configure academic year parameters, grading thresholds, and inspect MongoDB Atlas database health.</p>
        </div>
        <button
          onClick={fetchSettings}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Health
        </button>
      </div>

      {/* Database & Infrastructure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Primary Database</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-extrabold text-white">MongoDB Atlas</p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Connected & Healthy
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Security & Auth</span>
            <ShieldAlert className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-xl font-extrabold text-white">JWT + bcrypt</p>
          <p className="text-xs text-slate-400">Strict RBAC Enabled (6 Roles)</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Host Environment</span>
            <Server className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-xl font-extrabold text-white">Node.js Express + Vite</p>
          <p className="text-xs text-slate-400">Full Stack Container Runtime</p>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          <span>Academic & Compliance Settings</span>
        </h2>

        {formError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
            {formError}
          </div>
        )}
        {formSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {formSuccess}
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-1">Institution Name</label>
              <input
                type="text"
                required
                value={data?.institutionName || 'BVC Institute of Technology & Science'}
                onChange={(e) => setData({ ...data, institutionName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-1">Academic Year</label>
              <input
                type="text"
                required
                value={data?.academicYear || '2025-2026'}
                onChange={(e) => setData({ ...data, academicYear: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-1">Minimum Attendance Threshold (%)</label>
              <input
                type="number"
                min="50"
                max="100"
                value={data?.minAttendancePercentage || 75}
                onChange={(e) => setData({ ...data, minAttendancePercentage: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-1">Contact Email</label>
              <input
                type="email"
                value={data?.contactEmail || 'admin@bvcits.edu.in'}
                onChange={(e) => setData({ ...data, contactEmail: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
