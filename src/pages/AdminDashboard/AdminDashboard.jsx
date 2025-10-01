import React from 'react';
import { FaUser, FaClipboardList, FaDonate } from 'react-icons/fa';

const AdminDashboard = () => {
  // ✅ Dummy data (can be replaced with API later)
  const stats = [
    { id: 1, title: 'Total Users', value: 124, icon: <FaUser className="text-3xl text-green-700" /> },
    { id: 2, title: 'Active Requests', value: 37, icon: <FaClipboardList className="text-3xl text-blue-700" /> },
    { id: 3, title: 'Donations Received', value: 56, icon: <FaDonate className="text-3xl text-red-700" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-6 text-gray-600">
        Welcome back, Admin! Here’s a quick overview of your system. Keep an eye on user activity,
        donation stats, and pending requests. Everything you need is right here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform"
          >
            {stat.icon}
            <h2 className="text-xl font-semibold mt-2">{stat.title}</h2>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-2">Quick Messages</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>✅ Check pending donation requests regularly.</li>
          <li>📢 Make announcements to users when needed.</li>
          <li>🛠 Monitor system performance and user activity.</li>
          <li>💡 New features will appear here when deployed.</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
