import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../services/api';
import { Award, Clock, CheckCircle2, AlertCircle, RefreshCw, ChevronRight, BookOpen } from 'lucide-react';
import { TrainingProgram } from '../../types';

export const StudentTrainingPage: React.FC = () => {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState<TrainingProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchTrainings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ success: boolean; trainings: TrainingProgram[] }>('/trainings');
      if (res.success && res.trainings) {
        setTrainings(res.trainings);
      } else {
        setError('Failed to fetch training programs.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching training programs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const handleRegister = async (trainingId: string) => {
    setRegisteringId(trainingId);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await apiFetch<{ success: boolean; message: string; training: TrainingProgram }>(
        `/trainings/${trainingId}/register`,
        { method: 'POST' }
      );

      if (res.success) {
        setSuccessMsg(res.message || 'Successfully enrolled in training program!');
        setTrainings((prev) =>
          prev.map((t) => (t._id === trainingId ? res.training : t))
        );
      } else {
        setError(res.message || 'Failed to register for training program.');
      }
    } catch (err: any) {
      setError(err.message || 'Error enrolling in training program.');
    } finally {
      setRegisteringId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse font-sans">
        <div className="h-32 rounded-3xl bg-slate-900 border border-slate-800" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-slate-900 border border-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2 border border-cyan-500/30">
            <Award className="w-3.5 h-3.5" />
            <span>Skill Development Academy</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Campus Training Bootcamps</h1>
          <p className="text-xs text-slate-300 mt-1">
            Hands-on technical workshops, full-stack bootcamps, and career readiness certifications
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Training Programs Grid */}
      {trainings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trainings.map((t: any) => {
            const isEnrolled = user?._id ? t.enrolledStudents.includes(user._id) : false;
            const myProgress = user?._id && Array.isArray(t.participantProgress)
              ? t.participantProgress.find((p: any) => String(p.studentUserId) === String(user._id))
              : null;

            return (
              <div
                key={t._id}
                className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-cyan-500/40 transition-all space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                      {t.duration}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Trainer: <strong className="text-white">{t.trainerName || 'Specialist Trainer'}</strong>
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-white mb-1">{t.title}</h2>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">{t.description}</p>

                  {t.skills && t.skills.length > 0 && (
                    <div className="mb-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Skills Covered
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {t.skills.map((s: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300 font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Enrolled Live Progress Section */}
                  {isEnrolled && (
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 mb-3">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-amber-400 flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" /> Live Trainer Progress
                        </span>
                        <span className="text-white font-mono">{myProgress?.progressPercentage ?? 10}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(0, myProgress?.progressPercentage ?? 10))}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>Attendance: <strong className="text-slate-200">{myProgress?.attendanceCount ?? 1} / {myProgress?.totalSessions ?? 10} Sessions</strong></span>
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                          {myProgress?.status || 'Enrolled'}
                        </span>
                      </div>

                      {myProgress?.notes && (
                        <p className="text-[11px] text-slate-300 italic pt-1 border-t border-slate-900">
                          "{myProgress.notes}"
                        </p>
                      )}
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-800/80">
                    <span className="text-slate-500 font-semibold">Eligibility: </span>
                    <span className="text-slate-300">{t.eligibility}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  {isEnrolled ? (
                    <span className="px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Enrolled & Tracked</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRegister(t._id)}
                      disabled={registeringId === t._id}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {registeringId === t._id ? (
                        <span>Enrolling...</span>
                      ) : (
                        <>
                          <span>Register Program</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center text-xs text-slate-500 bg-slate-900/60 rounded-3xl border border-slate-800">
          No training programs available at this time.
        </div>
      )}
    </div>
  );
};
