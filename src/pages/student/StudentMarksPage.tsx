import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { GraduationCap, AlertCircle, RefreshCw, Award, BookOpen } from 'lucide-react';
import { MarkRecord } from '../../types';

interface MarksData {
  records: MarkRecord[];
  cgpa: number;
}

export const StudentMarksPage: React.FC = () => {
  const [data, setData] = useState<MarksData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterExam, setFilterExam] = useState<string>('All');

  const fetchMarks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ success: boolean; data: MarksData }>('/students/marks');
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setError('Failed to fetch marks report.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching marks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarks();
  }, []);

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'O', label: 'Outstanding', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' };
    if (percentage >= 80) return { grade: 'A+', label: 'Excellent', color: 'text-indigo-400 bg-indigo-950/60 border-indigo-800' };
    if (percentage >= 70) return { grade: 'A', label: 'Very Good', color: 'text-blue-400 bg-blue-950/60 border-blue-800' };
    if (percentage >= 60) return { grade: 'B+', label: 'Good', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800' };
    if (percentage >= 50) return { grade: 'B', label: 'Above Average', color: 'text-amber-400 bg-amber-950/60 border-amber-800' };
    return { grade: 'F', label: 'Fail', color: 'text-rose-400 bg-rose-950/60 border-rose-800' };
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse font-sans">
        <div className="h-32 rounded-3xl bg-slate-900 border border-slate-800" />
        <div className="h-64 rounded-3xl bg-slate-900 border border-slate-800" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-slate-900/60 rounded-3xl border border-slate-800">
        <AlertCircle className="w-12 h-12 text-rose-400 mb-3" />
        <h3 className="text-lg font-bold text-white mb-1">Academic Marks Error</h3>
        <p className="text-xs text-slate-400 max-w-md mb-6">{error}</p>
        <button
          onClick={fetchMarks}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  const filteredRecords = filterExam === 'All'
    ? data.records
    : data.records.filter((r) => r.examType === filterExam);

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-500/30">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Performance</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Marks & Grade Sheet</h1>
          <p className="text-xs text-slate-300 mt-1">
            Official examination scores and cumulative academic standing
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[200px]">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Cumulative GPA</span>
          <div className="text-3xl font-black text-emerald-400 mt-0.5">{data.cgpa.toFixed(2)}</div>
          <div className="text-[10px] text-slate-400 mt-1">Scale of 10.0</div>
        </div>
      </div>

      {/* Filter and Marks Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <h2 className="text-base font-bold text-white">Examination Scores</h2>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-medium">Filter Exam:</span>
            <select
              value={filterExam}
              onChange={(e) => setFilterExam(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Examinations</option>
              <option value="Mid1">Mid 1</option>
              <option value="Mid2">Mid 2</option>
              <option value="Internal">Internal</option>
              <option value="Semester">Semester</option>
            </select>
          </div>
        </div>

        {filteredRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="pb-3 px-3">Subject</th>
                  <th className="pb-3 px-3">Exam Type</th>
                  <th className="pb-3 px-3">Marks Obtained</th>
                  <th className="pb-3 px-3">Max Marks</th>
                  <th className="pb-3 px-3">Percentage</th>
                  <th className="pb-3 px-3 text-right">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredRecords.map((m) => {
                  const pct = Math.round((m.marksObtained / m.maxMarks) * 100);
                  const g = getGrade(pct);

                  return (
                    <tr key={m._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-white">{m.subject}</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 text-[10px] font-bold border border-indigo-800/40">
                          {m.examType}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-200">{m.marksObtained}</td>
                      <td className="py-3.5 px-3 text-slate-400">{m.maxMarks}</td>
                      <td className="py-3.5 px-3 font-bold text-emerald-400">{pct}%</td>
                      <td className="py-3.5 px-3 text-right">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${g.color}`}>
                          {g.grade}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl">
            No examination marks records match your selected filter.
          </div>
        )}
      </div>
    </div>
  );
};
