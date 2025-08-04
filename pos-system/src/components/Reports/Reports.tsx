import React from 'react';
import { User } from '../../types';

interface ReportsProps {
  user: User;
}

const Reports: React.FC<ReportsProps> = ({ user }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-600">View detailed sales reports and analytics</p>
        </div>
      </div>
      <div className="p-6">
        <div className="card p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Reports & Analytics</h3>
          <p className="text-gray-600">This feature is coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;