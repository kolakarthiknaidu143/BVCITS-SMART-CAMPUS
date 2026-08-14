import React, { useState, useEffect } from 'react';
import { Award, User, Clock, CheckCircle2, BookOpen, AlertTriangle, MessageSquare, MapPin } from 'lucide-react';
import { apiFetch } from '../../services/api';

interface TrainingProgramProgress {
  _id: string;
  title: string;
  description: string;
  trainerName: string;
  category?: string;
  duration: string;
  startDate?: string;
  venue?: string;
  skills: string[];
  status: string;
  modules?: string[];
  resources?: string[];
  progressPercentage: number;
  attendanceCount: number;
  totalSessions: number;
  grade: string;
  participantStatus: string;
  notes?: string;
  updatedAt?: string;
}

interface TrainingData {
  trainings: TrainingProgramProgress[];
  student: {
    name: string;
    rollNumber: string;
  };
}

export const ParentTrainingPage: React.FC = () => {
  const [data, setData] = useState<TrainingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTraining = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch<{ success: boolean; data: TrainingData }>('/parent/training');
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError('Failed to retrieve training program progress.');
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching training records.');
      } finally {
        setLoading(false);
      }
    };

    fetchTraining();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center max-w-xl mx-auto my-12 shadow-2xl">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h2 className="text-base font-bold text-white mb-1">Training Records Unavailable</h2>
        <p className="text-xs text-slate-400 mb-4">{error || 'No active training enrollments found.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
        >
          Retry
        </button>
      </div>
    );
  }

  const { trainings, student } = data;

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
            <Award className="w-3.5 h-3.5" />
            <span>Technical Skills & Training</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Bootcamp & Skill Progress</h1>
          <p className="text-xs text-slate-300 mt-1">
            Student: <strong className="text-white">{student.name}</strong> ({student.rollNumber}) • Real-time evaluation logged by certified corporate trainers
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Total Programs</span>
          <span className="text-xl font-extrabold text-emerald-400 mt-0.5">
            {trainings.length} Active Courses
          </span>
        </div>
      </div>

      {/* Trainings List */}
      <div className="space-y-6">
        {trainings.length > 0 ? (
          trainings.map((t) => (
            <div
              key={t._id}
              className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5 hover:border-emerald-500/40 transition-all"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40 uppercase">
                      {t.category || 'Skill Development'}
                    </span>
                    <span className="text-xs text-slate-400">• Duration: {t.duration}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1">{t.title}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{t.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 font-extrabold text-xs border border-emerald-800/50">
                    Grade: {t.grade}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs">
                    {t.status}
                  </span>
                </div>
              </div>

              {/* Progress & Attendance Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Progress Bar */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-300">Curriculum Completion</span>
                    <span className="text-emerald-400 font-bold">{t.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(t.progressPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Training Attendance */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Training Attendance</span>
                    <span className="text-lg font-extrabold text-white mt-0.5 block">
                      {t.attendanceCount} of {t.totalSessions} Sessions
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-400 block">
                      {t.totalSessions > 0 ? Math.round((t.attendanceCount / t.totalSessions) * 100) : 100}%
                    </span>
                    <span className="text-[10px] text-slate-500">Attendance Rate</span>
                  </div>
                </div>
              </div>

              {/* Trainer & Feedback Section */}
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center space-x-2 text-slate-300">
                  <User className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Assigned Trainer: <strong className="text-white">{t.trainerName}</strong></span>
                </div>

                {t.notes && (
                  <div className="flex items-center space-x-2 text-emerald-300 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-800/30">
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <span>Trainer Note: "{t.notes}"</span>
                  </div>
                )}
              </div>

              {/* Modules & Skills covered */}
              {t.skills && t.skills.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-500 font-semibold mr-1">Skills Covered:</span>
                  {t.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-medium text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/60 rounded-3xl border border-slate-800">
            Your ward is not currently enrolled in any active training bootcamps.
          </div>
        )}
      </div>
    </div>
  );
};
