import React, { useEffect, useState } from 'react';
import {
  GraduationCap,
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
} from 'lucide-react';
import { apiFetch } from '../../services/api';

export const AdminStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');

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
    rollNumber: '',
    department: 'Computer Science & Engineering',
    semester: 1,
    section: 'CSE-A',
    cgpa: 8.5,
    attendancePercentage: 90,
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('search', searchQuery);
      if (departmentFilter !== 'All') queryParams.append('department', departmentFilter);
      if (semesterFilter !== 'All') queryParams.append('semester', semesterFilter);

      const res = await apiFetch<any>(`/admin/students?${queryParams.toString()}`);
      if (res.success) {
        setStudents(res.students || []);
      } else {
        setError(res.message || 'Failed to fetch student directory.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching student data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [departmentFilter, semesterFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    try {
      const res = await apiFetch<any>('/admin/students', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (res.success) {
        setFormSuccess('Student created successfully!');
        setTimeout(() => {
          setIsAddModalOpen(false);
          setFormSuccess(null);
          fetchStudents();
        }, 1200);
      } else {
        setFormError(res.message || 'Failed to create student.');
      }
    } catch (err: any) {
      setFormError(err.message || 'Error submitting request.');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    try {
      const res = await apiFetch<any>(`/admin/students/${formData.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
      });

      if (res.success) {
        setFormSuccess('Student details updated successfully!');
        setTimeout(() => {
          setIsEditModalOpen(false);
          setFormSuccess(null);
          fetchStudents();
        }, 1200);
      } else {
        setFormError(res.message || 'Failed to update student details.');
      }
    } catch (err: any) {
      setFormError(err.message || 'Error updating student record.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      const res = await apiFetch<any>(`/admin/students/${deleteTarget._id}`, {
        method: 'DELETE',
      });

      if (res.success) {
        setDeleteTarget(null);
        fetchStudents();
      } else {
        alert(res.message || 'Failed to delete student.');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting student.');
    }
  };

  const openEditModal = (student: any) => {
    setFormData({
      id: student._id,
      name: student.name,
      email: student.email,
      password: '',
      phone: student.phone || '',
      rollNumber: student.rollNumber,
      department: student.department,
      semester: student.semester || 1,
      section: student.section || 'CSE-A',
      cgpa: student.cgpa || 0.0,
      attendancePercentage: student.attendancePercentage || 0,
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
      password: 'studentpassword',
      phone: '',
      rollNumber: '',
      department: 'Computer Science & Engineering',
      semester: 1,
      section: 'CSE-A',
      cgpa: 8.5,
      attendancePercentage: 90,
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
            <GraduationCap className="w-7 h-7 text-blue-400" />
            <span>Student Management</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage student profiles, enrollments, and academic standing.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 inline-flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Student
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, roll no, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Dept:</span>
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science & Engineering">CSE</option>
            <option value="Electronics & Communication Engineering">ECE</option>
            <option value="Electrical & Electronics Engineering">EEE</option>
            <option value="Mechanical Engineering">ME</option>
            <option value="Civil Engineering">CE</option>
          </select>

          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>

          <button
            onClick={fetchStudents}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Student Table */}
      {loading ? (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading student roster...
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400">
          {error}
        </div>
      ) : students.length === 0 ? (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <User className="w-10 h-10 mx-auto text-slate-600" />
          <p className="font-semibold text-slate-300">No students found matching current filters.</p>
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Roll Number</th>
                  <th className="px-6 py-4">Department & Sem</th>
                  <th className="px-6 py-4">CGPA</th>
                  <th className="px-6 py-4">Attendance</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">
                      <div>
                        <p>{student.name}</p>
                        <p className="text-xs text-slate-400 font-normal">{student.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-blue-400">{student.rollNumber}</td>
                    <td className="px-6 py-4 text-xs">
                      <p className="font-semibold text-slate-200">{student.department}</p>
                      <p className="text-slate-400">Sem {student.semester} • {student.section}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-400">{student.cgpa.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          student.attendancePercentage >= 75
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {student.attendancePercentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(student)}
                        className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                        title="Edit Student"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(student)}
                        className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Delete Student"
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
              {isAddModalOpen ? 'Create New Student Account' : 'Edit Student Details'}
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
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
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
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white disabled:opacity-50 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1">Roll Number</label>
                  <input
                    type="text"
                    required
                    disabled={isEditModalOpen}
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white disabled:opacity-50 focus:outline-none focus:border-blue-500 font-mono"
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
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Computer Science & Engineering">CSE</option>
                    <option value="Electronics & Communication Engineering">ECE</option>
                    <option value="Electrical & Electronics Engineering">EEE</option>
                    <option value="Mechanical Engineering">ME</option>
                    <option value="Civil Engineering">CE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1">Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1">CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1">Attendance %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.attendancePercentage}
                    onChange={(e) => setFormData({ ...formData, attendancePercentage: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
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
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-md shadow-blue-500/20"
                >
                  {isAddModalOpen ? 'Save Student' : 'Update Student'}
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
            <h3 className="text-lg font-bold text-white">Delete Student Account</h3>
            <p className="text-sm text-slate-400">
              Are you sure you want to permanently delete student <span className="font-semibold text-white">{deleteTarget.name}</span> ({deleteTarget.rollNumber})? This action cannot be undone.
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
                Delete Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
