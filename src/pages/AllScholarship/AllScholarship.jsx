import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";

import Loading from "../Loading/Loading";
import notFound from "../../assets/search not found.jpg";

export default function AllScholarships() {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    // Fetch scholarships with Firebase token
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

    const filteredScholarships = scholarships.filter((sch) =>
        [sch.scholarshipName, sch.universityName, sch.degree]
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const calculateAverageRating = (ratings = []) => {
        if (!Array.isArray(ratings) || ratings.length === 0) return 0;
        const total = ratings.reduce((sum, r) => sum + Number(r), 0);
        return (total / ratings.length).toFixed(1);
    };

    return (
        <div className="p-6 space-y-12 max-w-7xl mx-auto">
            {/* Search Box */}
            <div className="flex mb-6 max-w-2xl mx-auto">
                <input
                    type="text"
                    placeholder="Search by Scholarship, University, or Degree"
                    className="border p-3 flex-1 rounded-l-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    className="bg-blue-600 text-white px-6 rounded-r-xl font-semibold shadow hover:bg-blue-700 transition-colors"
                >
                    Search
                </button>
            </div>

            {isLoading && <Loading />}
            {isError && (
                <p className="text-red-500 text-center">
                    Failed to load scholarships: {error.message}
                </p>
            )}
            {!isLoading && filteredScholarships.length === 0 && (
                <div className="text-center mt-20">
                    <img src={notFound} alt="No scholarships" className="mx-auto w-48" />
                    <p className="mt-4 text-gray-600 text-lg">No scholarships available.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {!isLoading &&
                    filteredScholarships.map((sch) => (
                        <div
                            key={sch._id}
                            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 hover:scale-105 p-6 flex flex-col"
                        >
                            <div className="relative h-48 w-full mb-4 rounded-xl overflow-hidden">
                                <img
                                    src={sch.universityImage}
                                    alt={sch.universityName}
                                    className="w-full h-full object-cover"
                                />
                                <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                                    {sch.subjectCategory}
                                </span>
                                <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                                    {sch.scholarshipCategory}
                                </span>
                            </div>

                            <h2 className="text-xl font-bold mb-1 text-gray-800">{sch.universityName}</h2>
                            <p className="text-gray-600 mb-2">{sch.scholarshipName}</p>
                            <p className="text-gray-500 mb-1">
                                Location: {sch.country}, {sch.city}
                            </p>
                            <p className="text-gray-500 mb-1">
                                Deadline:{" "}
                                <span className="font-semibold text-red-500">
                                    {new Date(sch.applicationDeadline).toLocaleDateString()}
                                </span>
                            </p>
                            <p className="text-gray-500 mb-3">
                                Rating: ⭐ {calculateAverageRating(sch.ratings)}
                            </p>

                            <button
                                className="mt-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-5 py-2 rounded-full shadow-lg hover:from-indigo-600 hover:to-blue-500 transition-all"
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
