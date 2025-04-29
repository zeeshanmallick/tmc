import React, { ReactNode } from 'react';

interface AdminDashboardLayoutProps {
  children: ReactNode;
}

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ children }) => {
  return (
    <div className="bg-gray-900 p-8 rounded-lg border border-gray-700">
      <h2 className="text-2xl font-semibold text-white mb-6">Admin Dashboard</h2>
      {/* Add admin-specific navigation or sidebar here if needed */}
      <div>
        {children}
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
