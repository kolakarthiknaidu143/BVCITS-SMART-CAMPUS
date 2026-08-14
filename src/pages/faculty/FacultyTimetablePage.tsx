import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, MapPin, Building2, Users } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { TimetableSlot } from '../../types';

export const FacultyTimetablePage: React.FC = () => {
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiFetch<{ success: boolean; data: TimetableSlot[] }>('/faculty/timetable');
        if (res.success && res.data) {
          setTimetable(res.data);
        } else {
          setError('Failed to fetch faculty timetable.');
        }
      } catch (err: any) {
        setError(err.message || 'Error loading schedule.');
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  const daySlots = timetable.filter((slot) => slot.day === selectedDay);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-2">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Academic Lecture Schedule</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Faculty Class Schedule</h1>
          <p className="text-xs text-slate-400 mt-1">
            Weekly timetable breakdown showing rooms, sections, subject codes, and lecture timings.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-right shrink-0">
          <div className="text-xl font-extrabold text-indigo-400">{timetable.length} Slots</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase">Weekly Hours</div>
        </div>
      </div>

      {/* Day Tabs Navigation */}
      <div className="p-2 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2 overflow-x-auto custom-scrollbar">
        {daysOfWeek.map((day) => {
          const isActive = selectedDay === day;
          const count = timetable.filter((s) => s.day === day).length;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>{day}</span>
              {count > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Timetable Slots Display */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-900 border border-slate-800 rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-800/50 text-center text-xs text-rose-300">
          {error}
        </div>
      ) : daySlots.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <CalendarDays className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Lectures Scheduled for {selectedDay}</h3>
          <p className="text-xs text-slate-400">
            Enjoy your office hours or research duration. No regular classes scheduled for this day.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {daySlots.map((slot, index) => (
            <div
              key={slot._id || index}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4 group"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{slot.time}</span>
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40">
                  {slot.section || 'CSE-A'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white group-hover:text-indigo-400 transition-colors">
                  {slot.subject}
                </h3>
                <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{slot.department}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 font-semibold">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>Room: <strong className="text-white">{slot.room}</strong></span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Sec {slot.section}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
