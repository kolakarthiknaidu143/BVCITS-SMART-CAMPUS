import React, { useState, useEffect } from 'react';
import { Briefcase, Building2, MapPin, DollarSign, Calendar, CheckCircle2, Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { JobApplication, PlacementDrive } from '../../types';

interface PlacementData {
  applications: JobApplication[];
  eligibleDrives: PlacementDrive[];
  student: {
    name: string;
    rollNumber: string;
    cgpa: number;
    department: string;
  };
}

export const ParentPlacementsPage: React.FC = () => {
  const [data, setData] = useState<PlacementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'applications' | 'drives'>('applications');

  useEffect(() => {
    const fetchPlacements = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch<{ success: boolean; data: PlacementData }>('/parent/placements');
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError('Failed to retrieve placement information.');
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching placement records.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlacements();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center max-w-xl mx-auto my-12 shadow-2xl">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h2 className="text-base font-bold text-white mb-1">Placements Unavailable</h2>
        <p className="text-xs text-slate-400 mb-4">{error || 'No placement data found for your ward.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
        >
          Retry
        </button>
      </div>
    );
  }

  const { applications, eligibleDrives, student } = data;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Selected':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800/50';
      case 'Interview':
        return 'bg-purple-950 text-purple-300 border-purple-800/50';
      case 'Shortlisted':
        return 'bg-blue-950 text-blue-300 border-blue-800/50';
      case 'Rejected':
        return 'bg-rose-950 text-rose-300 border-rose-800/50';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Training & Placement Cell</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Campus Placements & Drives</h1>
          <p className="text-xs text-slate-300 mt-1">
            Student: <strong className="text-white">{student.name}</strong> ({student.rollNumber}) • CGPA: <strong className="text-emerald-400">{student.cgpa.toFixed(2)}</strong>
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'applications'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            My Ward's Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('drives')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'drives'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Eligible Drives ({eligibleDrives.length})
          </button>
        </div>
      </div>

      {/* Applications Tab Content */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Submitted Job Applications
            </h2>
            <span className="text-xs text-slate-400">{applications.length} Total Submissions</span>
          </div>

          {applications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applications.map((app) => {
                const placement = typeof app.placementId === 'object' ? app.placementId : null;
                return (
                  <div
                    key={app._id}
                    className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3 hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white">
                            {placement?.companyName || 'Recruiting Partner'}
                          </h3>
                          <p className="text-xs text-slate-400">{placement?.jobRole || 'Graduate Role'}</p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800/60">
                      <div className="flex items-center space-x-1 text-slate-400">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Package: <strong className="text-slate-200">{placement?.package || 'Negotiable'}</strong></span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        <span>{placement?.location || 'Pan India'}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between">
                      <span>Applied Date: {new Date(app.appliedAt).toLocaleDateString()}</span>
                      {app.notes && <span className="text-slate-400 italic">"{app.notes}"</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/60 rounded-3xl border border-slate-800">
              Your ward has not submitted applications for current placement drives yet.
            </div>
          )}
        </div>
      )}

      {/* Eligible Drives Tab Content */}
      {activeTab === 'drives' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Eligible Campus Recruitment Drives
            </h2>
            <span className="text-xs text-slate-400">{eligibleDrives.length} Verified Drives</span>
          </div>

          {eligibleDrives.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eligibleDrives.map((drive) => (
                <div
                  key={drive._id}
                  className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">
                        Package: {drive.package}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Deadline: {drive.deadline}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-white">{drive.companyName}</h3>
                    <p className="text-xs font-semibold text-slate-300">{drive.jobRole}</p>
                    <p className="text-xs text-slate-400 line-clamp-2">{drive.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/60 text-xs text-slate-400 flex items-center justify-between">
                    <span>Min CGPA: <strong className="text-emerald-400">{drive.eligibilityCGPA}</strong></span>
                    <span className="text-slate-500">{drive.location}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/60 rounded-3xl border border-slate-800">
              No new placement drives matching the eligibility criteria at this time.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
