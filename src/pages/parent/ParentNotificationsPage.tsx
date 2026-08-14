import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Calendar, AlertTriangle, ShieldCheck } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { NotificationItem } from '../../types';

export const ParentNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch<{ success: boolean; data: NotificationItem[] }>('/parent/notifications');
        if (res.success && res.data) {
          setNotifications(res.data);
        } else {
          setError('Failed to retrieve guardian notifications.');
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching notifications.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
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
        <h2 className="text-base font-bold text-white mb-1">Notifications Unavailable</h2>
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

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Attendance':
        return 'bg-amber-950 text-amber-300 border-amber-800/40';
      case 'Exam':
        return 'bg-purple-950 text-purple-300 border-purple-800/40';
      case 'Placement':
        return 'bg-blue-950 text-blue-300 border-blue-800/40';
      case 'Training':
        return 'bg-teal-950 text-teal-300 border-teal-800/40';
      default:
        return 'bg-emerald-950 text-emerald-300 border-emerald-800/40';
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
            <Bell className="w-3.5 h-3.5" />
            <span>Alerts & Communications</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Parent Notifications Log</h1>
          <p className="text-xs text-slate-300 mt-1">
            Real-time SMS & In-app alerts regarding student attendance, evaluations, and training
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Total Received</span>
          <span className="text-xl font-extrabold text-emerald-400 mt-0.5">{notifications.length} Alerts</span>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 max-w-4xl">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif._id}
              className={`p-5 rounded-2xl border shadow-lg transition-all ${
                notif.isRead
                  ? 'bg-slate-900/60 border-slate-800/80'
                  : 'bg-slate-900 border-emerald-500/30 ring-1 ring-emerald-500/10'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getTypeBadge(notif.type)}`}>
                    {notif.type}
                  </span>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>{new Date(notif.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <h2 className="text-sm font-bold text-white">{notif.title}</h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{notif.message}</p>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/60 rounded-3xl border border-slate-800">
            No notifications found in your guardian inbox.
          </div>
        )}
      </div>
    </div>
  );
};
