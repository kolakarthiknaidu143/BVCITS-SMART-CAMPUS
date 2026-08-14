import React, { useEffect, useState } from 'react';
import { FileText, RefreshCw, Building, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { apiFetch } from '../../services/api';

export const AdminApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<any>('/placement/applications');
      if (res.success) {
        setApplications(res.applications || []);
      } else {
        setError(res.message || 'Failed to fetch student placement applications.');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading application records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      const res = await apiFetch<any>(`/placement/applications/${appId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.success) {
        fetchApplications();
      } else {
        alert(res.message || 'Failed to update application status.');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating status.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-indigo-400" />
            <span>Placement Application Monitoring</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Review student applications, interview shortlists, and final job offer selections.</p>
        </div>
        <button
          onClick={fetchApplications}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Applications
        </button>
      </div>

      {/* Applications Table */}
      {loading ? (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading student placement applications...
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400">
          {error}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400">
          No job applications submitted by students yet.
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Applicant Student</th>
                  <th className="px-6 py-4">Placement Drive</th>
                  <th className="px-6 py-4">Job Role & Package</th>
                  <th className="px-6 py-4">Application Status</th>
                  <th className="px-6 py-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">
                      <p>{app.studentUserId?.name || 'Student'}</p>
                      <p className="text-xs text-slate-400 font-normal">{app.studentUserId?.email}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-400 flex items-center gap-2 mt-2">
                      <Building className="w-4 h-4 text-emerald-400" />
                      <span>{app.placementId?.companyName || 'Company'}</span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <p className="font-semibold text-slate-200">{app.placementId?.jobRole || 'Role'}</p>
                      <p className="text-emerald-400 font-bold">{app.placementId?.package}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          app.status === 'Selected'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : app.status === 'Rejected'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : app.status === 'Shortlisted' || app.status === 'Interview'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
