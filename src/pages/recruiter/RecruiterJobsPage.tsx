import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { PlacementDrive } from '../../types';
import {
  Briefcase,
  Plus,
  MapPin,
  Clock,
  Building2,
  Trash2,
  Edit2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  FileText,
} from 'lucide-react';

export const RecruiterJobsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [placements, setPlacements] = useState<PlacementDrive[]>([]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [companyName, setCompanyName] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [packageAmount, setPackageAmount] = useState('');
  const [location, setLocation] = useState('');
  const [eligibilityCGPA, setEligibilityCGPA] = useState('6.5');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [requirementsText, setRequirementsText] = useState('');
  const [selectedDepts, setSelectedDepts] = useState<string[]>([
    'Computer Science & Engineering',
    'Electronics & Communication',
  ]);

  const allDepartments = [
    'Computer Science & Engineering',
    'Electronics & Communication',
    'Electrical & Electronics',
    'Mechanical Engineering',
    'Civil Engineering',
  ];

  const fetchPlacements = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<any>('/recruiter/placements');
      if (res.success) {
        setPlacements(res.placements || []);
      } else {
        setError(res.message || 'Unable to fetch placement drives.');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to fetch placement drives.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setCompanyName('');
    setJobRole('');
    setPackageAmount('');
    setLocation('');
    setEligibilityCGPA('6.5');
    setDeadline('');
    setDescription('');
    setRequirementsText('');
    setSelectedDepts(['Computer Science & Engineering', 'Electronics & Communication']);
    setShowModal(true);
  };

  const openEditModal = (drive: PlacementDrive) => {
    setEditingId(drive._id);
    setCompanyName(drive.companyName);
    setJobRole(drive.jobRole);
    setPackageAmount(drive.package);
    setLocation(drive.location);
    setEligibilityCGPA(String(drive.eligibilityCGPA || 6.0));
    setDeadline(drive.deadline);
    setDescription(drive.description);
    setRequirementsText((drive.requirements || []).join('\n'));
    setSelectedDepts(drive.departmentEligibility || []);
    setShowModal(true);
  };

  const toggleDept = (dept: string) => {
    if (selectedDepts.includes(dept)) {
      setSelectedDepts(selectedDepts.filter((d) => d !== dept));
    } else {
      setSelectedDepts([...selectedDepts, dept]);
    }
  };

  const handleSaveDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const reqArray = requirementsText
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const payload = {
      companyName,
      jobRole,
      package: packageAmount,
      location,
      eligibilityCGPA: parseFloat(eligibilityCGPA) || 6.0,
      departmentEligibility: selectedDepts,
      deadline,
      description,
      requirements: reqArray,
    };

    try {
      if (editingId) {
        const res = await apiFetch<any>(`/recruiter/placements/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        if (res.success) {
          setSuccess('Placement drive updated successfully.');
          setShowModal(false);
          fetchPlacements();
        } else {
          setError(res.message || 'Failed to update placement drive.');
        }
      } else {
        const res = await apiFetch<any>('/recruiter/placements', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        if (res.success) {
          setSuccess('New placement drive posted successfully to MongoDB Atlas.');
          setShowModal(false);
          fetchPlacements();
        } else {
          setError(res.message || 'Failed to post placement drive.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error saving placement drive.');
    } finally {
      setSaving(false);
    }
  };

  const handleCloseDrive = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to close and remove the placement drive for "${name}"?`)) {
      return;
    }

    try {
      const res = await apiFetch<any>(`/recruiter/placements/${id}`, { method: 'DELETE' });
      if (res.success) {
        setSuccess(`Placement drive for ${name} closed.`);
        fetchPlacements();
      } else {
        setError(res.message || 'Failed to close placement drive.');
      }
    } catch (err: any) {
      setError(err.message || 'Error closing placement drive.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading Job Postings from MongoDB Atlas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-cyan-400" />
            Job Postings & Placement Drives
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, manage, and monitor company placement drives for BVCITS students
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Job Drive</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Placements Cards Grid */}
      {placements.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto my-8">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No active job postings.</h3>
          <p className="text-xs text-slate-400">
            You have not created any placement drives yet. Click below to create your first drive.
          </p>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Post First Job Drive</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {placements.map((drive) => (
            <div
              key={drive._id}
              className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-300 flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{drive.companyName}</h3>
                      <p className="text-xs text-cyan-300 font-semibold">{drive.jobRole}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    {drive.package}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                  <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    {drive.location}
                  </span>
                  <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg">
                    <span>Min CGPA:</span>
                    <strong className="text-white">{drive.eligibilityCGPA}</strong>
                  </span>
                  <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Deadline: {drive.deadline}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {drive.description}
                </p>

                {drive.requirements && drive.requirements.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/60">
                    <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Key Requirements:</p>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      {drive.requirements.map((req, idx) => (
                        <li key={idx} className="truncate">{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end space-x-2">
                <button
                  onClick={() => openEditModal(drive)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleCloseDrive(drive._id, drive.companyName)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Close Drive</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post/Edit Drive Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'Update Placement Drive' : 'Post New Placement Drive'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter details for student visibility and eligibility matching
              </p>
            </div>

            <form onSubmit={handleSaveDrive} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="TechCorp Solutions"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Job Role</label>
                  <input
                    type="text"
                    required
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    placeholder="Software Engineer - I"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Package (LPA / CTC)</label>
                  <input
                    type="text"
                    required
                    value={packageAmount}
                    onChange={(e) => setPackageAmount(e.target.value)}
                    placeholder="12.5 LPA"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Hyderabad / Remote"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Minimum Eligibility CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    value={eligibilityCGPA}
                    onChange={(e) => setEligibilityCGPA(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Application Deadline</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Department Eligibility Checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Eligible Departments</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allDepartments.map((dept) => (
                    <label key={dept} className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDepts.includes(dept)}
                        onChange={() => toggleDept(dept)}
                        className="rounded bg-slate-950 border-slate-800 text-cyan-600 focus:ring-cyan-500"
                      />
                      <span>{dept}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Job Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide role summary, responsibilities, and company expectations..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Requirements (One per line)</label>
                <textarea
                  rows={3}
                  value={requirementsText}
                  onChange={(e) => setRequirementsText(e.target.value)}
                  placeholder="B.Tech 2026 passing batch&#10;No active backlogs&#10;Proficient in Data Structures & React"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center space-x-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingId ? 'Update Drive' : 'Publish Job Drive'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
