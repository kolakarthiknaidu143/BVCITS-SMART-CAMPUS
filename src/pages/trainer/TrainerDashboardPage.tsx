import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';
import {
  Award,
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  Plus,
  BarChart2,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const TrainerDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>({
    totalPrograms: 0,
    totalEnrolledTrainees: 0,
    completedPrograms: 0,
    inProgressPrograms: 0,
  });
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const statsRes = await apiFetch<any>('/trainer/stats');
      if (statsRes.success) {
        setStats(statsRes.stats);
      }

      const trainingsRes = await apiFetch<any>('/trainer/trainings');
      if (trainingsRes.success) {
        setTrainings(trainingsRes.trainings || []);
      }
    } catch (err: any) {
      setError(err.message || 'Error loading trainer dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 rounded-3xl bg-slate-900 border border-slate-800" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-900 border border-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border border-amber-500/20 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-500/30">
            <Award className="w-3.5 h-3.5" />
            <span>Campus Technical Trainer Hub</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Smart Training & Skill Development</h1>
          <p className="text-xs text-slate-300 mt-1">
            Manage bootcamps, update student progress, track attendance, and sync real-time records to MongoDB Atlas.
          </p>
        </div>
        <Link
          to="/trainer/trainings"
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 shrink-0"
        >
          <BookOpen className="w-4 h-4" />
          <span>Manage Bootcamps</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Programs Managed</p>
            <p className="text-2xl font-extrabold text-white mt-1">{stats.totalPrograms}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Trainees</p>
            <p className="text-2xl font-extrabold text-white mt-1">{stats.totalEnrolledTrainees}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active In-Progress</p>
            <p className="text-2xl font-extrabold text-white mt-1">{stats.inProgressPrograms}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed Bootcamps</p>
            <p className="text-2xl font-extrabold text-white mt-1">{stats.completedPrograms}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Active Bootcamps Overview */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Assigned Skill Training Programs</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select a training program to track student attendance and publish module progress.
            </p>
          </div>
          <Link
            to="/trainer/participants"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
          >
            <span>Track Progress</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {trainings.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-950/60 rounded-2xl border border-slate-800">
            No active training programs assigned to your trainer profile yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainings.map((t) => (
              <div
                key={t._id}
                className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                      {t.category || 'Skill Bootcamp'}
                    </span>
                    <span className="text-slate-400 font-medium">{t.duration}</span>
                  </div>

                  <h3 className="text-base font-bold text-white">{t.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{t.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <strong className="text-white">{t.enrolledStudents?.length || 0}</strong> Trainees
                  </span>

                  <Link
                    to="/trainer/participants"
                    className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-bold transition-all inline-flex items-center gap-1"
                  >
                    <span>Update Trainees</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
