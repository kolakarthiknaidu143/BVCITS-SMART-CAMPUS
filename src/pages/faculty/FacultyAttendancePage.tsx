import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Save,
  Users,
  AlertCircle,
  Sparkles,
  Check,
  Building2,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { apiFetch } from '../../services/api';
import { CourseItem } from '../../types';

interface StudentAttendanceItem {
  studentUserId: string;
  name: string;
  rollNumber: string;
  department: string;
  semester: number;
  section: string;
  status: 'Present' | 'Absent';
  isMarked?: boolean;
}

interface AttendanceResponseData {
  subject: string;
  date: string;
  section: string;
  isAlreadyMarked: boolean;
  presentCount: number;
  absentCount: number;
  totalCount: number;
  attendancePercentage: number;
  students: StudentAttendanceItem[];
}

export const FacultyAttendancePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSubjectParam = searchParams.get('subject') || '';

  const [assignedSubjects, setAssignedSubjects] = useState<CourseItem[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubjectParam);
  const [selectedSection, setSelectedSection] = useState<string>('CSE-A');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [studentList, setStudentList] = useState<StudentAttendanceItem[]>([]);
  const [isAlreadyMarked, setIsAlreadyMarked] = useState(false);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch faculty assigned subjects list first
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await apiFetch<{ success: boolean; data: CourseItem[] }>('/faculty/subjects');
        if (res.success && res.data && res.data.length > 0) {
          setAssignedSubjects(res.data);
          if (!selectedSubject) {
            setSelectedSubject(res.data[0].name);
          }
        }
      } catch (err) {
        // Silent catch
      }
    };
    fetchSubjects();
  }, []);

  // Fetch student roster & existing attendance for selected subject, section, and date
  const loadAttendanceRoster = async () => {
    if (!selectedSubject || !selectedDate) return;

    try {
      setLoading(true);
      setError(null);
      setSuccessMsg(null);

      const queryUrl = `/faculty/attendance?subject=${encodeURIComponent(
        selectedSubject
      )}&date=${encodeURIComponent(selectedDate)}&section=${encodeURIComponent(selectedSection)}`;

      const res = await apiFetch<{ success: boolean; data: AttendanceResponseData }>(queryUrl);

      if (res.success && res.data) {
        setStudentList(res.data.students);
        setIsAlreadyMarked(res.data.isAlreadyMarked);
      } else {
        setError('Failed to fetch student attendance list.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching attendance records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSubject) {
      loadAttendanceRoster();
    }
  }, [selectedSubject, selectedDate, selectedSection]);

  // Toggle individual student attendance status
  const handleStatusToggle = (studentUserId: string, newStatus: 'Present' | 'Absent') => {
    setStudentList((prev) =>
      prev.map((item) =>
        item.studentUserId === studentUserId ? { ...item, status: newStatus } : item
      )
    );
  };

  // Mark all present or all absent helpers
  const handleMarkAll = (status: 'Present' | 'Absent') => {
    setStudentList((prev) => prev.map((item) => ({ ...item, status })));
  };

  // Save attendance submit handler
  const handleSaveAttendance = async () => {
    if (!selectedSubject || !selectedDate || studentList.length === 0) return;

    try {
      setSaving(true);
      setError(null);
      setSuccessMsg(null);

      const payload = {
        subject: selectedSubject,
        date: selectedDate,
        section: selectedSection,
        attendanceList: studentList.map((item) => ({
          studentUserId: item.studentUserId,
          status: item.status,
        })),
      };

      const res = await apiFetch<{ success: boolean; message: string }>('/faculty/attendance', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.success) {
        setSuccessMsg(
          res.message ||
            `Successfully saved attendance for ${studentList.length} students on ${selectedDate}.`
        );
        setIsAlreadyMarked(true);
        // Refresh roster
        loadAttendanceRoster();
      } else {
        setError('Failed to submit attendance records.');
      }
    } catch (err: any) {
      setError(err.message || 'Error saving attendance.');
    } finally {
      setSaving(false);
    }
  };

  // Derived statistics
  const presentCount = studentList.filter((item) => item.status === 'Present').length;
  const absentCount = studentList.filter((item) => item.status === 'Absent').length;
  const totalCount = studentList.length;
  const attendancePercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-2">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Biometric & Lecture Attendance</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Mark Subject Attendance</h1>
          <p className="text-xs text-slate-400 mt-1">
            Select subject, section, and date to record attendance. Attendance is saved to MongoDB and immediately updates Student Portals.
          </p>
        </div>

        {isAlreadyMarked && (
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 text-xs font-bold flex items-center gap-2 self-start md:self-auto">
            <CheckCircle2 className="w-4 h-4" />
            <span>Records Exist for this Date</span>
          </div>
        )}
      </div>

      {/* Control Selector Form Card */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Select Subject */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Select Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {assignedSubjects.map((sub) => (
                <option key={sub._id} value={sub.name}>
                  {sub.code} - {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Section */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Select Section / Class
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="CSE-A">CSE-A (Section 1)</option>
              <option value="CSE-B">CSE-B (Section 2)</option>
              <option value="ECE-A">ECE-A (Section 1)</option>
            </select>
          </div>

          {/* Select Date */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Attendance Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Success or Error Alert Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <span className="text-[10px] text-emerald-400 uppercase font-extrabold">MongoDB Updated</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Cards */}
      {studentList.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-xl font-extrabold text-white">{totalCount}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Total Students</div>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 text-center">
            <div className="text-xl font-extrabold text-emerald-400">{presentCount}</div>
            <div className="text-[10px] font-bold text-emerald-300/80 uppercase mt-0.5">Present Count</div>
          </div>
          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/40 text-center">
            <div className="text-xl font-extrabold text-rose-400">{absentCount}</div>
            <div className="text-[10px] font-bold text-rose-300/80 uppercase mt-0.5">Absent Count</div>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 text-center">
            <div className="text-xl font-extrabold text-indigo-400">{attendancePercentage}%</div>
            <div className="text-[10px] font-bold text-indigo-300/80 uppercase mt-0.5">Class Percentage</div>
          </div>
        </div>
      )}

      {/* Main Student Attendance Table */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-900 border border-slate-800 rounded-2xl" />
          ))}
        </div>
      ) : studentList.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Students Assigned</h3>
          <p className="text-xs text-slate-400">
            No students found for subject "{selectedSubject}" in section "{selectedSection}".
          </p>
        </div>
      ) : (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl space-y-4 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Roster for {selectedSubject}</span>
                <span className="text-xs text-slate-400 font-normal">({selectedDate})</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Toggle status for individual students or use quick actions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleMarkAll('Present')}
                className="px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900 transition-colors text-xs font-bold"
              >
                Mark All Present
              </button>
              <button
                type="button"
                onClick={() => handleMarkAll('Absent')}
                className="px-3 py-1.5 rounded-xl bg-rose-950/80 text-rose-300 border border-rose-800/60 hover:bg-rose-900 transition-colors text-xs font-bold"
              >
                Mark All Absent
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Section</th>
                  <th className="py-3 px-4 text-center">Status Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {studentList.map((student, idx) => {
                  const isPresent = student.status === 'Present';
                  return (
                    <tr key={student.studentUserId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 text-slate-500 font-bold">{idx + 1}</td>
                      <td className="py-3.5 px-4 font-bold text-white">{student.name}</td>
                      <td className="py-3.5 px-4 text-indigo-400 font-extrabold">{student.rollNumber}</td>
                      <td className="py-3.5 px-4 text-slate-400">{student.section || selectedSection}</td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                          <button
                            type="button"
                            onClick={() => handleStatusToggle(student.studentUserId, 'Present')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              isPresent
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Present</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusToggle(student.studentUserId, 'Absent')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              !isPresent
                                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Absent</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Submit Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Upsert rule prevents duplicate records for same student + subject + date.</span>
            </div>

            <button
              type="button"
              onClick={handleSaveAttendance}
              disabled={saving}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving to MongoDB...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save & Sync Attendance</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
