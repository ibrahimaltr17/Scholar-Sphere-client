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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ModeratorDashboard = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(true);

    const [recentScholarships, setRecentScholarships] = useState([]);
    const [appliedScholarships, setAppliedScholarships] = useState([]);
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

            // Recent scholarships (last 5)
            setRecentScholarships(
                scholarshipsRes.data
                    .sort((a, b) => new Date(b.postDate) - new Date(a.postDate))
                    .slice(0, 5)
            );

            // Applied scholarships (last 5)
            setAppliedScholarships(
                applicationsRes.data
                    .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
                    .slice(0, 5)
            );

            // Applications by Scholarship chart
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
        // eslint-disable-next-line
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 my-20">
            <h1 className="text-3xl font-bold mb-6">Moderator Dashboard</h1>

            {/* Applications by Scholarship Chart */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Applications by Scholarship</h2>
                <Bar
                    data={{
                        labels: applicationsByScholarship.labels,
                        datasets: [
                            {
                                label: "# of Applications",
                                data: applicationsByScholarship.data,
                                backgroundColor: "rgba(59, 130, 246, 0.7)",
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Scholarships */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Scholarships</h2>
                    <ul className="space-y-2">
                        {recentScholarships.map(s => (
                            <li key={s._id} className="flex justify-between border-b py-2">
                                <span>{s.scholarshipName}</span>
                                <span className="text-gray-500 text-sm">{new Date(s.postDate).toLocaleDateString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Recent Applied Scholarships */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Applied Scholarships</h2>
                    <ul className="space-y-2">
                        {appliedScholarships.map(app => (
                            <li key={app._id} className="flex justify-between border-b py-2">
                                <span>{app.userName} → {app.scholarship?.scholarshipName}</span>
                                <span className="text-gray-500 text-sm">{new Date(app.appliedDate).toLocaleDateString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ModeratorDashboard;
