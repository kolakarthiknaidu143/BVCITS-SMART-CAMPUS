import React, { useEffect, useState } from 'react';
import { Clock, RefreshCw, AlertTriangle, CheckCircle, Users } from 'lucide-react';
import { apiFetch } from '../../services/api';

export const AdminAttendancePage: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendanceOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<any>('/admin/attendance');
      if (res.success) {
        setData(res);
      } else {
        setError(res.message || 'Failed to fetch attendance monitoring metrics.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching attendance data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceOverview();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-400 font-medium text-sm">Aggregating Institution-wide Attendance Metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400 max-w-lg mx-auto my-12">
        <p className="font-semibold mb-3">{error}</p>
        <button
          onClick={fetchAttendanceOverview}
          className="px-4 py-2 bg-red-500/20 text-red-300 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  const stats = data?.stats || {};
  const lowAttendanceStudents = data?.lowAttendanceStudents || [];
  const recentRecords = data?.recentRecords || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Clock className="w-7 h-7 text-blue-400" />
            <span>Attendance Monitoring & Compliance</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Real-time attendance analytics, compliance tracking, and shortage alerts.</p>
        </div>
        <button
          onClick={fetchAttendanceOverview}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Audit
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Overall Campus Average</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{stats.averageAttendance || 85.5}%</p>
          <p className="text-xs text-slate-400">Target compliance: ≥ 75%</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Enrolled Students</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{stats.totalStudents || 0}</p>
          <p className="text-xs text-slate-400">Tracked across all departments</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Attendance Shortage (&lt;75%)</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-3xl font-extrabold text-red-400">{stats.lowAttendanceCount || 0}</p>
          <p className="text-xs text-red-400/80">Requires academic warning notice</p>
        </div>
      </div>

      {/* Low Attendance Alert Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <span>Students with Low Attendance Shortage</span>
        </h2>

        {lowAttendanceStudents.length === 0 ? (
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-400">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="font-semibold text-slate-200">No attendance shortage alerts!</p>
            <p className="text-xs text-slate-500">All students currently meet or exceed the mandatory 75% criteria.</p>
          </div>
        ) : (
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/80 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Roll Number</th>
                    <th className="px-6 py-4">Department & Sem</th>
                    <th className="px-6 py-4">Attendance Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {lowAttendanceStudents.map((s: any) => (
                    <tr key={s._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-white">
                        <p>{s.userId?.name || 'Student'}</p>
                        <p className="text-xs text-slate-400 font-normal">{s.userId?.email}</p>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-bold text-blue-400">{s.rollNumber}</td>
                      <td className="px-6 py-4 text-xs text-slate-300">
                        {s.department} (Sem {s.semester})
                      </td>
                      <td className="px-6 py-4 font-bold text-red-400">{s.attendancePercentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Recent Class Attendance Logs */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Recent Biometric & Lecture Logs</h2>
        {recentRecords.length === 0 ? (
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-500 italic">
            No class attendance logs recorded recently.
          </div>
        ) : (
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/80 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Section</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentRecords.map((r: any) => (
                    <tr key={r._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 text-xs font-semibold text-slate-300">{r.date}</td>
                      <td className="px-6 py-4 font-semibold text-white">{r.subject}</td>
                      <td className="px-6 py-4 text-xs text-slate-400">{r.section || 'CSE-A'}</td>
                      <td className="px-6 py-4 text-xs">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            r.status === 'Present'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
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
