import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../context/AuthContext";
import { FaFileAlt, FaClock, FaTimesCircle, FaCommentDots } from "react-icons/fa";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const { data: applicationsRaw = [], isLoading } = useQuery({
    queryKey: ["myAppliedScholarships", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/my-applied-scholarships");
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return <div className="text-center mt-20 text-green-600 dark:text-green-400">Loading your dashboard...</div>;
  }

  const applications = applicationsRaw.filter(app => app.userEmail === user?.email);

  // Stats
  const total = applications.length;
  const pending = applications.filter(
    (app) => app.status?.toLowerCase() === "pending" || app.status?.toLowerCase() === "processing"
  ).length;
  const rejected = applications.filter(
    (app) => app.status?.toLowerCase() === "rejected"
  ).length;

  const recentApps = [...applications]
    .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
    .slice(0, 3);

  const feedbacks = applications
    .filter((app) => app.feedback)
    .sort((a, b) => new Date(b.feedbackAt) - new Date(a.feedbackAt))
    .slice(0, 3);

  return (
    <div className="p-6 md:p-10 lg:p-12 mt-20 space-y-12">
      <h1 className="text-3xl md:text-4xl font-bold text-green-700 dark:text-green-400 text-center">
        Hi {user?.displayName || user?.email}, Welcome to Your Dashboard 🌸
      </h1>

      {/* --- Stats Section --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-green-100 dark:bg-green-900 p-6 rounded-2xl shadow-md dark:shadow-lg text-center transition-transform hover:scale-105">
          <FaFileAlt className="text-3xl text-green-600 dark:text-green-400 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">Total Applied</h3>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">{total}</p>
        </div>

        <div className="bg-yellow-100 dark:bg-yellow-900 p-6 rounded-2xl shadow-md dark:shadow-lg text-center transition-transform hover:scale-105">
          <FaClock className="text-3xl text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">On Process</h3>
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{pending}</p>
        </div>

        <div className="bg-red-100 dark:bg-red-900 p-6 rounded-2xl shadow-md dark:shadow-lg text-center transition-transform hover:scale-105">
          <FaTimesCircle className="text-3xl text-red-600 dark:text-red-400 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Rejected</h3>
          <p className="text-2xl font-bold text-red-700 dark:text-red-300">{rejected}</p>
        </div>
      </div>

      {/* --- Recent Applications --- */}
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6">
        <h2 className="text-xl md:text-2xl font-bold text-green-700 dark:text-green-400 mb-4">🎓 Recent Applications</h2>
        {recentApps.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm md:text-base">
              <thead className="bg-green-50 dark:bg-green-800 text-green-700 dark:text-green-200">
                <tr>
                  <th className="px-4 py-2 border">Scholarship</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map((app) => (
                  <tr key={app._id} className="border-b hover:bg-green-50 dark:hover:bg-green-900 transition-colors">
                    <td className="px-4 py-2 border">{app.scholarship?.name || "Unknown Scholarship"}</td>
                    <td className="px-4 py-2 border">{new Date(app.appliedDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border capitalize">{app.status || "Pending"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300 mt-4">No applications found yet.</p>
        )}
      </div>

      {/* --- Feedback Section --- */}
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6">
        <h2 className="text-xl md:text-2xl font-bold text-green-700 dark:text-green-400 mb-4 flex items-center gap-2">
          <FaCommentDots className="text-green-600 dark:text-green-400" /> Recent Feedback
        </h2>

        {feedbacks.length > 0 ? (
          <ul className="space-y-4">
            {feedbacks.map((app) => (
              <li key={app._id} className="p-4 bg-green-50 dark:bg-green-900 rounded-lg border-l-4 border-green-600 dark:border-green-400 transition-shadow hover:shadow-md">
                <p className="font-semibold text-green-800 dark:text-green-200">
                  Scholarship: {app.scholarship?.name || "Unknown Scholarship"}
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm mt-1 italic">“{app.feedback}”</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(app.feedbackAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-300 mt-2">No feedback yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
