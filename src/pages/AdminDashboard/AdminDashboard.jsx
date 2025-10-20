// src/pages/AdminDashboard/AdminDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { showError } from "../../utility/sweetAlert";
import Loading from "../Loading/Loading";
import { FaUser, FaGraduationCap, FaClipboardList, FaStar } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalScholarships: 0,
    totalApplications: 0,
    totalReviews: 0,
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentScholarships, setRecentScholarships] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [latestReviews, setLatestReviews] = useState([]);

  const [applicationsByScholarship, setApplicationsByScholarship] = useState({
    labels: [],
    data: [],
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [usersRes, scholarshipsRes, applicationsRes, reviewsRes] = await Promise.all([
        axiosSecure.get("/get-users"),
        axiosSecure.get("/scholarships"),
        axiosSecure.get("/applied-scholarships"),
        axiosSecure.get("/reviews"),
      ]);

      setStats({
        totalUsers: usersRes.data.length,
        totalScholarships: scholarshipsRes.data.length,
        totalApplications: applicationsRes.data.length,
        totalReviews: reviewsRes.data.length,
      });

      setRecentUsers(usersRes.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
      );

      setRecentScholarships(scholarshipsRes.data
        .sort((a, b) => new Date(b.postDate) - new Date(a.postDate))
        .slice(0, 5)
      );

      setPendingApplications(applicationsRes.data
        .filter(app => app.status !== "approved" && app.status !== "rejected")
        .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
        .slice(0, 5)
      );

      setLatestReviews(reviewsRes.data
        .sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate))
        .slice(0, 5)
      );

      const appCountByScholarship = {};
      applicationsRes.data.forEach(app => {
        const name = app.scholarship?.scholarshipName || "Unknown";
        appCountByScholarship[name] = (appCountByScholarship[name] || 0) + 1;
      });

      setApplicationsByScholarship({
        labels: Object.keys(appCountByScholarship),
        data: Object.values(appCountByScholarship),
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      showError("Failed to fetch dashboard data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 my-20">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center md:text-left">
        📊 Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 shadow-lg rounded-xl p-5 flex flex-col items-center hover:scale-105 transition-transform">
          <FaUser className="text-blue-600 text-3xl mb-2" />
          <p className="text-gray-700 font-medium">Total Users</p>
          <p className="text-xl sm:text-2xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-gradient-to-r from-green-100 to-green-200 shadow-lg rounded-xl p-5 flex flex-col items-center hover:scale-105 transition-transform">
          <FaGraduationCap className="text-green-600 text-3xl mb-2" />
          <p className="text-gray-700 font-medium">Total Scholarships</p>
          <p className="text-xl sm:text-2xl font-bold">{stats.totalScholarships}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 shadow-lg rounded-xl p-5 flex flex-col items-center hover:scale-105 transition-transform">
          <FaClipboardList className="text-yellow-600 text-3xl mb-2" />
          <p className="text-gray-700 font-medium">Total Applications</p>
          <p className="text-xl sm:text-2xl font-bold">{stats.totalApplications}</p>
        </div>
        <div className="bg-gradient-to-r from-pink-100 to-pink-200 shadow-lg rounded-xl p-5 flex flex-col items-center hover:scale-105 transition-transform">
          <FaStar className="text-pink-600 text-3xl mb-2" />
          <p className="text-gray-700 font-medium">Total Reviews</p>
          <p className="text-xl sm:text-2xl font-bold">{stats.totalReviews}</p>
        </div>
      </div>

      {/* Applications Chart */}
      <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 text-center md:text-left">
          Applications by Scholarship
        </h2>
        <Bar
          data={{
            labels: applicationsByScholarship.labels,
            datasets: [
              {
                label: "# of Applications",
                data: applicationsByScholarship.data,
                backgroundColor: "rgba(59, 130, 246, 0.7)",
                borderRadius: 5,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Applications per Scholarship" },
            },
          }}
        />
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800">Recent Users</h2>
          <ul className="divide-y divide-gray-200">
            {recentUsers.map(u => (
              <li key={u._id} className="flex justify-between py-2 sm:py-3 px-2 sm:px-3 hover:bg-gray-50 rounded transition">
                <span className="font-medium text-gray-700 truncate">{u.name}</span>
                <span className="text-gray-400 text-sm">{new Date(u.createdAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Scholarships */}
        <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800">Recent Scholarships</h2>
          <ul className="divide-y divide-gray-200">
            {recentScholarships.map(s => (
              <li key={s._id} className="flex justify-between py-2 sm:py-3 px-2 sm:px-3 hover:bg-gray-50 rounded transition">
                <span className="font-medium text-gray-700 truncate">{s.scholarshipName}</span>
                <span className="text-gray-400 text-sm">{new Date(s.postDate).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pending Applications */}
      <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 mt-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800">Pending Applications</h2>
        <ul className="divide-y divide-gray-200">
          {pendingApplications.map(app => (
            <li key={app._id} className="flex flex-col sm:flex-row justify-between py-2 sm:py-3 px-2 sm:px-3 hover:bg-gray-50 rounded transition">
              <span className="font-medium text-gray-700 truncate">{app.userName} → {app.scholarship?.scholarshipName}</span>
              <span className="text-gray-400 text-sm mt-1 sm:mt-0">{new Date(app.appliedDate).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Latest Reviews */}
      <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 mt-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800">Latest Reviews</h2>
        <ul className="divide-y divide-gray-200">
          {latestReviews.map(r => (
            <li key={r._id} className="py-2 sm:py-3 px-2 sm:px-3 hover:bg-gray-50 rounded transition">
              <p className="font-medium text-gray-700 truncate">{r.userName} rated {r.rating}⭐</p>
              <p className="text-gray-500 truncate">{r.comment}</p>
              <p className="text-gray-400 text-xs">{new Date(r.reviewDate).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
