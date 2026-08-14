import React from 'react';
import { Mail, Phone, MapPin, Globe, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import bvcitsLogo from '../assets/bvcits-logo.png';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                <img
                  src={bvcitsLogo}
                  alt="BVCITS Logo"
                  className="h-12 w-auto max-h-12 max-w-12 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                BVCITS <span className="text-indigo-400 font-bold text-xs uppercase ml-1">Smart Campus</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              BVC Institute of Technology and Science (BVCITS) is a premier autonomous engineering institute committed to academic excellence, innovative research, and 100% placement outcomes.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <span className="text-xs text-slate-400 font-medium">Approved by AICTE | Affiliated to JNTUK</span>
            </div>
          </div>

          {/* Col 2: Smart Portals */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">Smart Portals</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Student Portal</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Parent Portal</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Faculty Portal</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Management & Admin</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Placement Recruiter</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Skill Trainer Portal</Link></li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">Academic & Placement</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#about" className="hover:text-indigo-400 transition-colors">About BVCITS</a></li>
              <li><a href="#placements" className="hover:text-indigo-400 transition-colors">Placement Drives 2026</a></li>
              <li><a href="#services" className="hover:text-indigo-400 transition-colors">Training Programs</a></li>
              <li><a href="#notices" className="hover:text-indigo-400 transition-colors">Campus Notices</a></li>
              <li><a href="#events" className="hover:text-indigo-400 transition-colors">Upcoming Events</a></li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">Campus Contact</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Amalapuram, East Godavari, Andhra Pradesh, India</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+91 8856 223344 / 223355</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>principal@bvcits.edu.in</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
                <a href="https://bvcits.edu.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  www.bvcits.edu.in <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} BVCITS Smart Campus. All rights reserved.</p>
          <div className="flex space-x-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
