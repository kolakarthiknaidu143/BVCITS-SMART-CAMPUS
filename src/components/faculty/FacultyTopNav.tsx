import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, Search, LogOut, User as UserIcon, Building2, IdCard } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { NotificationItem, FacultyProfile } from '../../types';

interface FacultyTopNavProps {
  onMenuToggle: () => void;
  facultyProfile?: FacultyProfile | null;
}

export const FacultyTopNav: React.FC<FacultyTopNavProps> = ({ onMenuToggle, facultyProfile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await apiFetch<{ success: boolean; data: NotificationItem[] }>('/faculty/notifications');
        if (res.success && res.data) {
          setNotifications(res.data);
          const unread = res.data.filter((n) => !n.isRead).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        // Silent catch
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
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
    if (q.includes('profile')) navigate('/faculty/profile');
    else if (q.includes('subject') || q.includes('course')) navigate('/faculty/subjects');
    else if (q.includes('student') || q.includes('class')) navigate('/faculty/students');
    else if (q.includes('attend')) navigate('/faculty/attendance');
    else if (q.includes('mark') || q.includes('exam') || q.includes('grade')) navigate('/faculty/marks');
    else if (q.includes('time') || q.includes('schedule')) navigate('/faculty/timetable');
    else if (q.includes('notice')) navigate('/faculty/notices');
    else if (q.includes('event')) navigate('/faculty/events');
    else navigate('/faculty/dashboard');
  };

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'FC';

  const employeeId = facultyProfile?.employeeId || 'EMP0102';
  const department = facultyProfile?.department || 'Computer Science & Engineering';

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      {/* Left Area: Mobile Toggle, Welcome & Quick Context */}
      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Welcome Message & Context Badge */}
        <div className="hidden sm:flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-200">Welcome, {user?.name || 'Faculty Member'}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800/50 font-semibold flex items-center gap-1">
              <IdCard className="w-3 h-3" />
              {employeeId}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
            <Building2 className="w-3 h-3 text-indigo-400 shrink-0" />
            <span className="truncate">{department}</span>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden xl:block max-w-xs w-full ml-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects, attendance, marks..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </form>
      </div>

      {/* Right Area: Notification Bell, Profile Link & Logout */}
      <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Faculty Alerts & Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-500 text-[10px] font-extrabold text-white flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotificationsDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 overflow-hidden">
              <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-white">Faculty Activity & Notifications</span>
                </div>
                <Link
                  to="/faculty/notifications"
                  onClick={() => setShowNotificationsDropdown(false)}
                  className="text-[11px] font-semibold text-indigo-400 hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((n) => (
                    <div key={n._id} className="p-3 hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
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

        {/* User Profile Link */}
        <Link
          to="/faculty/profile"
          className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md shadow-indigo-500/20">
            {userInitials}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-white leading-tight">{user?.name || 'Dr. Faculty'}</div>
            <div className="text-[10px] font-medium text-indigo-400 capitalize">{user?.role || 'faculty'}</div>
          </div>
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          title="Log out of faculty portal"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
