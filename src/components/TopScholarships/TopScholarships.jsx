import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import axios from "axios";
import Loading from "../../pages/Loading/Loading";

export default function TopScholarships() {
    const navigate = useNavigate();

    // Fetch all scholarships
    const fetchScholarships = async () => {
        const res = await axios.get(
            "https://server-bloodbridge.vercel.app/scholarships"
        );
        if (!Array.isArray(res.data)) return [];
        return res.data;
    };

    const { data: scholarshipsData, isLoading, isError, error } = useQuery({
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

    const scholarships = Array.isArray(scholarshipsData) ? scholarshipsData : [];

    // Filter + sort by low application fee & recent posting
    const topScholarships = scholarships
        .filter((sch) => sch.applicationFees && !isNaN(Number(sch.applicationFees)))
        .sort(
            (a, b) =>
                Number(a.applicationFees) - Number(b.applicationFees) ||
                new Date(b.postDate) - new Date(a.postDate)
        )
        .slice(0, 6);

    return (
        <section className="p-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center text-base-content">
                Top Scholarships
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {topScholarships.map((sch) => (
                    <div
                        key={sch._id}
                        className="bg-base-100 rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1 hover:scale-105 p-6 flex flex-col"
                    >
                        {/* University image */}
                        <div
                            className="relative h-40 w-full mb-4 rounded-xl overflow-hidden 
             "
                        >
                            <img
                                src={sch.universityImage}
                                alt={sch.universityName}
                                className="w-full h-full object-contain"
                            />
                            <span className="absolute top-2 left-2 bg-primary text-primary-content text-xs px-3 py-1 rounded-full shadow-md">
                                {sch.subjectCategory}
                            </span>
                        </div>

                        {/* Scholarship info */}
                        <h3 className="text-xl font-bold mb-1 text-base-content">
                            {sch.scholarshipName}
                        </h3>
                        <p className="text-base-content/70 mb-1">{sch.universityName}</p>
                        <p className="text-base-content/60 mb-1">
                            Application Fee: ${sch.applicationFees}
                        </p>
                        <p className="text-base-content/60 mb-3">
                            Posted: {new Date(sch.postDate).toLocaleDateString()}
                        </p>

                        {/* View Details */}
                        <button
                            className="mt-auto btn btn-primary btn-sm"
                            onClick={() => navigate(`/scholarship/${sch._id}`)}
                        >
                            View Details
                        </button>
                    </div>
                ))}
            </div>

            {/* All Scholarships Button */}
            <div className="text-center mt-8">
                <button
                    className="btn btn-outline btn-primary"
                    onClick={() => navigate("/all-scholarships")}
                >
                    All Scholarships
                </button>
            </div>
        </section>
    );
}
