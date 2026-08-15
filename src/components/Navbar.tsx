import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationMenu } from './NotificationMenu';
import { LogOut, Menu, X, ChevronRight, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/#about' },
    { name: 'Services', path: '/#services' },
    { name: 'Placements', path: '/#placements' },
    { name: 'Contact', path: '/#contact' },
  ];

  const getDashboardPath = () => {
    switch (user?.role) {
      case 'student':
        return '/student/dashboard';
      case 'parent':
        return '/parent/portal';
      case 'faculty':
        return '/faculty/portal';
      case 'admin':
        return '/admin/dashboard';
      case 'recruiter':
        return '/recruiter/dashboard';
      case 'trainer':
        return '/trainer/dashboard';
      default:
        return '/login';
    }
  };

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    if (path.startsWith('/#')) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const elem = document.getElementById(path.replace('/#', ''));
          elem?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const elem = document.getElementById(path.replace('/#', ''));
        elem?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group" id="bvcits-logo-link">
            <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-md shadow-indigo-500/10 group-hover:scale-105 transition-transform overflow-hidden">
              <img
  src="/bvcits-logo.jpeg"
  alt="BVCITS Logo"
  className="h-full w-full object-fill"
/>
            </div>

            <div>
              <div className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                BVCITS
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  SMART CAMPUS
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                Autonomous Institution of Excellence
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.path)}
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <NotificationMenu />
                <button
                  onClick={() => navigate(getDashboardPath())}
                  id="dashboard-btn"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors flex items-center space-x-2"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Dashboard</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={logout}
                  id="logout-btn"
                  className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                id="login-button-navbar"
                className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:shadow-indigo-500/30 flex items-center space-x-2"
              >
                <span>Login</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            {user && <NotificationMenu />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.path)}
              className="block w-full text-left py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600"
            >
              {link.name}
            </button>
          ))}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            {user ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(getDashboardPath());
                  }}
                  className="w-full py-2.5 px-4 text-center text-sm font-semibold text-white bg-indigo-600 rounded-xl"
                >
                  Go to Dashboard ({user.role.toUpperCase()})
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-2.5 px-4 text-center text-sm font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/30 rounded-xl"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 text-center text-sm font-bold text-white bg-indigo-600 rounded-xl"
              >
                Login to Portal
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
