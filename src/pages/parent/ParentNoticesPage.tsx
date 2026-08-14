import React, { useState, useEffect } from 'react';
import { BellRing, Calendar, Tag, AlertTriangle, Filter } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { NoticeItem } from '../../types';

export const ParentNoticesPage: React.FC = () => {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch<{ success: boolean; data: NoticeItem[] }>('/parent/notices');
        if (res.success && res.data) {
          setNotices(res.data);
        } else {
          setError('Failed to retrieve college notices.');
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching notices.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center max-w-xl mx-auto my-12 shadow-2xl">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h2 className="text-base font-bold text-white mb-1">Notices Unavailable</h2>
        <p className="text-xs text-slate-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
        >
          Retry
        </button>
      </div>
    );
  }

  const filteredNotices = categoryFilter === 'ALL'
    ? notices
    : notices.filter((n) => n.category === categoryFilter);

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
            <BellRing className="w-3.5 h-3.5" />
            <span>Institutional Circulars</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Campus & Parent Notices</h1>
          <p className="text-xs text-slate-300 mt-1">
            Official announcements, academic schedules, exam circulars, and fee notifications
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Placement">Placement</option>
            <option value="Event">Event</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>

      {/* Notices Grid */}
      <div className="space-y-4">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((n) => (
            <div
              key={n._id}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3 hover:border-emerald-500/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800/40 uppercase">
                    {n.category}
                  </span>
                  <span className="text-xs text-slate-500">Audience: {n.audience}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <h2 className="text-base font-bold text-white">{n.title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{n.description}</p>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/60 rounded-3xl border border-slate-800">
            No notices published for this category.
          </div>
        )}
      </div>
    </div>
  );
};
