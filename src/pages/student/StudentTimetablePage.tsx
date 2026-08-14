import React, { useState } from 'react';
import { CalendarDays, Clock, MapPin, UserCheck, BookOpen } from 'lucide-react';

interface TimetableSlot {
  time: string;
  subject: string;
  faculty: string;
  room: string;
  type: 'Lecture' | 'Lab' | 'Seminar';
}

type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export const StudentTimetablePage: React.FC = () => {
  const [activeDay, setActiveDay] = useState<DayOfWeek>('Monday');

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Default weekly timetable structure for CSE 6th Semester
  const schedule: Record<DayOfWeek, TimetableSlot[]> = {
    Monday: [
      { time: '09:00 AM - 10:00 AM', subject: 'Data Structures & Algorithms', faculty: 'Dr. Srinivas Rao', room: 'CSE-301', type: 'Lecture' },
      { time: '10:00 AM - 11:00 AM', subject: 'Full-Stack Web Development', faculty: 'Prof. K. Ramana', room: 'CSE-302', type: 'Lecture' },
      { time: '11:15 AM - 01:15 PM', subject: 'Full-Stack Web Dev Lab', faculty: 'Dr. Srinivas Rao', room: 'Lab 4', type: 'Lab' },
      { time: '02:00 PM - 03:00 PM', subject: 'Artificial Intelligence & ML', faculty: 'Dr. P. Satish', room: 'CSE-301', type: 'Lecture' },
      { time: '03:00 PM - 04:00 PM', subject: 'Database Management Systems', faculty: 'Prof. M. Lakshmi', room: 'CSE-301', type: 'Lecture' },
    ],
    Tuesday: [
      { time: '09:00 AM - 10:00 AM', subject: 'Database Management Systems', faculty: 'Prof. M. Lakshmi', room: 'CSE-301', type: 'Lecture' },
      { time: '10:00 AM - 11:00 AM', subject: 'Artificial Intelligence & ML', faculty: 'Dr. P. Satish', room: 'CSE-301', type: 'Lecture' },
      { time: '11:15 AM - 12:15 PM', subject: 'Data Structures & Algorithms', faculty: 'Dr. Srinivas Rao', room: 'CSE-301', type: 'Lecture' },
      { time: '02:00 PM - 04:00 PM', subject: 'AI & ML Hands-on Lab', faculty: 'Dr. P. Satish', room: 'Lab 2', type: 'Lab' },
    ],
    Wednesday: [
      { time: '09:00 AM - 10:00 AM', subject: 'Full-Stack Web Development', faculty: 'Prof. K. Ramana', room: 'CSE-302', type: 'Lecture' },
      { time: '10:00 AM - 11:00 AM', subject: 'Data Structures & Algorithms', faculty: 'Dr. Srinivas Rao', room: 'CSE-301', type: 'Lecture' },
      { time: '11:15 AM - 01:15 PM', subject: 'DBMS SQL Lab', faculty: 'Prof. M. Lakshmi', room: 'Lab 1', type: 'Lab' },
      { time: '02:00 PM - 04:00 PM', subject: 'Competitive Coding Seminar', faculty: 'Vikramaditya Varma', room: 'Auditorium', type: 'Seminar' },
    ],
    Thursday: [
      { time: '09:00 AM - 10:00 AM', subject: 'Artificial Intelligence & ML', faculty: 'Dr. P. Satish', room: 'CSE-301', type: 'Lecture' },
      { time: '10:00 AM - 11:00 AM', subject: 'Database Management Systems', faculty: 'Prof. M. Lakshmi', room: 'CSE-301', type: 'Lecture' },
      { time: '11:15 AM - 12:15 PM', subject: 'Full-Stack Web Development', faculty: 'Prof. K. Ramana', room: 'CSE-302', type: 'Lecture' },
      { time: '02:00 PM - 04:00 PM', subject: 'Placement Aptitude & Soft Skills', faculty: 'Training Cell', room: 'Seminar Hall B', type: 'Seminar' },
    ],
    Friday: [
      { time: '09:00 AM - 11:00 AM', subject: 'Data Structures Lab', faculty: 'Dr. Srinivas Rao', room: 'Lab 3', type: 'Lab' },
      { time: '11:15 AM - 12:15 PM', subject: 'Artificial Intelligence & ML', faculty: 'Dr. P. Satish', room: 'CSE-301', type: 'Lecture' },
      { time: '02:00 PM - 03:00 PM', subject: 'Full-Stack Web Development', faculty: 'Prof. K. Ramana', room: 'CSE-302', type: 'Lecture' },
      { time: '03:00 PM - 04:00 PM', subject: 'Library / Self-Study Hour', faculty: 'Department HOD', room: 'Central Library', type: 'Lecture' },
    ],
    Saturday: [
      { time: '09:00 AM - 11:00 AM', subject: 'Industry Guest Lecture / Workshop', faculty: 'Guest Speaker', room: 'Auditorium Block A', type: 'Seminar' },
      { time: '11:15 AM - 01:00 PM', subject: 'Major Project Mentorship', faculty: 'Faculty Mentors', room: 'CSE Labs', type: 'Lab' },
    ],
  };

  const currentSlots = schedule[activeDay] || [];

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-500/30">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Class Schedule</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Weekly Academic Timetable</h1>
          <p className="text-xs text-slate-300 mt-1">
            Computer Science & Engineering • Semester 6 Schedule
          </p>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 custom-scrollbar">
        {days.map((day) => {
          const isActive = day === activeDay;
          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Slots List */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white">{activeDay} Class Schedule</h2>
          <span className="text-xs text-slate-400">{currentSlots.length} Sessions Scheduled</span>
        </div>

        {currentSlots.length > 0 ? (
          <div className="space-y-3">
            {currentSlots.map((slot, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-500/40 transition-all"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800/40 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-slate-400">{slot.time}</span>
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
                          slot.type === 'Lab'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800/40'
                            : slot.type === 'Seminar'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/40'
                            : 'bg-blue-950 text-blue-300 border border-blue-800/40'
                        }`}
                      >
                        {slot.type}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1">{slot.subject}</h3>
                    <div className="flex items-center space-x-4 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> {slot.faculty}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {slot.room}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl">
            No classes scheduled for {activeDay}.
          </div>
        )}
      </div>
    </div>
  );
};
