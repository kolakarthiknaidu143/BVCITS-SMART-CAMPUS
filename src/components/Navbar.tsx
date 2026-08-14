import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationMenu } from './NotificationMenu';
import { LogOut, Menu, X, ChevronRight, User as UserIcon } from 'lucide-react';
import bvcitsLogo from '../assets/bvcits-logo.png';

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
      const targetId = path.replace('/#', '');
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const elem = document.getElementById(targetId);
          elem?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const elem = document.getElementById(targetId);
        elem?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white transition-colors shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-[84px]">
          {/* Official BVCITS Institution Branding (Left) */}
          <Link
            to="/"
            className="flex items-center space-x-3 sm:space-x-3.5 group py-1.5 shrink-0"
            id="bvcits-logo-link"
          >
            <div className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
              <img
                src={bvcitsLogo}
                alt="BVCITS Emblem"
                className="h-full w-full max-h-14 max-w-14 object-contain drop-shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col justify-center select-none">
              <div className="font-black text-xs sm:text-sm lg:text-[15px] tracking-tight text-white uppercase leading-tight font-sans">
                BONAM VENKATA CHALAMAYYA
              </div>
              <div className="font-extrabold text-[11px] sm:text-xs lg:text-[13px] tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent uppercase leading-tight mt-0.5">
                INSTITUTE OF TECHNOLOGY &amp; SCIENCE
              </div>
              <div className="hidden sm:block text-[9px] lg:text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5">
                AUTONOMOUS INSTITUTION OF EXCELLENCE
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.path)}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Action / Login Button (Far Right) */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-2">
                <NotificationMenu />
                <button
                  onClick={() => navigate(getDashboardPath())}
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 transition-colors flex items-center space-x-2"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Dashboard</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-900 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                id="header-login-btn"
                className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:shadow-indigo-500/30 flex items-center space-x-1.5"
              >
                <span>Login</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            {user ? (
              <>
                <NotificationMenu />
                <button
                  onClick={() => navigate(getDashboardPath())}
                  className="p-2 rounded-lg bg-indigo-600 text-white text-xs font-bold"
                  title="Dashboard"
                >
                  <UserIcon className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold flex items-center gap-1"
              >
                <span>Login</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-900"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3 shadow-2xl">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.path)}
              className="block w-full text-left py-2 text-base font-medium text-slate-200 hover:text-indigo-400"
            >
              {link.name}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            {user ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(getDashboardPath());
                  }}
                  className="w-full py-2.5 px-4 text-center text-sm font-semibold text-white bg-indigo-600 rounded-xl flex items-center justify-center gap-2"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Go to Dashboard ({user.role.toUpperCase()})</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-2.5 px-4 text-center text-sm font-semibold text-rose-400 bg-rose-950/30 rounded-xl"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 text-center text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center gap-1.5"
              >
                <span>Login to Portal</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
