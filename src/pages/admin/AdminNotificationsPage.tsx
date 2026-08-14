import React, { useEffect, useState } from 'react';
import { Bell, Send, RefreshCw, CheckCircle2, User, Users } from 'lucide-react';
import { apiFetch } from '../../services/api';

export const AdminNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('All');
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<any>('/admin/notifications');
      if (res.success) {
        setNotifications(res.notifications || []);
      } else {
        setError(res.message || 'Failed to fetch notification history.');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendSuccess(null);
    setSendError(null);

    try {
      const res = await apiFetch<any>('/admin/notifications', {
        method: 'POST',
        body: JSON.stringify({ title, message, targetAudience }),
      });

      if (res.success) {
        setSendSuccess('Push alert broadcasted successfully to recipient devices!');
        setTitle('');
        setMessage('');
        fetchNotifications();
      } else {
        setSendError(res.message || 'Failed to dispatch push alert.');
      }
    } catch (err: any) {
      setSendError(err.message || 'Error sending push alert.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-amber-400" />
            <span>Real-Time Notification Dispatcher</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Send emergency alerts, fee reminders, or academic updates directly to portal feeds.</p>
        </div>
        <button
          onClick={fetchNotifications}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Broadcast Log
        </button>
      </div>

      {/* Broadcast Form */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Send className="w-5 h-5 text-amber-400" />
          <span>Dispatch New Push Notification</span>
        </h2>

        {sendError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
            {sendError}
          </div>
        )}
        {sendSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {sendSuccess}
          </div>
        )}

        <form onSubmit={handleSendNotification} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-slate-400 text-xs font-semibold mb-1">Notification Heading</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Campus Closed Tomorrow due to Heavy Rainfall Alert"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-1">Target Audience</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="All">All Portal Users</option>
                <option value="Students">Students Only</option>
                <option value="Faculty">Faculty Only</option>
                <option value="Parents">Parents Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-semibold mb-1">Alert Content</label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Full notification message text..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl font-semibold shadow-lg shadow-amber-500/20 inline-flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Broadcast Notification
            </button>
          </div>
        </form>
      </div>

      {/* Broadcast History */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Broadcast History</h2>

        {loading ? (
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-400">
            Loading broadcast history...
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400">
            {error}
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-500 italic">
            No notification logs found.
          </div>
        ) : (
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/80 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Target</th>
                    <th className="px-6 py-4">Content</th>
                    <th className="px-6 py-4">Dispatched At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {notifications.map((n) => (
                    <tr key={n._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-white">{n.title}</td>
                      <td className="px-6 py-4 text-xs font-semibold">
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                          {n.targetAudience || 'All'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-300 line-clamp-2 max-w-xs">{n.message}</td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(n.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
