import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, Search, LogOut, Users, ShieldCheck } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { NotificationItem } from '../../types';

interface ParentTopNavProps {
  onMenuToggle: () => void;
}

export const ParentTopNav: React.FC<ParentTopNavProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await apiFetch<{ success: boolean; data: NotificationItem[]; unreadCount?: number }>('/parent/notifications');
        if (res.success && res.data) {
          setNotifications(res.data);
          setUnreadCount(res.unreadCount !== undefined ? res.unreadCount : res.data.filter((n) => !n.isRead).length);
        }
      } catch (err) {
        // Silent catch
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('profile')) navigate('/parent/profile');
    else if (q.includes('attend')) navigate('/parent/attendance');
    else if (q.includes('mark') || q.includes('grade') || q.includes('cgpa')) navigate('/parent/marks');
    else if (q.includes('time') || q.includes('schedule')) navigate('/parent/timetable');
    else if (q.includes('place') || q.includes('job')) navigate('/parent/placements');
    else if (q.includes('train')) navigate('/parent/training');
    else if (q.includes('notice')) navigate('/parent/notices');
    else if (q.includes('event')) navigate('/parent/events');
    else navigate('/parent/dashboard');
  };

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'PA';

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      {/* Left Area: Mobile Toggle & Search */}
      <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden sm:block max-w-xs w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student progress, attendance, marks..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          />
        </form>
      </div>

      {/* Right Area: Notifications & User Profile & Logout */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-[10px] font-extrabold text-white flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotificationsDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 overflow-hidden">
              <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Parent Alerts & Updates</span>
                </div>
                <Link
                  to="/parent/notifications"
                  onClick={() => setShowNotificationsDropdown(false)}
                  className="text-[11px] font-semibold text-emerald-400 hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((n) => (
                    <div key={n._id} className="p-3 hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                          {n.type}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-white">{n.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{n.message}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No new notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Preview */}
        <Link
          to="/parent/profile"
          className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md shadow-emerald-500/20">
            {userInitials}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-white leading-tight">{user?.name || 'Parent'}</div>
            <div className="text-[10px] font-medium text-emerald-400 capitalize">Guardian Account</div>
          </div>
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          title="Log out of portal"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
