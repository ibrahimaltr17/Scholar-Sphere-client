import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import RecentDonationRequests from '../../components/RecentDonationRequests/RecentDonationRequests';


const userDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="mt-12 text-center">
      <h1 className="text-4xl font-semibold text-teal-600 drop-shadow-md">
        Welcome, {user.displayName}!
      </h1>
      <RecentDonationRequests></RecentDonationRequests>
    </div>
  );
};

export default userDashboard;