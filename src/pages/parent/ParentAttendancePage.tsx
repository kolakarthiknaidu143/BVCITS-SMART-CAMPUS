import React, { useState, useEffect } from 'react';
import { CalendarCheck, AlertTriangle, CheckCircle2, BookOpen, Clock, ShieldCheck, Filter } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { AttendanceRecord } from '../../types';

interface AttendanceData {
  records: AttendanceRecord[];
  overallPercentage: number;
  totalClasses: number;
  presentClasses: number;
  absentClasses: number;
  threshold: number;
  status: string;
  subjectBreakdown: Record<string, { total: number; present: number; absent: number; percentage: number }>;
  student: {
    name: string;
    rollNumber: string;
    department: string;
  };
}

export const ParentAttendancePage: React.FC = () => {
  const [data, setData] = useState<AttendanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<string>('ALL');

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch<{ success: boolean; data: AttendanceData }>('/parent/attendance');
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError('Failed to retrieve student attendance data.');
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching attendance records.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
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
        <h2 className="text-base font-bold text-white mb-1">Attendance Log Unavailable</h2>
        <p className="text-xs text-slate-400 mb-4">{error || 'No attendance records logged for your ward.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
        >
          Retry
        </button>
      </div>
    );
  }

  const { records, overallPercentage, totalClasses, presentClasses, absentClasses, subjectBreakdown, student } = data;
  const isLow = overallPercentage < 75;

  const subjectsList = Object.keys(subjectBreakdown);
  const filteredRecords = subjectFilter === 'ALL'
    ? records
    : records.filter((r) => r.subject === subjectFilter);

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Attendance Monitoring</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Ward Attendance Record</h1>
          <p className="text-xs text-slate-300 mt-1">
            Student: <strong className="text-white">{student.name}</strong> ({student.rollNumber}) • {student.department}
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Official Status</span>
          <span className={`text-sm font-extrabold flex items-center justify-end gap-1 mt-0.5 ${isLow ? 'text-amber-400' : 'text-emerald-400'}`}>
            {isLow ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{isLow ? 'Critical Low Attendance' : 'Satisfactory (Above 75%)'}</span>
          </span>
        </div>
      </div>

      {/* Attendance Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Attendance</span>
          <div className={`text-3xl font-extrabold mt-2 ${isLow ? 'text-amber-400' : 'text-white'}`}>
            {overallPercentage}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">University Minimum: 75%</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Present Count</span>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">{presentClasses}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Classes Attended</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Absent Count</span>
          <div className={`text-3xl font-extrabold mt-2 ${absentClasses > 5 ? 'text-rose-400' : 'text-white'}`}>{absentClasses}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Missed Sessions</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sessions</span>
          <div className="text-3xl font-extrabold text-white mt-2">{totalClasses}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Conducted This Semester</span>
        </div>
      </div>

      {/* Subject-Wise Breakdown Cards */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span>Subject-Wise Attendance Breakdown</span>
          </h2>
          <span className="text-xs text-slate-400">{subjectsList.length} Registered Courses</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjectsList.map((subj) => {
            const item = subjectBreakdown[subj];
            const subjLow = item.percentage < 75;
            return (
              <div
                key={subj}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2.5 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs font-bold text-white leading-tight">{subj}</h3>
                  <span
                    className={`text-xs font-extrabold px-2 py-0.5 rounded shrink-0 ${
                      subjLow
                        ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                    }`}
                  >
                    {item.percentage}%
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      subjLow ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>Present: <strong className="text-emerald-400">{item.present}</strong></span>
                  <span>Absent: <strong className="text-rose-400">{item.absent}</strong></span>
                  <span>Total Classes: <strong className="text-white">{item.total}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Attendance Logs Table with Filtering */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Daily Session Logs</h2>
          </div>

          {/* Subject Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Subjects</option>
              {subjectsList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredRecords.length > 0 ? (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Subject</th>
                  <th className="p-3.5">Session Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredRecords.map((rec, i) => (
                  <tr key={rec._id || i} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-semibold text-white">{rec.date}</td>
                    <td className="p-3.5 font-medium">{rec.subject}</td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          rec.status === 'Present'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                            : 'bg-rose-950 text-rose-300 border border-rose-800/40'
                        }`}
                      >
                        {rec.status === 'Present' ? (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 mr-1" />
                        )}
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl">
            No attendance records found for this selection.
          </div>
        )}
      </div>
    </div>
  );
};
