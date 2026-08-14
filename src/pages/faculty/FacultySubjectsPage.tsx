import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, CalendarCheck, GraduationCap, Building2, ArrowRight } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { CourseItem } from '../../types';

export const FacultySubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiFetch<{ success: boolean; data: CourseItem[] }>('/faculty/subjects');
        if (res.success && res.data) {
          setSubjects(res.data);
        } else {
          setError('Failed to load assigned subjects.');
        }
      } catch (err: any) {
        setError(err.message || 'Error connecting to database.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-slate-900 border border-slate-800 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-slate-900 border border-slate-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Assigned Curriculum</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">My Teaching Subjects</h1>
          <p className="text-xs text-slate-400 mt-1">
            Overview of course subjects, codes, enrolled student counts, and class actions.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-right shrink-0">
          <div className="text-xl font-extrabold text-indigo-400">{subjects.length}</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase">Assigned Subjects</div>
        </div>
      </div>

      {error ? (
        <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-800/50 text-center text-xs text-rose-300">
          {error}
        </div>
      ) : subjects.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Assigned Subjects Found</h3>
          <p className="text-xs text-slate-400">No course subjects are assigned to your faculty profile in MongoDB.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject._id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                    {subject.code}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Semester {subject.semester}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-white group-hover:text-indigo-400 transition-colors">
                    {subject.name}
                  </h3>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{subject.department}</span>
                  </div>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center text-xs">
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Section</div>
                    <div className="font-bold text-white mt-0.5">{subject.section || 'CSE-A'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Credits</div>
                    <div className="font-bold text-white mt-0.5">{subject.credits}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Students</div>
                    <div className="font-bold text-indigo-400 mt-0.5">{subject.studentCount || 45}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to={`/faculty/attendance?subject=${encodeURIComponent(subject.name)}`}
                    className="px-3 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>Attendance</span>
                  </Link>

                  <Link
                    to={`/faculty/marks?subject=${encodeURIComponent(subject.name)}`}
                    className="px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Marks</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
