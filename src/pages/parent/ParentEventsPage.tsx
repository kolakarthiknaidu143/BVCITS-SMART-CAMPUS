import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { EventItem } from '../../types';

export const ParentEventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch<{ success: boolean; data: EventItem[] }>('/parent/events');
        if (res.success && res.data) {
          setEvents(res.data);
        } else {
          setError('Failed to retrieve college events.');
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching events.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center max-w-xl mx-auto my-12 shadow-2xl">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h2 className="text-base font-bold text-white mb-1">Events Unavailable</h2>
        <p className="text-xs text-slate-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
            <Calendar className="w-3.5 h-3.5" />
            <span>Campus Activities</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">College Events & Workshops</h1>
          <p className="text-xs text-slate-300 mt-1">
            Technical symposiums, cultural fests, hackathons, and parent-teacher interactive meetings
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Scheduled</span>
          <span className="text-xl font-extrabold text-emerald-400 mt-0.5">{events.length} Events</span>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.map((event) => (
            <div
              key={event._id}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/40">
                    {event.date}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {event.registrationStatus}
                  </span>
                </div>

                <h2 className="text-base font-bold text-white leading-tight">{event.title}</h2>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{event.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/60 space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Time: <strong className="text-slate-200">{event.time}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>Venue: <strong className="text-slate-200">{event.venue}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Organizer: {event.organizer}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-8 text-center text-xs text-slate-500 bg-slate-900/60 rounded-3xl border border-slate-800">
            No events scheduled at the moment.
          </div>
        )}
      </div>
    </div>
  );
};
