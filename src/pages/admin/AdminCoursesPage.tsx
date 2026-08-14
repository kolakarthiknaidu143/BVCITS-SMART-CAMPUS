import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  X,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { apiFetch } from '../../services/api';

export const AdminCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    code: '',
    credits: 3,
    department: 'Computer Science & Engineering',
    semester: 3,
    section: 'CSE-A',
    facultyUserId: '',
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const fetchCoursesAndFaculty = async () => {
    setLoading(true);
    setError(null);
    try {
      const [courseRes, facultyRes] = await Promise.all([
        apiFetch<any>('/admin/courses'),
        apiFetch<any>('/admin/faculty'),
      ]);

      if (courseRes.success) {
        setCourses(courseRes.courses || []);
      } else {
        setError(courseRes.message || 'Failed to fetch course catalog.');
      }

      if (facultyRes.success) {
        setFacultyList(facultyRes.faculty || []);
      }
    } catch (err: any) {
      setError(err.message || 'Error loading courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesAndFaculty();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    try {
      const res = await apiFetch<any>('/admin/courses', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (res.success) {
        setFormSuccess('Course created successfully!');
        setTimeout(() => {
          setIsAddModalOpen(false);
          setFormSuccess(null);
          fetchCoursesAndFaculty();
        }, 1200);
      } else {
        setFormError(res.message || 'Failed to create course.');
      }
    } catch (err: any) {
      setFormError(err.message || 'Error creating course.');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    try {
      const res = await apiFetch<any>(`/admin/courses/${formData.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
      });

      if (res.success) {
        setFormSuccess('Course updated successfully!');
        setTimeout(() => {
          setIsEditModalOpen(false);
          setFormSuccess(null);
          fetchCoursesAndFaculty();
        }, 1200);
      } else {
        setFormError(res.message || 'Failed to update course.');
      }
    } catch (err: any) {
      setFormError(err.message || 'Error updating course.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      const res = await apiFetch<any>(`/admin/courses/${deleteTarget._id}`, {
        method: 'DELETE',
      });

      if (res.success) {
        setDeleteTarget(null);
        fetchCoursesAndFaculty();
      } else {
        alert(res.message || 'Failed to delete course.');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting course.');
    }
  };

  const openEditModal = (item: any) => {
    setFormData({
      id: item._id,
      name: item.name,
      code: item.code,
      credits: item.credits || 3,
      department: item.department,
      semester: item.semester || 1,
      section: item.section || 'CSE-A',
      facultyUserId: item.facultyUserId?._id || item.facultyUserId || '',
    });
    setFormError(null);
    setFormSuccess(null);
    setIsEditModalOpen(true);
  };

  const openAddModal = () => {
    setFormData({
      id: '',
      name: '',
      code: '',
      credits: 3,
      department: 'Computer Science & Engineering',
      semester: 3,
      section: 'CSE-A',
      facultyUserId: '',
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
            <BookOpen className="w-7 h-7 text-amber-400" />
            <span>Institutional Courses & Subjects</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Configure academic courses, credit weightages, semesters, and faculty allocations.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-amber-500/20 inline-flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      {/* Course Table */}
      {loading ? (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading course catalog...
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400">
          {error}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400">
          No course records found.
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Course Name</th>
                  <th className="px-6 py-4">Course Code</th>
                  <th className="px-6 py-4">Department & Sem</th>
                  <th className="px-6 py-4">Credits</th>
                  <th className="px-6 py-4">Assigned Faculty</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">{course.name}</td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-amber-400">{course.code}</td>
                    <td className="px-6 py-4 text-xs">
                      <p className="font-semibold text-slate-200">{course.department}</p>
                      <p className="text-slate-400">Semester {course.semester} ({course.section || 'CSE-A'})</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-amber-300">{course.credits} Credits</td>
                    <td className="px-6 py-4 text-xs text-slate-300">
                      {course.facultyUserId?.name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(course)}
                        className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(course)}
                        className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
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
              {isAddModalOpen ? 'Add New Course' : 'Edit Course'}
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
                <label className="block text-slate-400 text-xs font-semibold mb-1">Course Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Data Structures & Algorithms"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="CS301"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
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
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1">Assigned Faculty Member</label>
                <select
                  value={formData.facultyUserId}
                  onChange={(e) => setFormData({ ...formData, facultyUserId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Unassigned --</option>
                  {facultyList.map((f) => (
                    <option key={f._id} value={f.userId}>
                      {f.name} ({f.employeeId} - {f.department})
                    </option>
                  ))}
                </select>
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
                  className="px-5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl font-semibold shadow-md shadow-amber-500/20"
                >
                  {isAddModalOpen ? 'Create Course' : 'Update Course'}
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
            <h3 className="text-lg font-bold text-white">Delete Course</h3>
            <p className="text-sm text-slate-400">
              Are you sure you want to delete <span className="font-semibold text-white">{deleteTarget.name}</span> ({deleteTarget.code})?
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
