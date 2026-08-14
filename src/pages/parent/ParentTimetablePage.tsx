import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, MapPin, User, AlertTriangle } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { TimetableSlot } from '../../types';

interface TimetableData {
  department: string;
  semester: number;
  records: TimetableSlot[];
  student: {
    name: string;
    rollNumber: string;
  };
}

export const ParentTimetablePage: React.FC = () => {
  const [data, setData] = useState<TimetableData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    const fetchTimetable = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch<{ success: boolean; data: TimetableData }>('/parent/timetable');
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError('Failed to retrieve class timetable.');
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching timetable records.');
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
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
        <h2 className="text-base font-bold text-white mb-1">Timetable Unavailable</h2>
        <p className="text-xs text-slate-400 mb-4">{error || 'No timetable schedule published for this department.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
        >
          Retry
        </button>
      </div>
    );
  }

  const { department, semester, records, student } = data;
  const currentDaySlots = records.filter(
    (r) => r.day.toLowerCase() === selectedDay.toLowerCase()
  );

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Class Timetable Schedule</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Weekly Academic Schedule</h1>
          <p className="text-xs text-slate-300 mt-1">
            Student: <strong className="text-white">{student.name}</strong> ({student.rollNumber}) • {department} • Semester {semester}
          </p>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="flex flex-wrap gap-2">
        {daysOfWeek.map((day) => {
          const isSelected = selectedDay === day;
          const dayCount = records.filter((r) => r.day.toLowerCase() === day.toLowerCase()).length;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <span>{day}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {dayCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Timetable Schedule Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            {selectedDay} Lecture Schedule
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            {currentDaySlots.length} Scheduled Sessions
          </span>
        </div>

        {currentDaySlots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentDaySlots.map((slot, idx) => (
              <div
                key={slot._id || idx}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-bold">
                    <Clock className="w-4 h-4" />
                    <span>{slot.time}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Section {slot.section || 'A'}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">{slot.subject}</h3>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>Room: <strong className="text-slate-200">{slot.room}</strong></span>
                  </div>
                  {slot.facultyUserId && (
                    <div className="flex items-center space-x-1 text-slate-400 truncate max-w-[120px]">
                      <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">
                        {typeof slot.facultyUserId === 'object' ? slot.facultyUserId.name : 'Faculty'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/60 rounded-3xl border border-slate-800">
            No lectures or lab sessions scheduled on {selectedDay}.
          </div>
        )}
      </div>
    </div>
  );
};
