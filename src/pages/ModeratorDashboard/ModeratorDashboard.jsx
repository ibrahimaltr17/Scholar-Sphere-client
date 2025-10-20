// src/pages/ModeratorDashboard/ModeratorDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { showError } from "../../utility/sweetAlert";
import Loading from "../Loading/Loading";
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
import { FaGraduationCap, FaUserCheck, FaChartBar } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ModeratorDashboard = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(true);

    const [scholarships, setScholarships] = useState([]);
    const [applications, setApplications] = useState([]);
    const [applicationsByScholarship, setApplicationsByScholarship] = useState({
        labels: [],
        data: [],
    });

    // Fetch dashboard data
    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            const [scholarshipsRes, applicationsRes] = await Promise.all([
                axiosSecure.get("/scholarships"),
                axiosSecure.get("/applied-scholarships"),
            ]);

            const scholarshipsData = scholarshipsRes.data || [];
            const applicationsData = applicationsRes.data || [];

            setScholarships(scholarshipsData);
            setApplications(applicationsData);

            // Applications by Scholarship chart
            const appCountByScholarship = {};
            applicationsData.forEach((app) => {
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

    // Fetch every 30s for real-time updates
    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, []);

    if (loading) return <Loading />;

    // Processed data
    const totalScholarships = scholarships.length;
    const activeScholarships = scholarships.filter(
        (s) => s.status?.toLowerCase() === "active"
    ).length;

    const recentScholarships = scholarships
        .sort((a, b) => new Date(b.postDate) - new Date(a.postDate))
        .slice(0, 5);

    const recentApplications = applications
        .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
        .slice(0, 5);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 md:p-10 my-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        👋 Welcome back,{" "}
                        <span className="text-blue-600">{user?.displayName || "Moderator"}</span>
                    </h1>
                    <p className="text-gray-500 mt-1">Here’s your live dashboard overview</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Scholarships</p>
                            <h3 className="text-2xl font-bold text-gray-800">{totalScholarships}</h3>
                        </div>
                        <FaGraduationCap className="text-blue-500 text-4xl" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Active Scholarships</p>
                            <h3 className="text-2xl font-bold text-gray-800">{activeScholarships}</h3>
                        </div>
                        <FaChartBar className="text-yellow-500 text-4xl" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Applications</p>
                            <h3 className="text-2xl font-bold text-gray-800">{applications.length}</h3>
                        </div>
                        <FaUserCheck className="text-green-500 text-4xl" />
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-2xl shadow p-6 mb-10">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    📊 Applications by Scholarship
                </h2>
                <Bar
                    data={{
                        labels: applicationsByScholarship.labels,
                        datasets: [
                            {
                                label: "Applications",
                                data: applicationsByScholarship.data,
                                backgroundColor: "rgba(59, 130, 246, 0.7)",
                                borderRadius: 6,
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { display: false },
                        },
                    }}
                />
            </div>

            {/* Recent Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Scholarships */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">🎓 Recent Scholarships</h2>
                    <ul className="divide-y divide-gray-200">
                        {recentScholarships.map((s) => (
                            <li
                                key={s._id}
                                className="py-3 flex justify-between items-center hover:bg-gray-50 px-2 rounded-lg transition"
                            >
                                <div>
                                    <p className="font-medium text-gray-800">{s.scholarshipName}</p>
                                    <p className="text-sm text-gray-500">
                                        Posted: {new Date(s.postDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <span
                                    className={`px-3 py-1 text-xs rounded-full ${s.status === "active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    {s.status || "N/A"}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Recent Applications */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">📝 Recent Applications</h2>
                    <ul className="divide-y divide-gray-200">
                        {recentApplications.map((app) => (
                            <li
                                key={app._id}
                                className="py-3 flex justify-between items-center hover:bg-gray-50 px-2 rounded-lg transition"
                            >
                                <div>
                                    <p className="font-medium text-gray-800">
                                        <span className="text-blue-600">{app.userName}</span> applied for{" "}
                                        <span className="font-semibold text-gray-900">
                                            {app.scholarship?.scholarshipName || "N/A"}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(app.appliedDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ModeratorDashboard;
