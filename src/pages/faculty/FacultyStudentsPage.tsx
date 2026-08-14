import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, ShieldCheck, Mail, Phone, CalendarCheck, GraduationCap } from 'lucide-react';
import { apiFetch } from '../../services/api';

interface StudentRecord {
  _id: string;
  studentUserId: string;
  name: string;
  rollNumber: string;
  email: string;
  phone: string;
  department: string;
  semester: number;
  section: string;
  attendancePercentage: number;
  cgpa: number;
  status: 'Regular' | 'Low Attendance';
}

export const FacultyStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        let url = '/faculty/students';
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.append('search', searchQuery.trim());
        if (selectedSemester !== 'all') params.append('semester', selectedSemester);

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const res = await apiFetch<{ success: boolean; data: StudentRecord[] }>(url);
        if (res.success && res.data) {
          setStudents(res.data);
        } else {
          setError('Failed to fetch department students roster.');
        }
      } catch (err: any) {
        setError(err.message || 'Error loading student records.');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchStudents, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedSemester]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Class Roster & Records</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Assigned Department Students</h1>
          <p className="text-xs text-slate-400 mt-1">
            Access students enrolled under your department and assigned subjects. Unrelated student records are strictly restricted.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-right shrink-0">
          <div className="text-xl font-extrabold text-indigo-400">{students.length}</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase">Total Enrolled</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name or roll number..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Semester Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            <option value="all">All Semesters</option>
            <option value="6">Semester 6</option>
            <option value="4">Semester 4</option>
            <option value="2">Semester 2</option>
          </select>
        </div>
      </div>

      {/* Students Table / Grid */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-slate-900 border border-slate-800 rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-800/50 text-center text-xs text-rose-300">
          {error}
        </div>
      ) : students.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Students Found</h3>
          <p className="text-xs text-slate-400">No students found matching your search query or assigned department.</p>
        </div>
      ) : (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Student Info</th>
                  <th className="py-3.5 px-4">Roll Number</th>
                  <th className="py-3.5 px-4">Sem & Section</th>
                  <th className="py-3.5 px-4">Overall Attendance</th>
                  <th className="py-3.5 px-4">Academic CGPA</th>
                  <th className="py-3.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {students.map((student) => {
                  const isLowAttendance = student.attendancePercentage < 75;
                  return (
                    <tr key={student._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="font-bold text-white text-xs">{student.name}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span>{student.email}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-indigo-400">{student.rollNumber}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div>Sem {student.semester}</div>
                        <div className="text-[10px] text-slate-500">Sec {student.section || 'CSE-A'}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-extrabold ${
                              isLowAttendance ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                          >
                            {student.attendancePercentage}%
                          </span>
                          <div className="w-16 bg-slate-950 h-1.5 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className={`h-full rounded-full ${
                                isLowAttendance ? 'bg-rose-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(student.attendancePercentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {student.cgpa ? `${student.cgpa.toFixed(2)} CGPA` : 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            isLowAttendance
                              ? 'bg-rose-950/60 text-rose-400 border-rose-800/60'
                              : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                          }`}
                        >
                          {isLowAttendance ? 'Low Attendance' : 'Regular'}
                        </span>
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
  );
};
