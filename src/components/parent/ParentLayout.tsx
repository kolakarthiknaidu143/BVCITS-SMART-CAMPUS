import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ParentSidebar } from './ParentSidebar';
import { ParentTopNav } from './ParentTopNav';

export const ParentLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans overflow-x-hidden">
      {/* Sidebar Navigation */}
      <ParentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Navbar */}
        <ParentTopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Dynamic Page Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
