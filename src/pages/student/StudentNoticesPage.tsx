import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { BellRing, Search, AlertCircle, RefreshCw, Filter, Calendar } from 'lucide-react';
import { NoticeItem } from '../../types';

export const StudentNoticesPage: React.FC = () => {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const fetchNotices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ success: boolean; notices: NoticeItem[] }>('/notices');
      if (res.success && res.notices) {
        setNotices(res.notices);
      } else {
        setError('Failed to fetch campus notices.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching notices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || n.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse font-sans">
        <div className="h-32 rounded-3xl bg-slate-900 border border-slate-800" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-3xl bg-slate-900 border border-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2 border border-blue-500/30">
            <BellRing className="w-3.5 h-3.5" />
            <span>Campus Circulars</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Official Institutional Notices</h1>
          <p className="text-xs text-slate-300 mt-1">
            Academic exam timetables, placement announcements, and administrative guidelines
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search controls */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notices by title or content..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto text-xs shrink-0">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400 font-medium">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Placement">Placement</option>
            <option value="Event">Event</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>

      {/* Notice List */}
      {filteredNotices.length > 0 ? (
        <div className="space-y-4">
          {filteredNotices.map((notice) => (
            <div
              key={notice._id}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl hover:border-indigo-500/40 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40 uppercase">
                    {notice.category}
                  </span>
                  <span className="text-xs text-slate-500">Target: {notice.audience}</span>
                </div>
                <span className="text-[11px] text-slate-500">
                  {new Date(notice.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h2 className="text-base font-bold text-white">{notice.title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed">{notice.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-xs text-slate-500 bg-slate-900/60 rounded-3xl border border-slate-800">
          No notices match your filter criteria.
        </div>
      )}
    </div>
  );
};
