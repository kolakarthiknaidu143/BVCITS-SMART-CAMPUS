import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { Calendar, Clock, MapPin, UserCheck, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { EventItem } from '../../types';

export const StudentEventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ success: boolean; events: EventItem[] }>('/events');
      if (res.success && res.events) {
        setEvents(res.events);
      } else {
        setError('Failed to fetch campus events.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse font-sans">
        <div className="h-32 rounded-3xl bg-slate-900 border border-slate-800" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 rounded-3xl bg-slate-900 border border-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-2 border border-purple-500/30">
            <Calendar className="w-3.5 h-3.5" />
            <span>Campus Activities</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Upcoming Campus Events & Hackathons</h1>
          <p className="text-xs text-slate-300 mt-1">
            Technical symposiums, hackathons, industry workshops, and cultural fests
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Events Grid */}
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex items-start space-x-5 hover:border-purple-500/40 transition-all"
            >
              <div className="p-3.5 rounded-2xl bg-purple-950 text-purple-300 border border-purple-800/40 shrink-0 text-center min-w-[70px]">
                <div className="text-xs font-bold uppercase">{event.date.split('-')[1] || 'MAR'}</div>
                <div className="text-2xl font-black">{event.date.split('-')[2] || '12'}</div>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/40 uppercase">
                    {event.registrationStatus || 'Open'}
                  </span>
                  <span className="text-xs text-slate-500">{event.date}</span>
                </div>

                <h2 className="text-base font-bold text-white">{event.title}</h2>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{event.description}</p>

                <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-purple-400" /> {event.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" /> {event.venue}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-xs text-slate-500 bg-slate-900/60 rounded-3xl border border-slate-800">
          No upcoming campus events scheduled at this time.
        </div>
      )}
    </div>
  );
};
