import React, { useEffect, useState } from 'react';
import {
  UserCheck,
  Search,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  X,
  CheckCircle2,
  AlertTriangle,
  User,
  Filter,
  BookOpen,
} from 'lucide-react';
import { apiFetch } from '../../services/api';

export const AdminFacultyPage: React.FC = () => {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    employeeId: '',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    assignedSubjectsInput: 'Data Structures, Operating Systems',
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const fetchFaculty = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('search', searchQuery);
      if (departmentFilter !== 'All') queryParams.append('department', departmentFilter);

      const res = await apiFetch<any>(`/admin/faculty?${queryParams.toString()}`);
      if (res.success) {
        setFaculty(res.faculty || []);
      } else {
        setError(res.message || 'Failed to fetch faculty directory.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching faculty data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, [departmentFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFaculty();
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const assignedSubjects = formData.assignedSubjectsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      const res = await apiFetch<any>('/admin/faculty', {
        method: 'POST',
        body: JSON.stringify({ ...formData, assignedSubjects }),
      });

      if (res.success) {
        setFormSuccess('Faculty member added successfully!');
        setTimeout(() => {
          setIsAddModalOpen(false);
          setFormSuccess(null);
          fetchFaculty();
        }, 1200);
      } else {
        setFormError(res.message || 'Failed to create faculty member.');
      }
    } catch (err: any) {
      setFormError(err.message || 'Error submitting request.');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const assignedSubjects = formData.assignedSubjectsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      const res = await apiFetch<any>(`/admin/faculty/${formData.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...formData, assignedSubjects }),
      });

      if (res.success) {
        setFormSuccess('Faculty details updated successfully!');
        setTimeout(() => {
          setIsEditModalOpen(false);
          setFormSuccess(null);
          fetchFaculty();
        }, 1200);
      } else {
        setFormError(res.message || 'Failed to update faculty member.');
      }
    } catch (err: any) {
      setFormError(err.message || 'Error updating faculty member.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      const res = await apiFetch<any>(`/admin/faculty/${deleteTarget._id}`, {
        method: 'DELETE',
      });

      if (res.success) {
        setDeleteTarget(null);
        fetchFaculty();
      } else {
        alert(res.message || 'Failed to delete faculty member.');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting faculty record.');
    }
  };

  const openEditModal = (item: any) => {
    setFormData({
      id: item._id,
      name: item.name,
      email: item.email,
      password: '',
      phone: item.phone || '',
      employeeId: item.employeeId,
      department: item.department,
      designation: item.designation || 'Faculty',
      assignedSubjectsInput: (item.assignedSubjects || []).join(', '),
    });
    setFormError(null);
    setFormSuccess(null);
    setIsEditModalOpen(true);
  };

  const openAddModal = () => {
    setFormData({
      id: '',
      name: '',
      email: '',
      password: 'facultypassword',
      phone: '',
      employeeId: '',
      department: 'Computer Science & Engineering',
      designation: 'Associate Professor',
      assignedSubjectsInput: 'Data Structures, Operating Systems',
    });
    setFormError(null);
    setFormSuccess(null);
    setIsAddModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <UserCheck className="w-7 h-7 text-indigo-400" />
            <span>Faculty Management</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage teaching staff, designations, departments, and course assignments.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 inline-flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Faculty
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, EMP ID, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </form>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Dept:</span>
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science & Engineering">CSE</option>
            <option value="Electronics & Communication Engineering">ECE</option>
            <option value="Electrical & Electronics Engineering">EEE</option>
            <option value="Mechanical Engineering">ME</option>
            <option value="Civil Engineering">CE</option>
          </select>

          <button
            onClick={fetchFaculty}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Faculty Table */}
      {loading ? (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading faculty directory...
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400">
          {error}
        </div>
      ) : faculty.length === 0 ? (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <User className="w-10 h-10 mx-auto text-slate-600" />
          <p className="font-semibold text-slate-300">No faculty members found matching current filters.</p>
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Faculty Member</th>
                  <th className="px-6 py-4">Employee ID</th>
                  <th className="px-6 py-4">Department & Role</th>
                  <th className="px-6 py-4">Assigned Subjects</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {faculty.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">
                      <div>
                        <p>{item.name}</p>
                        <p className="text-xs text-slate-400 font-normal">{item.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-indigo-400">{item.employeeId}</td>
                    <td className="px-6 py-4 text-xs">
                      <p className="font-semibold text-slate-200">{item.department}</p>
                      <p className="text-slate-400">{item.designation}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {item.assignedSubjects && item.assignedSubjects.length > 0 ? (
                          item.assignedSubjects.map((sub: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-medium">
                              {sub}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-500 text-xs italic">Unassigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                        title="Edit Faculty"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Delete Faculty"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white">
              {isAddModalOpen ? 'Create Faculty Member' : 'Edit Faculty Details'}
            </h2>

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

            <form onSubmit={isAddModalOpen ? handleAddSubmit : handleEditSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    required
                    disabled={isEditModalOpen}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white disabled:opacity-50 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1">Employee ID</label>
                  <input
                    type="text"
                    required
                    disabled={isEditModalOpen}
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white disabled:opacity-50 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              {isAddModalOpen && (
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Computer Science & Engineering">CSE</option>
                    <option value="Electronics & Communication Engineering">ECE</option>
                    <option value="Electrical & Electronics Engineering">EEE</option>
                    <option value="Mechanical Engineering">ME</option>
                    <option value="Civil Engineering">CE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1">Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1">Assigned Subjects (comma-separated)</label>
                <input
                  type="text"
                  value={formData.assignedSubjectsInput}
                  onChange={(e) => setFormData({ ...formData, assignedSubjectsInput: e.target.value })}
                  placeholder="Data Structures, DBMS, AI"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-md shadow-indigo-500/20"
                >
                  {isAddModalOpen ? 'Save Faculty' : 'Update Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Delete Faculty Account</h3>
            <p className="text-sm text-slate-400">
              Are you sure you want to permanently delete faculty member <span className="font-semibold text-white">{deleteTarget.name}</span> ({deleteTarget.employeeId})? This action cannot be undone.
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
                Delete Faculty
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
