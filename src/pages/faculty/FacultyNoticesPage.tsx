import React, { useState, useEffect } from 'react';
import { BellRing, Plus, Calendar, Send, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { NoticeItem } from '../../types';

export const FacultyNoticesPage: React.FC = () => {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State for Notice Creation
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Academic' | 'Placement' | 'Event' | 'General'>('Academic');
  const [audience, setAudience] = useState<'All' | 'Students' | 'Parents' | 'Faculty'>('Students');
  const [expiryDate, setExpiryDate] = useState('');

  const [creating, setCreating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiFetch<{ success: boolean; data: NoticeItem[] }>('/faculty/notices');
      if (res.success && res.data) {
        setNotices(res.data);
      } else {
        setError('Failed to fetch campus notices.');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading notices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      setSuccessMsg(null);

      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        audience,
        expiryDate: expiryDate || undefined,
      };

      const res = await apiFetch<{ success: boolean; message: string; data: NoticeItem }>(
        '/faculty/notices',
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );

      if (res.success) {
        setSuccessMsg('Notice posted successfully to MongoDB!');
        setTitle('');
        setDescription('');
        setExpiryDate('');
        setShowModal(false);
        fetchNotices();
      } else {
        setError('Failed to create notice.');
      }
    } catch (err: any) {
      setError(err.message || 'Error creating notice.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-2">
            <BellRing className="w-3.5 h-3.5" />
            <span>Campus Announcements</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Faculty Circulars & Notices</h1>
          <p className="text-xs text-slate-400 mt-1">
            Broadcast official academic circulars, exam schedules, and department notices.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Notice</span>
        </button>
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

      {/* Notices Feed */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-slate-900 border border-slate-800 rounded-2xl" />
          ))}
        </div>
      ) : notices.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <BellRing className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Notices Found</h3>
          <p className="text-xs text-slate-400">Click "Post New Notice" to broadcast a new announcement.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice._id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                    {notice.category}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    Audience: {notice.audience}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">
                  {new Date(notice.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-white">{notice.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{notice.description}</p>

              {notice.expiryDate && (
                <div className="pt-2 text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Valid Until: {notice.expiryDate}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Notice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <BellRing className="w-5 h-5 text-indigo-400" />
                <span>Publish Campus Notice</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Notice Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mid-2 Exam Timetable & Lab Evaluation"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write clear notice content..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Placement">Placement</option>
                    <option value="Event">Event</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Audience
                  </label>
                  <select
                    value={audience}
                    onChange={(e: any) => setAudience(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Students">Students</option>
                    <option value="All">All Campus</option>
                    <option value="Parents">Parents</option>
                    <option value="Faculty">Faculty</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{creating ? 'Publishing...' : 'Publish Notice'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
