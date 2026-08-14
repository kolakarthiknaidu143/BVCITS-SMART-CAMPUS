import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  GraduationCap,
  Save,
  Users,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { apiFetch } from '../../services/api';
import { CourseItem } from '../../types';

interface StudentMarkItem {
  studentUserId: string;
  name: string;
  rollNumber: string;
  department: string;
  semester: number;
  section: string;
  marksObtained: number | string;
  maxMarks: number;
  isEntered?: boolean;
}

interface MarksResponseData {
  subject: string;
  examType: string;
  section: string;
  maxMarks: number;
  students: StudentMarkItem[];
}

export const FacultyMarksPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSubjectParam = searchParams.get('subject') || '';

  const [assignedSubjects, setAssignedSubjects] = useState<CourseItem[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubjectParam);
  const [selectedExamType, setSelectedExamType] = useState<string>('Mid1');
  const [selectedSection, setSelectedSection] = useState<string>('CSE-A');
  const [maxMarksAllowed, setMaxMarksAllowed] = useState<number>(30);

  const [studentList, setStudentList] = useState<StudentMarkItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch faculty assigned subjects list
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

  // Set default max marks depending on exam type
  useEffect(() => {
    if (selectedExamType === 'Mid1' || selectedExamType === 'Mid2') {
      setMaxMarksAllowed(30);
    } else if (selectedExamType === 'Internal') {
      setMaxMarksAllowed(40);
    } else {
      setMaxMarksAllowed(100);
    }
  }, [selectedExamType]);

  // Load student marks list
  const loadMarksRoster = async () => {
    if (!selectedSubject || !selectedExamType) return;

    try {
      setLoading(true);
      setError(null);
      setSuccessMsg(null);

      const queryUrl = `/faculty/marks?subject=${encodeURIComponent(
        selectedSubject
      )}&examType=${encodeURIComponent(selectedExamType)}&section=${encodeURIComponent(
        selectedSection
      )}`;

      const res = await apiFetch<{ success: boolean; data: MarksResponseData }>(queryUrl);

      if (res.success && res.data) {
        setStudentList(res.data.students);
        if (res.data.maxMarks) {
          setMaxMarksAllowed(res.data.maxMarks);
        }
      } else {
        setError('Failed to fetch student marks roster.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching marks records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSubject) {
      loadMarksRoster();
    }
  }, [selectedSubject, selectedExamType, selectedSection]);

  // Handle individual marks update
  const handleMarkChange = (studentUserId: string, value: string) => {
    setStudentList((prev) =>
      prev.map((item) => {
        if (item.studentUserId === studentUserId) {
          return { ...item, marksObtained: value };
        }
        return item;
      })
    );
  };

  // Save marks submission
  const handleSaveMarks = async () => {
    if (!selectedSubject || !selectedExamType || studentList.length === 0) return;

    // Client side validation check
    for (const student of studentList) {
      const val = Number(student.marksObtained);
      if (isNaN(val) || val < 0 || val > maxMarksAllowed) {
        setError(
          `Validation Error: ${student.name}'s marks (${student.marksObtained}) must be a valid number between 0 and ${maxMarksAllowed}.`
        );
        return;
      }
    }

    try {
      setSaving(true);
      setError(null);
      setSuccessMsg(null);

      const payload = {
        subject: selectedSubject,
        examType: selectedExamType,
        maxMarks: maxMarksAllowed,
        marksList: studentList.map((item) => ({
          studentUserId: item.studentUserId,
          marksObtained: Number(item.marksObtained),
        })),
      };

      const res = await apiFetch<{ success: boolean; message: string }>('/faculty/marks', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.success) {
        setSuccessMsg(
          res.message ||
            `Successfully updated ${selectedExamType} marks for ${selectedSubject} in MongoDB.`
        );
        loadMarksRoster();
      } else {
        setError('Failed to submit marks.');
      }
    } catch (err: any) {
      setError(err.message || 'Error saving marks.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Performance Logging</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Enter Exam Marks</h1>
          <p className="text-xs text-slate-400 mt-1">
            Input internal, mid-semester, or semester examination scores. Saved marks immediately update student report cards.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-right shrink-0">
          <div className="text-xl font-extrabold text-purple-400">{maxMarksAllowed} Marks</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase">Max Allowed Score</div>
        </div>
      </div>

      {/* Selector Controls */}
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {assignedSubjects.map((sub) => (
                <option key={sub._id} value={sub.name}>
                  {sub.code} - {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Exam Type */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Select Exam Type
            </label>
            <select
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Mid1">Mid-1 Examination (Max 30)</option>
              <option value="Mid2">Mid-2 Examination (Max 30)</option>
              <option value="Internal">Internal Assessment (Max 40)</option>
              <option value="Semester">End Semester Exam (Max 100)</option>
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="CSE-A">CSE-A (Section 1)</option>
              <option value="CSE-B">CSE-B (Section 2)</option>
              <option value="ECE-A">ECE-A (Section 1)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
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

      {/* Main Marks Table */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-900 border border-slate-800 rounded-2xl" />
          ))}
        </div>
      ) : studentList.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Students Found</h3>
          <p className="text-xs text-slate-400">
            No students found for subject "{selectedSubject}" in section "{selectedSection}".
          </p>
        </div>
      ) : (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl space-y-4 p-4 sm:p-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white">
                {selectedSubject} — {selectedExamType} Marks
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Maximum marks allowed: <strong className="text-purple-400">{maxMarksAllowed}</strong>
              </p>
            </div>
            <div className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-extrabold text-slate-300">
              {studentList.length} Students
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Max Score</th>
                  <th className="py-3 px-4 text-center">Marks Obtained</th>
                  <th className="py-3 px-4 text-right">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {studentList.map((student, idx) => {
                  const currentScore = Number(student.marksObtained) || 0;
                  const isInvalid = currentScore > maxMarksAllowed || currentScore < 0;
                  const scorePercentage =
                    maxMarksAllowed > 0 ? Math.round((currentScore / maxMarksAllowed) * 100) : 0;

                  return (
                    <tr key={student.studentUserId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 text-slate-500 font-bold">{idx + 1}</td>
                      <td className="py-3.5 px-4 font-bold text-white">{student.name}</td>
                      <td className="py-3.5 px-4 text-indigo-400 font-extrabold">{student.rollNumber}</td>
                      <td className="py-3.5 px-4 text-slate-400">/ {maxMarksAllowed}</td>
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="number"
                          min="0"
                          max={maxMarksAllowed}
                          value={student.marksObtained}
                          onChange={(e) => handleMarkChange(student.studentUserId, e.target.value)}
                          className={`w-24 px-3 py-1.5 rounded-xl bg-slate-950 border text-center font-extrabold text-xs focus:outline-none focus:ring-2 ${
                            isInvalid
                              ? 'border-rose-500 text-rose-400 focus:ring-rose-500'
                              : 'border-slate-800 text-white focus:ring-purple-500'
                          }`}
                        />
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold">
                        <span
                          className={
                            scorePercentage >= 75
                              ? 'text-emerald-400'
                              : scorePercentage >= 50
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }
                        >
                          {scorePercentage}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Marks are stored securely in MongoDB and reflect live in Student Portal.</span>
            </div>

            <button
              type="button"
              onClick={handleSaveMarks}
              disabled={saving}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-purple-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting Marks...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Exam Marks</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
