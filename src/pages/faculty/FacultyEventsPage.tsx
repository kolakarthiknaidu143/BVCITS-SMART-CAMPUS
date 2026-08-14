import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, Building2, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { EventItem } from '../../types';

export const FacultyEventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiFetch<{ success: boolean; data: EventItem[] }>('/faculty/events');
        if (res.success && res.data) {
          setEvents(res.data);
        } else {
          setError('Failed to fetch campus events.');
        }
      } catch (err: any) {
        setError(err.message || 'Error loading events.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Campus Programs & Workshops</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Campus Events Calendar</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse hackathons, technical workshops, industry connect sessions, and academic conferences.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-right shrink-0">
          <div className="text-xl font-extrabold text-indigo-400">{events.length}</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase">Upcoming Events</div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-slate-900 border border-slate-800 rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-800/50 text-center text-xs text-rose-300">
          {error}
        </div>
      ) : events.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Upcoming Events</h3>
          <p className="text-xs text-slate-400">There are no upcoming campus events scheduled at this moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((evt) => (
            <div
              key={evt._id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                    {evt.registrationStatus || 'Open'}
                  </span>
                  <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {evt.date}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-white">{evt.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{evt.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-400 font-medium">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Time: <strong className="text-slate-200">{evt.time}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>Venue: <strong className="text-slate-200">{evt.venue}</strong></span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 pt-1">
                  Organizer: <span className="text-slate-300 font-bold">{evt.organizer}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
