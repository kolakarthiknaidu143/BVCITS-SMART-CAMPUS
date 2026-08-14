import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { CalendarCheck, AlertCircle, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { AttendanceRecord } from '../../types';

interface AttendanceData {
  records: AttendanceRecord[];
  overallPercentage: number;
  totalClasses: number;
  presentClasses: number;
  subjectBreakdown: Record<string, { total: number; present: number; percentage: number }>;
}

export const StudentAttendancePage: React.FC = () => {
  const [data, setData] = useState<AttendanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ success: boolean; data: AttendanceData }>('/students/attendance');
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setError('Failed to fetch attendance logs.');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to attendance service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 rounded-3xl bg-slate-900 border border-slate-800" />
        <div className="h-64 rounded-3xl bg-slate-900 border border-slate-800" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-slate-900/60 rounded-3xl border border-slate-800">
        <AlertCircle className="w-12 h-12 text-rose-400 mb-3" />
        <h3 className="text-lg font-bold text-white mb-1">Attendance Record Error</h3>
        <p className="text-xs text-slate-400 max-w-md mb-6">{error}</p>
        <button
          onClick={fetchAttendance}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  const { records, overallPercentage, totalClasses, presentClasses, subjectBreakdown } = data;

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner & Stat */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2 border border-blue-500/30">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Attendance Portal</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Academic Attendance Summary</h1>
          <p className="text-xs text-slate-300 mt-1">
            Real-time biometric & faculty-verified attendance records for current semester
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[200px]">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Overall Percentage</span>
          <div className="text-3xl font-black text-white mt-0.5">{overallPercentage}%</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {presentClasses} / {totalClasses} Classes Attended
          </div>
        </div>
      </div>

      {/* Subject-wise Cards */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">Subject-wise Attendance Breakdown</h2>

        {Object.keys(subjectBreakdown).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(subjectBreakdown).map(([subject, item]: [string, any]) => (
              <div key={subject} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
                  <span className="truncate pr-2">{subject}</span>
                  <span className={item.percentage >= 75 ? 'text-emerald-400' : 'text-rose-400'}>{item.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all ${item.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Attended: {item.present}/{item.total}</span>
                  <span>Required: 75%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl">
            No subject breakdowns available.
          </div>
        )}
      </div>

      {/* Logs Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">Daily Class Attendance Logs</h2>

        {records.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3">Subject</th>
                  <th className="pb-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {records.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-300">{r.date}</td>
                    <td className="py-3 px-3 font-bold text-white">{r.subject}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === 'Present'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                            : 'bg-rose-950 text-rose-300 border border-rose-800/50'
                        }`}
                      >
                        {r.status === 'Present' ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3 text-rose-400" />}
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl">
            No attendance logs found.
          </div>
        )}
      </div>
    </div>
  );
};
