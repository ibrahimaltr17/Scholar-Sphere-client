import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";

import Loading from "../Loading/Loading";
import notFound from "../../assets/search not found.jpg";

export default function AllScholarships() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState(""); // For sorting
    const navigate = useNavigate();

    // Fetch scholarships
    const fetchScholarships = async () => {
        const res = await axios.get(`https://server-bloodbridge.vercel.app/scholarships`);
        if (!Array.isArray(res.data)) return [];
        return res.data;
    };

    const { data: scholarshipsData, isLoading, isError, error } = useQuery({
        queryKey: ["scholarships"],
        queryFn: fetchScholarships,
    });

    const scholarships = Array.isArray(scholarshipsData) ? scholarshipsData : [];

    // Filter by search
    const filteredScholarships = scholarships.filter((sch) =>
        [sch.scholarshipName, sch.universityName, sch.degree]
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    // Sort scholarships
    const sortedScholarships = [...filteredScholarships].sort((a, b) => {
        if (sortOption === "deadline") {
            return new Date(a.applicationDeadline) - new Date(b.applicationDeadline);
        } else if (sortOption === "rating") {
            const avgA = a.ratings?.length
                ? a.ratings.reduce((sum, r) => sum + Number(r), 0) / a.ratings.length
                : 0;
            const avgB = b.ratings?.length
                ? b.ratings.reduce((sum, r) => sum + Number(r), 0) / b.ratings.length
                : 0;
            return avgB - avgA; // descending
        } else {
            return 0; // no sorting
        }
    });

    const calculateAverageRating = (ratings = []) => {
        if (!Array.isArray(ratings) || ratings.length === 0) return 0;
        const total = ratings.reduce((sum, r) => sum + Number(r), 0);
        return (total / ratings.length).toFixed(1);
    };

    return (
        <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-12 my-20">
            {/* Search & Sort */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-4xl mx-auto">
                <div className="flex flex-1 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 shadow-sm">
                    <input
                        type="text"
                        placeholder="Search scholarships, university, or degree..."
                        className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="bg-indigo-600 dark:bg-indigo-500 text-white px-5 py-3 font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors">
                        Search
                    </button>
                </div>

                <select
                    className="mt-3 md:mt-0 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 shadow-sm text-gray-600 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                >
                    <option value="">Sort by</option>
                    <option value="deadline">Deadline</option>
                    <option value="rating">Rating</option>
                </select>
            </div>

            {/* Loading / Error / No results */}
            {isLoading && <Loading />}
            {isError && (
                <p className="text-red-500 text-center mt-6">
                    Failed to load scholarships: {error.message}
                </p>
            )}
            {!isLoading && sortedScholarships.length === 0 && (
                <div className="text-center mt-20">
                    <img src={notFound} alt="No scholarships" className="mx-auto w-48" />
                    <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">
                        No scholarships available.
                    </p>
                </div>
            )}

            {/* Scholarship Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {!isLoading &&
                    sortedScholarships.map((sch) => (
                        <div
                            key={sch._id}
                            className="bg-base-100 dark:bg-gray-900 rounded-3xl shadow-md dark:shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1 hover:scale-105 p-6 flex flex-col"
                        >
                            <div className="relative h-48 w-full mb-4 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                                <img
                                    src={sch.universityImage}
                                    alt={sch.universityName}
                                    className="w-full h-full object-cover"
                                />
                                <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                                    {sch.subjectCategory}
                                </span>
                                <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                                    {sch.scholarshipCategory}
                                </span>
                            </div>

                            <h2 className="text-xl font-bold mb-1 text-base-content">
                                {sch.universityName}
                            </h2>
                            <p className="text-base-content/80 mb-2">{sch.scholarshipName}</p>
                            <p className="text-base-content/60 mb-1">
                                Location: {sch.country}, {sch.city}
                            </p>
                            <p className="text-base-content/60 mb-1">
                                Deadline:{" "}
                                <span className="font-semibold text-red-500">
                                    {new Date(sch.applicationDeadline).toLocaleDateString()}
                                </span>
                            </p>
                            <p className="text-base-content/60 mb-4">
                                Rating: ⭐ {calculateAverageRating(sch.ratings)}
                            </p>

                            <button
                                className="mt-auto bg-gradient-to-r from-indigo-500 to-blue-500 dark:from-indigo-600 dark:to-blue-600 text-white font-semibold px-5 py-2 rounded-full shadow-lg hover:from-blue-500 hover:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-700 transition-all"
                                onClick={() => navigate(`/scholarship/${sch._id}`)}
                            >
                                View Details
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
}
