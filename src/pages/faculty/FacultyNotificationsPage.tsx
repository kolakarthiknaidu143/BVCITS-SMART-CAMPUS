import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, AlertCircle, CalendarCheck, GraduationCap, BellRing, Sparkles } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { NotificationItem } from '../../types';

export const FacultyNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiFetch<{ success: boolean; data: NotificationItem[] }>('/faculty/notifications');
        if (res.success && res.data) {
          setNotifications(res.data);
        } else {
          setError('Failed to fetch faculty notifications.');
        }
      } catch (err: any) {
        setError(err.message || 'Error loading notifications.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>Faculty Alert Center</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Notifications & Activity Log</h1>
          <p className="text-xs text-slate-400 mt-1">
            Activity logs for attendance updates, exam mark entries, circular broadcasts, and low attendance alerts.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-right shrink-0">
          <div className="text-xl font-extrabold text-indigo-400">{unreadCount}</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase">Unread Alerts</div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-900 border border-slate-800 rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-800/50 text-center text-xs text-rose-300">
          {error}
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <Bell className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Notifications</h3>
          <p className="text-xs text-slate-400">You're all caught up! No recent alerts or notifications.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item._id}
              className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                !item.isRead
                  ? 'bg-slate-900/90 border-indigo-500/30'
                  : 'bg-slate-900/40 border-slate-800/80'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-950 border border-indigo-800/50 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                {item.type === 'Attendance' ? (
                  <CalendarCheck className="w-4 h-4" />
                ) : item.type === 'Exam' ? (
                  <GraduationCap className="w-4 h-4" />
                ) : (
                  <BellRing className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                      {item.type}
                    </span>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white">{item.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{item.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
