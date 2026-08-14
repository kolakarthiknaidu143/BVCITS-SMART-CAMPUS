import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';
import { Bell, CheckCircle2, Award, Clock } from 'lucide-react';

export const TrainerNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<any>('/trainer/notifications');
      if (res.success) {
        setNotifications(res.notifications || []);
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

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-amber-400" />
            <span>Trainer Notifications</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            System updates, student enrollment notifications, and schedule reminders.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 text-xs">
          No notifications found.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start space-x-4 shadow-lg"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                <Award className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-white">{n.title}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Today'}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
