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
            <p className="text-error text-center mt-6">
                Failed to load scholarships: {error.message}
            </p>
        );

    // Sort by postDate descending and take last 3
    const recentScholarships = (scholarships || [])
        .sort((a, b) => new Date(b.postDate) - new Date(a.postDate))
        .slice(0, 3);

    return (
        <section className="p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-base-content mb-6">
                Recently Added Scholarships
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {recentScholarships.map((sch) => (
                    <div
                        key={sch._id}
                        className="bg-base-100 rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1 hover:scale-105 p-6 flex flex-col items-center text-center"
                    >
                        {/* University Logo */}
                        <div className="h-20 w-20 mb-4 rounded-full overflow-hidden bg-white dark:bg-black p-2 flex items-center justify-center">
                            <img
                                src={sch.universityImage}
                                alt={sch.universityName}
                                className="h-full w-full object-contain rounded-full"
                            />
                        </div>

                        {/* University Name */}
                        <h3 className="text-lg font-semibold text-base-content mb-1">
                            {sch.universityName}
                        </h3>

                        {/* Post Date */}
                        <p className="text-base-content/60 text-sm mb-4">
                            Posted: {new Date(sch.postDate).toLocaleDateString()}
                        </p>

                        {/* View Details Button */}
                        <button
                            className="btn btn-primary btn-sm w-full"
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
