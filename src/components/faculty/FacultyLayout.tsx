import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { FacultySidebar } from './FacultySidebar';
import { FacultyTopNav } from './FacultyTopNav';
import { apiFetch } from '../../services/api';
import { FacultyProfile } from '../../types';

export const FacultyLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [facultyProfile, setFacultyProfile] = useState<FacultyProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiFetch<{ success: boolean; data: FacultyProfile }>('/faculty/profile');
        if (res.success && res.data) {
          setFacultyProfile(res.data);
        }
      } catch (err) {
        // Silent catch
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans overflow-x-hidden">
      {/* Sidebar Navigation */}
      <FacultySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Navbar */}
        <FacultyTopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} facultyProfile={facultyProfile} />

        {/* Dynamic Page Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
