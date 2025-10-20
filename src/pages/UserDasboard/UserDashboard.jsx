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
    return <div className="text-center mt-20 text-green-600">Loading your dashboard...</div>;
  }

  // --- Front-end hack: include all applications even if scholarship info is missing ---
  const applications = applicationsRaw.filter(app => app.userEmail === user?.email);

  // Stats
  const total = applications.length;
  const pending = applications.filter(
    (app) => app.status?.toLowerCase() === "pending" || app.status?.toLowerCase() === "processing"
  ).length;
  const rejected = applications.filter(
    (app) => app.status?.toLowerCase() === "rejected"
  ).length;

  // Sort by newest
  const recentApps = [...applications]
    .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
    .slice(0, 3);

  // Filter feedback
  const feedbacks = applications
    .filter((app) => app.feedback)
    .sort((a, b) => new Date(b.feedbackAt) - new Date(a.feedbackAt))
    .slice(0, 3);

  return (
    <div className="p-6 mt-20 space-y-8">
      <h1 className="text-3xl font-bold text-green-700 text-center">
        Hi {user?.displayName || user?.email}, Welcome to Your Dashboard 🌸
      </h1>

      {/* --- Stats Section --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
        <div className="bg-green-100 p-6 rounded-2xl shadow-md text-center">
          <FaFileAlt className="text-3xl text-green-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold">Total Applied</h3>
          <p className="text-2xl font-bold text-green-700">{total}</p>
        </div>

        <div className="bg-yellow-100 p-6 rounded-2xl shadow-md text-center">
          <FaClock className="text-3xl text-yellow-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold">On Process</h3>
          <p className="text-2xl font-bold text-yellow-700">{pending}</p>
        </div>

        <div className="bg-red-100 p-6 rounded-2xl shadow-md text-center">
          <FaTimesCircle className="text-3xl text-red-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold">Rejected</h3>
          <p className="text-2xl font-bold text-red-700">{rejected}</p>
        </div>
      </div>

      {/* --- Recent Applications --- */}
      <div className="bg-white shadow-lg p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-green-700 mb-4">🎓 Recent Applications</h2>
        {recentApps.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border">
              <thead>
                <tr className="bg-green-50 text-green-700">
                  <th className="px-4 py-2 border">Scholarship</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map((app) => (
                  <tr key={app._id} className="border-b hover:bg-green-50">
                    <td className="px-4 py-2 border">{app.scholarship?.name || "Unknown Scholarship"}</td>
                    <td className="px-4 py-2 border">{new Date(app.appliedDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border capitalize">{app.status || "Pending"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No applications found yet.</p>
        )}
      </div>

      {/* --- Feedback Section --- */}
      <div className="bg-white shadow-lg p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
          <FaCommentDots className="text-green-600" /> Recent Feedback
        </h2>

        {feedbacks.length > 0 ? (
          <ul className="space-y-3">
            {feedbacks.map((app) => (
              <li key={app._id} className="p-4 bg-green-50 rounded-lg border-l-4 border-green-600">
                <p className="font-semibold text-green-800">
                  Scholarship: {app.scholarship?.name || "Unknown Scholarship"}
                </p>
                <p className="text-gray-700 text-sm mt-1 italic">“{app.feedback}”</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(app.feedbackAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No feedback yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
