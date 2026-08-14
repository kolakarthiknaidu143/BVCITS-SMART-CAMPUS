import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';
import {
  BookOpen,
  Plus,
  Calendar,
  Clock,
  MapPin,
  X,
  CheckCircle2,
  Users,
  Edit3,
  Award,
  Link as LinkIcon,
} from 'lucide-react';

export const TrainerTrainingsPage: React.FC = () => {
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Full Stack Web Development',
    duration: '6 Weeks (40 Hours)',
    startDate: '',
    venue: 'Computer Lab 3, CSE Block',
    maxSeats: 60,
    skills: 'React, TypeScript, Node.js, Express, MongoDB',
    eligibility: 'All CSE & ECE Students',
    description: '',
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const fetchTrainings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<any>('/trainer/trainings');
      if (res.success) {
        setTrainings(res.trainings || []);
      } else {
        setError('Failed to fetch training programs.');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading training programs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const skillsArray = formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        duration: formData.duration,
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        venue: formData.venue,
        maxSeats: Number(formData.maxSeats),
        skills: skillsArray,
        eligibility: formData.eligibility,
        description: formData.description,
      };

      let res;
      if (editingTraining) {
        res = await apiFetch<any>(`/trainer/trainings/${editingTraining._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        res = await apiFetch<any>('/trainings', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      if (res.success) {
        setFormSuccess(
          editingTraining
            ? 'Training program updated successfully!'
            : 'New training bootcamp created & published!'
        );
        setTimeout(() => {
          setIsAddModalOpen(false);
          setEditingTraining(null);
          setFormSuccess(null);
          fetchTrainings();
        }, 1200);
      } else {
        setFormError(res.message || 'Action failed.');
      }
    } catch (err: any) {
      setFormError(err.message || 'Error processing request.');
    }
  };

  const openAddModal = () => {
    setEditingTraining(null);
    setFormData({
      title: '',
      category: 'Full Stack Web Development',
      duration: '6 Weeks (40 Hours)',
      startDate: new Date().toISOString().split('T')[0],
      venue: 'Computer Lab 3, CSE Block',
      maxSeats: 60,
      skills: 'React, TypeScript, Node.js, Express, MongoDB',
      eligibility: 'All CSE & ECE 3rd & 4th Year Students',
      description: '',
    });
    setFormError(null);
    setFormSuccess(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (t: any) => {
    setEditingTraining(t);
    setFormData({
      title: t.title || '',
      category: t.category || 'Skill Bootcamp',
      duration: t.duration || '4 Weeks',
      startDate: t.startDate || '',
      venue: t.venue || 'Computer Lab',
      maxSeats: t.maxSeats || 60,
      skills: Array.isArray(t.skills) ? t.skills.join(', ') : '',
      eligibility: t.eligibility || 'All Students',
      description: t.description || '',
    });
    setFormError(null);
    setFormSuccess(null);
    setIsAddModalOpen(true);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-amber-400" />
            <span>Manage Campus Bootcamps</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Publish training bootcamps, manage modules, and syllabus resources for students.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 inline-flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Training Bootcamp
        </button>
      </div>

      {loading ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading bootcamp records...
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-950/60 border border-rose-800 rounded-2xl text-rose-300 text-xs">
          {error}
        </div>
      ) : trainings.length === 0 ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 text-xs">
          No training programs found in database.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainings.map((t) => (
            <div
              key={t._id}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl hover:border-amber-500/30 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold">
                    {t.category || 'Skill Workshop'}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{t.duration}</span>
                </div>

                <h3 className="text-lg font-bold text-white">{t.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-2">{t.description}</p>

                {t.skills && t.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {t.skills.map((s: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300 font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-800 text-xs text-slate-400">
                <p className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Starts: <strong className="text-slate-200">{t.startDate || 'TBD'}</strong></span>
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>Venue: <strong className="text-slate-200">{t.venue || 'Computer Lab'}</strong></span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Enrolled: <strong className="text-slate-200">{t.enrolledStudents?.length || 0} Students</strong></span>
                </p>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    onClick={() => openEditModal(t)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit Program</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white">
              {editingTraining ? 'Edit Training Program' : 'Publish Skill Training Bootcamp'}
            </h2>

            {formError && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Bootcamp Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Full Stack Cloud Architecture Bootcamp"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="6 Weeks (40 Hours)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Max Seats</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.maxSeats}
                    onChange={(e) => setFormData({ ...formData, maxSeats: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Venue</label>
                  <input
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Skills Covered (comma separated)</label>
                <input
                  type="text"
                  required
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="React, TypeScript, Node.js, Express, MongoDB"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Eligibility</label>
                <input
                  type="text"
                  required
                  value={formData.eligibility}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Description & Prerequisites</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-extrabold shadow-md shadow-amber-500/20"
                >
                  {editingTraining ? 'Update Program' : 'Publish Bootcamp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
