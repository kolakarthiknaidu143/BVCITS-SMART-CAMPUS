import React, { useEffect, useState } from 'react';
import { Calendar, Plus, Trash2, MapPin, Clock, X, CheckCircle2, AlertTriangle, Users } from 'lucide-react';
import { apiFetch } from '../../services/api';

export const AdminEventsPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    organizer: 'BVCITS Administration',
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<any>('/event');
      if (res.success) {
        setEvents(res.events || []);
      } else {
        setError(res.message || 'Failed to fetch campus events.');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    try {
      const res = await apiFetch<any>('/event', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (res.success) {
        setFormSuccess('Campus event scheduled successfully! Visible across student and faculty portals.');
        setTimeout(() => {
          setIsAddModalOpen(false);
          setFormSuccess(null);
          fetchEvents();
        }, 1200);
      } else {
        setFormError(res.message || 'Failed to create event.');
      }
    } catch (err: any) {
      setFormError(err.message || 'Error creating event.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      const res = await apiFetch<any>(`/event/${deleteTarget._id}`, {
        method: 'DELETE',
      });

      if (res.success) {
        setDeleteTarget(null);
        fetchEvents();
      } else {
        alert(res.message || 'Failed to delete event.');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting event.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-purple-400" />
            <span>Campus Events & Hackathons</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Schedule campus workshops, symposia, hackathons, and guest lectures.</p>
        </div>
        <button
          onClick={() => {
            setFormData({
              title: '',
              description: '',
              date: new Date().toISOString().split('T')[0],
              time: '10:00 AM',
              venue: 'Main Auditorium',
              organizer: 'BVCITS Administration',
            });
            setFormError(null);
            setFormSuccess(null);
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-purple-500/20 inline-flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Schedule Event
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading scheduled events...
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400">
          {error}
        </div>
      ) : events.length === 0 ? (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400">
          No campus events scheduled.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-semibold">
                    {event.date}
                  </span>
                  <button
                    onClick={() => setDeleteTarget(event)}
                    className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">{event.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-2">{event.description}</p>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-slate-800 text-xs text-slate-400">
                <p className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Time: <strong className="text-slate-200">{event.time}</strong></span>
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Venue: <strong className="text-slate-200">{event.venue}</strong></span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Organizer: <strong className="text-slate-200">{event.organizer}</strong></span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white">Schedule Campus Event</h2>

            {formError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {formSuccess}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Annual Hackathon 2026"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="10:00 AM - 4:00 PM"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1">Venue</label>
                  <input
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="Seminar Hall 1"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1">Organizer</label>
                  <input
                    type="text"
                    required
                    value={formData.organizer}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Details regarding event registration, prizes, eligibility..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-md shadow-purple-500/20"
                >
                  Save & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Delete Event</h3>
            <p className="text-sm text-slate-400">
              Are you sure you want to delete event <span className="font-semibold text-white">{deleteTarget.title}</span>?
            </p>
            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-red-500/20"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
