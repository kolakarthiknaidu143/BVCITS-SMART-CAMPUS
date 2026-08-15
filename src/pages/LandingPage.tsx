import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import {
  GraduationCap,
  Users,
  UserCheck,
  Building2,
  Briefcase,
  Award,
  BookOpen,
  Calendar,
  Bell,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Clock,
  MapPin,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { NoticeItem, EventItem, PlacementDrive } from '../types';
import { apiFetch } from '../services/api';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [placements, setPlacements] = useState<PlacementDrive[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const [noticesRes, eventsRes, placementsRes] = await Promise.all([
          apiFetch<{ success: boolean; notices: NoticeItem[] }>('/notices').catch(() => ({ success: false, notices: [] })),
          apiFetch<{ success: boolean; events: EventItem[] }>('/events').catch(() => ({ success: false, events: [] })),
          apiFetch<{ success: boolean; placements: PlacementDrive[] }>('/placements').catch(() => ({ success: false, placements: [] })),
        ]);

        if (noticesRes.success) setNotices(noticesRes.notices.slice(0, 3));
        if (eventsRes.success) setEvents(eventsRes.events.slice(0, 2));
        if (placementsRes.success) setPlacements(placementsRes.placements.slice(0, 3));
      } catch (err) {
        console.warn('Landing data fetch issue:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans">
      <Navbar />

      {/* HERO SECTION */}
      {/* HERO SECTION */}
{/* HERO SECTION */}
<section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">

  {/* Background Video */}
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 w-full h-full object-cover"
  >
    <source src="/campus-video.mp4" type="video/mp4" />
  </video>

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-slate-950/60" />

  {/* Hero Content */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    
    {/* existing Hero content */}

  </div>
  {/* Background Overlay */}
  <div className="absolute inset-0 bg-slate-950/60" />

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Badge
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>BVCITS Digital Campus Portal</span>
            </div> */}

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              One Campus. <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                One Smart Platform.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
              Empowering students, parents, faculty, management, recruiters, and trainers with unified real-time attendance, grades, placement drives, and campus communications.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href="#services"
                id="explore-campus-btn"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Explore Campus</span>
                <ChevronRight className="w-4 h-4" />
              </a>

              <Link
                to="/login"
                id="student-login-hero-btn"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student Login</span>
              </Link>
            </div>
          </div>

          {/* Smart Campus Dashboard Preview */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 transition-all hover:shadow-indigo-500/10">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-6 h-6" />
                <span className="text-xs font-semibold text-slate-500 ml-2">BVCITS Smart Campus Command Hub</span>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live System Active
              </span>
            </div>

            {/* Dashboard Mock Preview Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
                <div className="text-xs font-medium text-blue-600 dark:text-blue-400">Attendance</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">91%</div>
                <div className="text-[11px] text-slate-500 mt-0.5">CSE 6th Semester</div>
              </div>
              <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">CGPA</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">8.85</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Top 5% Batch Rank</div>
              </div>
              <div className="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50">
                <div className="text-xs font-medium text-purple-600 dark:text-purple-400">Placements</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">12.5 LPA</div>
                <div className="text-[11px] text-slate-500 mt-0.5">TechCorp Shortlisted</div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
                <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Trainings</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">6 Weeks</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Full-Stack Bootcamp</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SMART SERVICES SECTION */}
      <section id="services" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Core Capabilities
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">Smart Services</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Designed specifically for modern educational institutions requiring precision, accessibility, and speed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 hover:border-indigo-500/50 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-5 shadow-md shadow-blue-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Student Portal</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Access real-time attendance, semester marks, class timetables, exam alerts, and apply for campus recruitment drives.
              </p>
              <Link to="/login" className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 flex items-center gap-1">
                Access Portal <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Service 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 hover:border-emerald-500/50 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-5 shadow-md shadow-emerald-500/20">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Parent Portal</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Monitor student attendance percentage, view exam grade sheets, receive fee alerts, and access parent-teacher meeting notices.
              </p>
              <Link to="/login" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 flex items-center gap-1">
                Access Portal <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Service 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 hover:border-indigo-500/50 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-5 shadow-md shadow-indigo-500/20">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Academics</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Faculty tools for logging daily subject attendance, uploading mid-examination scores, managing course syllabus, and publishing circulars.
              </p>
              <Link to="/login" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 flex items-center gap-1">
                Access Portal <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Service 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 hover:border-purple-500/50 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-5 shadow-md shadow-purple-500/20">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Placements</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Recruiter job posting portal, automatic CGPA eligibility verification, interview shortlisting, and real-time application tracking.
              </p>
              <Link to="/login" className="text-xs font-semibold text-purple-600 dark:text-purple-400 group-hover:text-purple-700 flex items-center gap-1">
                Access Portal <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CONNECTED CAMPUS SECTION */}
      <section id="about" className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              6 Stakeholder Ecosystem
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">Connected Campus</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
               Seamlessly bridging communication and workflows for every member of the BVCITS community.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Students', icon: GraduationCap, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40', desc: 'Track academic standing, attendance logs, syllabus, exam notifications, and job applications.' },
              { title: 'Parents', icon: Users, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40', desc: 'Stay updated on student academic performance, attendance warnings, and campus circulars.' },
              { title: 'Faculty', icon: UserCheck, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40', desc: 'Mark subject attendance in seconds, enter examination marks, and manage course materials.' },
              { title: 'Recruiters', icon: Briefcase, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40', desc: 'Post campus hiring drives, shortlist candidates based on CGPA, and schedule interview rounds.' },
              { title: 'Management / Admin', icon: Building2, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40', desc: 'Oversee departments, approve faculty, monitor campus-wide analytics, and audit security.' },
              { title: 'Trainers', icon: Award, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40', desc: 'Conduct skill development bootcamps, share study resources, and assess student readiness.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start space-x-4">
                  <div className={`p-3 rounded-xl ${item.color} shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CAREER & PLACEMENTS SECTION */}
      <section id="placements" className="py-20 bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
              Placement Excellence 2026
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Career & Placements</h2>
            <p className="text-sm text-slate-300">
              Leading multinational tech corporations actively recruit BVCITS graduates with top-tier packages.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
              <div className="text-3xl sm:text-4xl font-black text-indigo-400">94.2%</div>
              <p className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wider">Placement Rate</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
              <div className="text-3xl sm:text-4xl font-black text-cyan-400">120+</div>
              <p className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wider">Recruiters</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">40+</div>
              <p className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wider">Training Programs</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
              <div className="text-3xl sm:text-4xl font-black text-purple-400">850+</div>
              <p className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wider">Job Offers Made</p>
            </div>
          </div>

          {/* Featured Placement Drives */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {placements.length > 0 ? (
              placements.map((p) => (
                <div key={p._id} className="p-6 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold px-2.5 py-1 rounded bg-indigo-500/30 text-indigo-200">
                        {p.jobRole}
                      </span>
                      <span className="text-sm font-extrabold text-emerald-400">{p.package}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{p.companyName}</h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">{p.description}</p>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span>Deadline: {p.deadline}</span>
                    <Link to="/login" className="text-indigo-300 font-semibold hover:text-white flex items-center gap-1">
                      Apply <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-slate-400 text-sm">
                Active placement drives available in Student Portal upon login.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* NOTICES & EVENTS SECTION */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Latest Notices */}
            <div id="notices" className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Latest Notices</h3>
                </div>
                <Link to="/login" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {notices.map((n) => (
                  <div key={n._id} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 uppercase">
                        {n.category}
                      </span>
                      <span className="text-xs text-slate-400">Audience: {n.audience}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{n.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">{n.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div id="events" className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Upcoming Events</h3>
                </div>
                <Link to="/login" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  Calendar View
                </Link>
              </div>

              <div className="space-y-4">
                {events.map((e) => (
                  <div key={e._id} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex items-start space-x-4">
                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 shrink-0 text-center min-w-[60px]">
                      <div className="text-xs font-bold uppercase">{e.date.split('-')[1] || 'MAR'}</div>
                      <div className="text-lg font-extrabold">{e.date.split('-')[2] || '12'}</div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{e.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{e.description}</p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {e.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {e.venue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT & CALLOUT SECTION */}
      <section id="contact" className="py-16 bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-extrabold">Ready to access BVCITS Smart Campus?</h3>
              <p className="text-sm text-indigo-100 max-w-xl">
                Log in with your institutional credentials to access your personalized student, parent, faculty, or recruiter dashboard.
              </p>
            </div>
            <Link
              to="/login"
              id="login-cta-button"
              className="px-8 py-4 rounded-xl bg-white text-indigo-600 font-extrabold text-sm shadow-lg hover:bg-slate-50 transition-colors shrink-0"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
