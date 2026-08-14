import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { EventItem } from '../../types';
import { Award, Calendar, MapPin, Clock, RefreshCw, AlertCircle, Building2 } from 'lucide-react';

export const RecruiterEventsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<any>('/recruiter/events');
      if (res.success) {
        setEvents(res.events || []);
      } else {
        setError(res.message || 'Unable to fetch campus events.');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to fetch campus events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading Campus Events from MongoDB Atlas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-cyan-400" />
            Campus & Recruitment Events
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            BVCITS annual placement drives, hackathons, and corporate workshops
          </p>
        </div>
        <button
          onClick={fetchEvents}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto my-8 space-y-3">
          <Award className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No campus events scheduled.</h3>
          <p className="text-xs text-slate-400">
            No upcoming campus events or placement workshops found in MongoDB Atlas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((evt) => (
            <div
              key={evt._id}
              className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-white text-base leading-snug">{evt.title}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border shrink-0 ${
                      evt.registrationStatus === 'Open'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {evt.registrationStatus}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{evt.description}</p>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{evt.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{evt.venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="truncate">{evt.organizer}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
