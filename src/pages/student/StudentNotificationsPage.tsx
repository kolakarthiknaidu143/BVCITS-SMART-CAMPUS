import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { Bell, Check, CheckCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { NotificationItem } from '../../types';

export const StudentNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ success: boolean; data: NotificationItem[] }>('/notifications');
      if (res.success && res.data) {
        setNotifications(res.data);
      } else {
        setError('Failed to fetch notifications.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      const res = await apiFetch<{ success: boolean }>(`/notifications/${id}/read`, { method: 'PUT' });
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      // Silent catch
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await apiFetch<{ success: boolean }>(`/notifications/read-all`, { method: 'PUT' });
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (err) {
      // Silent catch
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse font-sans">
        <div className="h-32 rounded-3xl bg-slate-900 border border-slate-800" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-slate-900 border border-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-8 font-sans max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-500/30">
            <Bell className="w-3.5 h-3.5" />
            <span>Activity Logs</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Campus Notifications</h1>
          <p className="text-xs text-slate-300 mt-1">
            Real-time updates regarding placement drives, notices, attendance logs, and exam schedules
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-1.5 shrink-0"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                n.isRead
                  ? 'bg-slate-900/60 border-slate-800'
                  : 'bg-indigo-950/30 border-indigo-500/40 shadow-lg shadow-indigo-500/5'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                    {n.type}
                  </span>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  )}
                  <span className="text-[10px] text-slate-500">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{n.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => handleMarkRead(n._id)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-indigo-600 transition-colors shrink-0"
                  title="Mark as Read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-xs text-slate-500 bg-slate-900/60 rounded-3xl border border-slate-800">
          No notifications recorded.
        </div>
      )}
    </div>
  );
};
