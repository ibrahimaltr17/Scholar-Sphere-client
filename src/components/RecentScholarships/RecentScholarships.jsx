import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import axios from "axios";
import Loading from "../../pages/Loading/Loading";

const RecentScholarships = () => {
    const navigate = useNavigate();

    // Fetch scholarships
    const fetchScholarships = async () => {
        const res = await axios.get("https://server-bloodbridge.vercel.app/scholarships");
        return Array.isArray(res.data) ? res.data : [];
    };

    const { data: scholarships, isLoading, isError, error } = useQuery({
        queryKey: ["scholarships"],
        queryFn: fetchScholarships,
    });

    if (isLoading) return <Loading />;
    if (isError)
        return (
            <p className="text-red-500 text-center">
                Failed to load scholarships: {error.message}
            </p>
        );

    // Sort by postDate descending and take last 3
    const recentScholarships = (scholarships || [])
        .sort((a, b) => new Date(b.postDate) - new Date(a.postDate))
        .slice(0, 3);

    return (
        <section className="p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                Recently Added Scholarships
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recentScholarships.map((sch) => (
                    <div
                        key={sch._id}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 p-4 flex flex-col items-center text-center"
                    >
                        {/* University Logo */}
                        <div className="h-20 w-20 mb-3">
                            <img
                                src={sch.universityImage}
                                alt={sch.universityName}
                                className="h-full w-full object-contain rounded-full bg-gray-100 p-2"
                            />
                        </div>

                        {/* University Name */}
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{sch.universityName}</h3>

                        {/* Post Date */}
                        <p className="text-gray-400 text-sm mb-3">
                            Posted: {new Date(sch.postDate).toLocaleDateString()}
                        </p>

                        {/* View Details */}
                        <button
                            className="bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow hover:bg-green-700 transition-colors"
                            onClick={() => navigate(`/scholarship/${sch._id}`)}
                        >
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default RecentScholarships;
