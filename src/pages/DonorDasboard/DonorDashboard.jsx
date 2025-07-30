import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';


const DonorDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="mt-12 text-center">
      <h1 className="text-4xl font-semibold text-teal-600 drop-shadow-md">
        Welcome, {user.displayName}!
      </h1>
    </div>
  );
};

export default DonorDashboard;