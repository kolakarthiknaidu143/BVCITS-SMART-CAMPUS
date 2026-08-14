import React, { useEffect, useState } from 'react';
import { Award, RefreshCw, BookOpen, GraduationCap } from 'lucide-react';
import { apiFetch } from '../../services/api';

export const AdminMarksPage: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAcademicMarks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<any>('/admin/marks');
      if (res.success) {
        setData(res);
      } else {
        setError(res.message || 'Failed to fetch academic marks overview.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching marks data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademicMarks();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        <p className="text-slate-400 font-medium text-sm">Aggregating Examination & Academic Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400 max-w-lg mx-auto my-12">
        <p className="font-semibold mb-3">{error}</p>
        <button
          onClick={fetchAcademicMarks}
          className="px-4 py-2 bg-red-500/20 text-red-300 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  const marksList = data?.marks || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Award className="w-7 h-7 text-purple-400" />
            <span>Academic Performance & Marks Monitoring</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Review examination marks, midterm grades, and CGPA distributions.</p>
        </div>
        <button
          onClick={fetchAcademicMarks}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Scores
        </button>
      </div>

      {/* Summary Stat */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Institutional Cumulative CGPA</span>
            <GraduationCap className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{data?.averageCGPA || 8.2} / 10.0</p>
          <p className="text-xs text-slate-400">Institutional academic standing</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Logged Examination Marks</span>
            <BookOpen className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{data?.totalRecords || 0}</p>
          <p className="text-xs text-slate-400">Synchronized from Faculty Gradebook</p>
        </div>
      </div>

      {/* Marks Records Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Institutional Gradebook Audit Log</h2>
        {marksList.length === 0 ? (
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-500 italic">
            No examination marks currently stored in database.
          </div>
        ) : (
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/80 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Exam Type</th>
                    <th className="px-6 py-4">Marks Obtained</th>
                    <th className="px-6 py-4">Maximum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {marksList.map((m: any) => (
                    <tr key={m._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-white">
                        <p>{m.studentUserId?.name || 'Student'}</p>
                        <p className="text-xs text-slate-400 font-normal">{m.studentUserId?.email}</p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-indigo-300">{m.subject}</td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-300">
                        <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
                          {m.examType}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-400 text-base">{m.marksObtained}</td>
                      <td className="px-6 py-4 text-xs text-slate-400">{m.maxMarks} Marks</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
