import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";

const UpcomingDeadlines = () => {
    const navigate = useNavigate();
    const [upcoming, setUpcoming] = useState([]);

    // Fetch all scholarships
    const { data: scholarships = [], isLoading } = useQuery({
        queryKey: ["scholarships"],
        queryFn: async () => {
            const res = await axios.get("https://server-bloodbridge.vercel.app/scholarships");
            return Array.isArray(res.data) ? res.data : [];
        },
    });

    useEffect(() => {
        if (scholarships.length) {
            const today = new Date();

            // Filter scholarships with deadlines in the future
            const futureDeadlines = scholarships
                .filter(
                    (sch) =>
                        sch.applicationDeadline &&
                        new Date(sch.applicationDeadline) > today
                )
                .sort(
                    (a, b) =>
                        new Date(a.applicationDeadline) - new Date(b.applicationDeadline)
                )
                .slice(0, 3); // take next 3

            setUpcoming(futureDeadlines);
        }
    }, [scholarships]);

    if (isLoading) return <p className="text-center my-10">Loading scholarships...</p>;
    if (!upcoming.length)
        return <p className="text-center my-10 text-gray-500">No upcoming deadlines.</p>;

    return (
        <section className="py-12 max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                ⏰ Upcoming Deadlines
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {upcoming.map((sch) => (
                    <div
                        key={sch._id}
                        className="bg-white rounded-2xl shadow-md p-6 flex flex-col hover:shadow-xl transition-all border border-gray-100"
                    >
                        {/* University image */}
                        <div className="h-16 w-16 mb-4 mx-auto">
                            <img
                                src={sch.universityImage || "https://via.placeholder.com/80"}
                                alt={sch.scholarshipName}
                                className="h-full w-full object-contain rounded-md"
                            />
                        </div>

                        {/* Scholarship info */}
                        <h3 className="text-lg font-semibold text-gray-800 text-center mb-1">
                            {sch.scholarshipName || "Unnamed Scholarship"}
                        </h3>
                        <p className="text-sm text-gray-500 text-center mb-2">
                            {sch.universityName || "Unknown University"}
                        </p>

                        <p className="text-sm text-gray-600 text-center mb-4">
                            Deadline:{" "}
                            <span className="font-semibold">
                                {new Date(sch.applicationDeadline).toLocaleDateString()}
                            </span>
                        </p>

                        <button
                            onClick={() => navigate(`/scholarship/${sch._id}`)}
                            className="mt-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-4 py-2 rounded-full shadow-lg hover:from-indigo-600 hover:to-blue-500 transition-all"
                        >
                            Apply Now
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default UpcomingDeadlines;
