import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-6 text-center space-y-6">
      <h1 className="text-3xl font-bold text-green-700">
        Hi {user?.displayName || user?.email}, Welcome to Your Dashboard 🌸
      </h1>
      <p className="text-gray-600 max-w-md mx-auto">
        Find the best scholarship for your future. Start applying today and
        achieve your dreams!
      </p>
      <button className="bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:bg-green-700">
        🎓 Browse Scholarships
      </button>
    </div>
  );
};

export default UserDashboard;
