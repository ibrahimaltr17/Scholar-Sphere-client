import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import axios from "axios";
import Loading from "../../pages/Loading/Loading";

const TopRatedUniversities = () => {
    const navigate = useNavigate();

    // Fetch universities
    const fetchUniversities = async () => {
        const res = await axios.get("https://server-bloodbridge.vercel.app/universities");
        return Array.isArray(res.data) ? res.data : [];
    };

    // Fetch all reviews
    const fetchReviews = async () => {
        const res = await axios.get("https://server-bloodbridge.vercel.app/all-reviews");
        return Array.isArray(res.data) ? res.data : [];
    };

    const { data: universities, isLoading: uniLoading } = useQuery({
        queryKey: ["universities"],
        queryFn: fetchUniversities,
    });

    const { data: reviews, isLoading: reviewLoading } = useQuery({
        queryKey: ["reviews"],
        queryFn: fetchReviews,
    });

    if (uniLoading || reviewLoading) return <Loading />;

    // Compute average rating
    const topRated = (universities || [])
        .map((uni) => {
            const uniReviews = (reviews || []).filter((r) => r.universityId === uni._id);
            const avgRating =
                uniReviews.length > 0
                    ? uniReviews.reduce((sum, r) => sum + r.rating, 0) / uniReviews.length
                    : 0;
            return { ...uni, avgRating, totalReviews: uniReviews.length };
        })
        .sort((a, b) => b.avgRating - a.avgRating)
        .slice(0, 3);

    return (
        <section className="p-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Top Rated Universities
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {topRated.map((uni) => (
                    <div
                        key={uni._id}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 hover:scale-105 p-6 flex flex-col"
                    >
                        {/* University image */}
                        <div className="relative h-40 w-full mb-4 rounded-xl overflow-hidden">
                            <img
                                src={uni.image || "https://via.placeholder.com/400x300?text=University"}
                                alt={uni.name}
                                className="w-full h-full object-cover bg-gray-100"
                            />
                        </div>

                        {/* University info */}
                        <h3 className="text-xl font-bold mb-1 text-gray-800">{uni.name}</h3>
                        <p className="text-gray-600 mb-1">{uni.location || "Location not specified"}</p>
                        <p className="text-yellow-500 font-semibold mb-1">
                            Rating: {uni.avgRating.toFixed(1)} ⭐ ({uni.totalReviews} review
                            {uni.totalReviews !== 1 && "s"})
                        </p>

                        {/* View Details */}
                        <button
                            className="mt-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-5 py-2 rounded-full shadow-lg hover:from-indigo-600 hover:to-blue-500 transition-all"
                            onClick={() => navigate(`/university/${uni._id}`)}
                        >
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TopRatedUniversities;
