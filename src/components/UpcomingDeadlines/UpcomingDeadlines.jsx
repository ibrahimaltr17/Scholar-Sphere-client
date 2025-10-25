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

            const futureDeadlines = scholarships
                .filter(
                    (sch) => sch.applicationDeadline && new Date(sch.applicationDeadline) > today
                )
                .sort(
                    (a, b) => new Date(a.applicationDeadline) - new Date(b.applicationDeadline)
                )
                .slice(0, 3); // next 3

            setUpcoming(futureDeadlines);
        }
    }, [scholarships]);

    if (isLoading) return <p className="text-center my-10">Loading scholarships...</p>;
    if (!upcoming.length)
        return <p className="text-center my-10 text-base-content/50">No upcoming deadlines.</p>;

    return (
        <section className="py-12 max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-base-content">
                Upcoming Deadlines
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {upcoming.map((sch) => (
                    <div
                        key={sch._id}
                        className="bg-base-100 rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1 hover:scale-105 flex flex-col p-6 border border-base-200"
                    >
                        {/* University logo */}
                        <div className="h-16 w-16 mb-4 mx-auto rounded-full overflow-hidden bg-white dark:bg-black p-1 flex items-center justify-center">
                            <img
                                src={sch.universityImage || "https://via.placeholder.com/80"}
                                alt={sch.scholarshipName || "Unnamed Scholarship"}
                                className="h-full w-full object-contain rounded-full"
                            />
                        </div>

                        {/* Scholarship info */}
                        <h3 className="text-lg font-semibold text-base-content text-center mb-1">
                            {sch.scholarshipName || "Unnamed Scholarship"}
                        </h3>
                        <p className="text-sm text-base-content/70 text-center mb-2">
                            {sch.universityName || "Unknown University"}
                        </p>

                        <p className="text-sm text-base-content/60 text-center mb-4">
                            Deadline:{" "}
                            <span className="font-semibold">
                                {new Date(sch.applicationDeadline).toLocaleDateString()}
                            </span>
                        </p>

                        {/* Apply Button */}
                        <button
                            onClick={() => navigate(`/scholarship/${sch._id}`)}
                            className="mt-auto btn btn-primary w-full"
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
