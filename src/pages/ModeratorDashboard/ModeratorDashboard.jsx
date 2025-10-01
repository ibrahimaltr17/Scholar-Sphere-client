import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ModeratorDashboard = () => {
    const { user } = useContext(AuthContext);

    // ✅ Fetch total scholarships
    const { data: scholarshipStats } = useQuery({
        queryKey: ["scholarshipStats"],
        queryFn: async () => {
            const res = await axios.get("https://server-bloodbridge.vercel.app/stats/scholarships");
            return res.data;
        },
    });

    // ✅ Fetch total applications
    const { data: applicationStats } = useQuery({
        queryKey: ["applicationStats"],
        queryFn: async () => {
            const res = await axios.get("https://server-bloodbridge.vercel.app/stats/applications");
            return res.data;
        },
    });

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-blue-700">
                    👋 Hi {user?.displayName || user?.email}, Welcome Back!
                </h1>
                <p className="mt-3 text-gray-600">
                    Manage scholarships and track applications efficiently.
                </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body text-center">
                        <h2 className="card-title justify-center">🎓 Scholarships</h2>
                        <p className="text-4xl font-bold text-blue-600">
                            {scholarshipStats?.totalScholarships || 0}
                        </p>
                        <p className="text-gray-500">Total Scholarships Added</p>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body text-center">
                        <h2 className="card-title justify-center">📑 Applications</h2>
                        <p className="text-4xl font-bold text-green-600">
                            {applicationStats?.totalApplications || 0}
                        </p>
                        <p className="text-gray-500">Scholarship Applications</p>
                    </div>
                </div>
            </div>

            {/* Quick Action */}
            <div className="mt-10 text-center">
                <button className="btn btn-primary btn-wide">
                    ➕ Add New Scholarship
                </button>
            </div>
        </div>
    );
};

export default ModeratorDashboard;
