import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';
import {
  Users,
  Award,
  CheckCircle2,
  Clock,
  Edit3,
  X,
  Search,
  BookOpen,
  Send,
  AlertCircle,
  BarChart2,
  TrendingUp,
} from 'lucide-react';

export const TrainerParticipantsPage: React.FC = () => {
  const [trainings, setTrainings] = useState<any[]>([]);
  const [selectedTrainingId, setSelectedTrainingId] = useState<string>('');
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingParticipant, setEditingParticipant] = useState<any | null>(null);

  const [progressForm, setProgressForm] = useState({
    progressPercentage: 50,
    attendanceCount: 8,
    totalSessions: 10,
    status: 'In Progress',
    grade: 'A',
    notes: 'Actively participating in practical labs and assignment submissions.',
  });

  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchTrainings = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<any>('/trainer/trainings');
      if (res.success && res.trainings && res.trainings.length > 0) {
        setTrainings(res.trainings);
        setSelectedTrainingId(res.trainings[0]._id);
      }
    } catch (err: any) {
      setError(err.message || 'Error loading trainings.');
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async (trainingId: string) => {
    if (!trainingId) return;
    setParticipantsLoading(true);
    setError(null);
    try {
      const res = await apiFetch<any>(`/trainer/trainings/${trainingId}/participants`);
      if (res.success) {
        setParticipants(res.participants || []);
      } else {
        setError(res.message || 'Failed to fetch participants.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching participants.');
    } finally {
      setParticipantsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  useEffect(() => {
    if (selectedTrainingId) {
      fetchParticipants(selectedTrainingId);
    }
  }, [selectedTrainingId]);

  const openUpdateModal = (p: any) => {
    setEditingParticipant(p);
    setProgressForm({
      progressPercentage: p.progressPercentage || 0,
      attendanceCount: p.attendanceCount || 0,
      totalSessions: p.totalSessions || 10,
      status: p.status || 'In Progress',
      grade: p.grade || 'A',
      notes: p.notes || '',
    });
    setUpdateError(null);
    setUpdateSuccess(null);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParticipant || !selectedTrainingId) return;

    setSubmitting(true);
    setUpdateError(null);
    setUpdateSuccess(null);

    try {
      const payload = {
        studentUserId: editingParticipant.studentUserId._id,
        progressPercentage: Number(progressForm.progressPercentage),
        attendanceCount: Number(progressForm.attendanceCount),
        totalSessions: Number(progressForm.totalSessions),
        status: progressForm.status,
        grade: progressForm.grade,
        notes: progressForm.notes,
      };

      const res = await apiFetch<any>(`/trainer/trainings/${selectedTrainingId}/progress`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      if (res.success) {
        setUpdateSuccess('Student progress updated & notification sent to MongoDB Atlas!');
        setTimeout(() => {
          setEditingParticipant(null);
          setUpdateSuccess(null);
          fetchParticipants(selectedTrainingId);
        }, 1200);
      } else {
        setUpdateError(res.message || 'Failed to update progress.');
      }
    } catch (err: any) {
      setUpdateError(err.message || 'Error updating student progress.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredParticipants = participants.filter((p) => {
    const sName = p.studentUserId?.name || '';
    const sEmail = p.studentUserId?.email || '';
    const sRoll = p.studentProfile?.rollNumber || '';
    const sDept = p.studentProfile?.department || '';
    const term = searchTerm.toLowerCase();
    return (
      sName.toLowerCase().includes(term) ||
      sEmail.toLowerCase().includes(term) ||
      sRoll.toLowerCase().includes(term) ||
      sDept.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-amber-400" />
            <span>Trainee Progress Tracker</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Track student attendance, practical skill acquisition, completion certificates, and grades.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading program selection...
        </div>
      ) : trainings.length === 0 ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 text-xs">
          No training programs available to track.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Program Switcher */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
              <label className="text-xs font-bold text-slate-300 whitespace-nowrap">Select Program:</label>
              <select
                value={selectedTrainingId}
                onChange={(e) => setSelectedTrainingId(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 w-full sm:w-80"
              >
                {trainings.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.title} ({t.enrolledStudents?.length || 0} Students)
                  </option>
                ))}
              </select>
            </div>

            {/* Search Filter */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, roll no, dept..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Participants Table */}
          {participantsLoading ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Fetching enrolled trainees...
            </div>
          ) : filteredParticipants.length === 0 ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 text-xs">
              No enrolled trainees found matching criteria.
            </div>
          ) : (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Student Trainee</th>
                      <th className="px-6 py-4">Department / Roll No</th>
                      <th className="px-6 py-4">Progress %</th>
                      <th className="px-6 py-4">Attendance</th>
                      <th className="px-6 py-4">Status & Grade</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredParticipants.map((p, idx) => {
                      const studentName = p.studentUserId?.name || 'Student';
                      const studentEmail = p.studentUserId?.email || '';
                      const rollNo = p.studentProfile?.rollNumber || 'N/A';
                      const dept = p.studentProfile?.department || 'Engineering';

                      return (
                        <tr key={idx} className="hover:bg-slate-800/40 transition-all">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0">
                                {studentName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-white">{studentName}</p>
                                <p className="text-[10px] text-slate-400">{studentEmail}</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <p className="font-semibold text-slate-200">{dept}</p>
                            <p className="text-[10px] text-slate-400 font-mono">Roll: {rollNo}</p>
                          </td>

                          <td className="px-6 py-4">
                            <div className="w-32 space-y-1">
                              <div className="flex items-center justify-between text-[10px] font-bold">
                                <span className="text-amber-400">{p.progressPercentage}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                <div
                                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                                  style={{ width: `${Math.min(100, Math.max(0, p.progressPercentage))}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="font-mono text-slate-200 font-bold">
                              {p.attendanceCount} / {p.totalSessions}
                            </span>
                            <span className="text-[10px] text-slate-500 block">Sessions Attended</span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                  p.status === 'Completed' || p.status === 'Certified'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                    : p.status === 'In Progress'
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                    : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                }`}
                              >
                                {p.status}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 font-bold text-[10px]">
                                Grade {p.grade || 'A'}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => openUpdateModal(p)}
                              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs inline-flex items-center gap-1.5 transition-all"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Update Progress</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Student Progress Modal */}
      {editingParticipant && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative">
            <button
              onClick={() => setEditingParticipant(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-lg font-bold text-white">Update Trainee Progress</h2>
              <p className="text-xs text-amber-400 font-semibold mt-0.5">
                {editingParticipant.studentUserId?.name} ({editingParticipant.studentProfile?.rollNumber || 'Student'})
              </p>
            </div>

            {updateError && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs">
                {updateError}
              </div>
            )}
            {updateSuccess && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{updateSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-400 font-semibold">Progress Completion (%):</label>
                  <span className="font-extrabold text-amber-400 text-sm">{progressForm.progressPercentage}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={progressForm.progressPercentage}
                  onChange={(e) => setProgressForm({ ...progressForm, progressPercentage: Number(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Attended Sessions</label>
                  <input
                    type="number"
                    min="0"
                    value={progressForm.attendanceCount}
                    onChange={(e) => setProgressForm({ ...progressForm, attendanceCount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Total Sessions</label>
                  <input
                    type="number"
                    min="1"
                    value={progressForm.totalSessions}
                    onChange={(e) => setProgressForm({ ...progressForm, totalSessions: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Training Status</label>
                  <select
                    value={progressForm.status}
                    onChange={(e) => setProgressForm({ ...progressForm, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Enrolled">Enrolled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Certified">Certified</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Grade / Assessment</label>
                  <select
                    value={progressForm.grade}
                    onChange={(e) => setProgressForm({ ...progressForm, grade: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="O">O (Outstanding)</option>
                    <option value="A+">A+ (Excellent)</option>
                    <option value="A">A (Very Good)</option>
                    <option value="B+">B+ (Good)</option>
                    <option value="B">B (Satisfactory)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Trainer Feedback Notes</label>
                <textarea
                  rows={3}
                  value={progressForm.notes}
                  onChange={(e) => setProgressForm({ ...progressForm, notes: e.target.value })}
                  placeholder="Specific practical lab performance notes or feedback..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingParticipant(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-extrabold shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  {submitting ? 'Saving to MongoDB...' : 'Save & Notify Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
