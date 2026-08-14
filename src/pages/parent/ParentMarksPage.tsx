import React, { useState, useEffect } from 'react';
import { GraduationCap, Award, BookOpen, AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { MarkRecord } from '../../types';

interface MarksData {
  records: MarkRecord[];
  cgpa: number;
  student: {
    name: string;
    rollNumber: string;
    department: string;
    semester: number;
  };
}

export const ParentMarksPage: React.FC = () => {
  const [data, setData] = useState<MarksData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [examFilter, setExamFilter] = useState<string>('ALL');

  useEffect(() => {
    const fetchMarks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch<{ success: boolean; data: MarksData }>('/parent/marks');
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError('Failed to retrieve student marks.');
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching marks records.');
      } finally {
        setLoading(false);
      }
    };

    fetchMarks();
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
        <h2 className="text-base font-bold text-white mb-1">Academic Records Unavailable</h2>
        <p className="text-xs text-slate-400 mb-4">{error || 'No evaluation marks found for your ward.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
        >
          Retry
        </button>
      </div>
    );
  }

  const { records, cgpa, student } = data;

  const filteredRecords = examFilter === 'ALL'
    ? records
    : records.filter((r) => r.examType === examFilter);

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'O', label: 'Outstanding', color: 'text-emerald-400' };
    if (percentage >= 80) return { grade: 'A+', label: 'Excellent', color: 'text-teal-400' };
    if (percentage >= 70) return { grade: 'A', label: 'Very Good', color: 'text-blue-400' };
    if (percentage >= 60) return { grade: 'B+', label: 'Good', color: 'text-indigo-400' };
    if (percentage >= 50) return { grade: 'B', label: 'Above Average', color: 'text-amber-400' };
    if (percentage >= 40) return { grade: 'P', label: 'Pass', color: 'text-orange-400' };
    return { grade: 'F', label: 'Fail / Needs Improvement', color: 'text-rose-400' };
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Performance Record</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Subject Marks & Evaluation</h1>
          <p className="text-xs text-slate-300 mt-1">
            Student: <strong className="text-white">{student.name}</strong> ({student.rollNumber}) • {student.department} • Semester {student.semester}
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Official Cumulative GPA</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-0.5">{cgpa.toFixed(2)} / 10.0</div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Evaluated Assessments</span>
          <div className="text-3xl font-extrabold text-white mt-2">{records.length}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Recorded on transcript</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Academic Standing</span>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">
            {cgpa >= 8.5 ? 'First Class with Distinction' : cgpa >= 6.5 ? 'First Class' : 'Second Class'}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Based on university grading criteria</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Semester Status</span>
          <div className="text-3xl font-extrabold text-white mt-2">Semester {student.semester}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Full-time B.Tech Curriculum</span>
        </div>
      </div>

      {/* Marks Table with Filter */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Course Assessment Scorecard</h2>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Exam Type:</span>
            <select
              value={examFilter}
              onChange={(e) => setExamFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Exams</option>
              <option value="Mid1">Mid 1 Exam</option>
              <option value="Mid2">Mid 2 Exam</option>
              <option value="Internal">Internal Assessment</option>
              <option value="Semester">Semester End Exam</option>
            </select>
          </div>
        </div>

        {filteredRecords.length > 0 ? (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Subject</th>
                  <th className="p-3.5">Assessment Type</th>
                  <th className="p-3.5 text-center">Score Obtained</th>
                  <th className="p-3.5 text-center">Maximum Score</th>
                  <th className="p-3.5 text-center">Percentage</th>
                  <th className="p-3.5 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredRecords.map((rec, idx) => {
                  const pct = rec.maxMarks > 0 ? Math.round((rec.marksObtained / rec.maxMarks) * 100) : 0;
                  const gradeInfo = getGrade(pct);
                  return (
                    <tr key={rec._id || idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold text-white">{rec.subject}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[11px]">
                          {rec.examType}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-bold text-emerald-400 text-sm">
                        {rec.marksObtained}
                      </td>
                      <td className="p-3.5 text-center text-slate-400 font-medium">
                        {rec.maxMarks}
                      </td>
                      <td className="p-3.5 text-center font-bold text-slate-200">
                        {pct}%
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`inline-block font-extrabold px-2 py-0.5 rounded bg-slate-950 border border-slate-800 ${gradeInfo.color}`}>
                          {gradeInfo.grade} ({gradeInfo.label})
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
            No marks records found for this assessment type.
          </div>
        )}
      </div>
    </div>
  );
};
