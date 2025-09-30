import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getAuth, getIdToken } from "firebase/auth";
import axios from "axios";
import Loading from "../Loading/Loading";
import { FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";

export default function ScholarshipDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const auth = getAuth();

    const fetchScholarship = async () => {
        const user = auth.currentUser;
        if (!user) throw new Error("User not logged in");
        const token = await getIdToken(user);

        const res = await axios.get(
            `https://server-bloodbridge.vercel.app/scholarships/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        return res.data.data;
    };

    const { data: sch, isLoading, isError } = useQuery({
        queryKey: ["scholarship", id],
        queryFn: fetchScholarship,
    });

    if (isLoading) return <Loading />;
    if (isError || !sch)
        return (
            <p className="text-center text-red-500 text-lg mt-10">
                Failed to load scholarship details.
            </p>
        );

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            {/* Hero Banner */}
            <div className="relative h-96 w-full rounded-3xl overflow-hidden shadow-lg">
                <img
                    src={sch.universityImage}
                    alt={sch.universityName}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                        {sch.universityName}
                    </h1>
                    <span className="mt-2 inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        {sch.scholarshipCategory}
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Description */}
                <div className="md:col-span-2 space-y-6">
                    <section className="bg-white p-8 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">About the Scholarship</h2>
                        <p className="text-gray-700 leading-relaxed">{sch.description}</p>
                    </section>

                    <section className="bg-white p-8 rounded-2xl shadow-lg grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex items-center space-x-3">
                            <FaMapMarkerAlt className="text-blue-600 text-xl" />
                            <p className="text-gray-700">{sch.country}, {sch.city}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <FaCalendarAlt className="text-green-600 text-xl" />
                            <p className="text-gray-700">
                                Application Deadline: <span className="font-semibold text-red-500">{new Date(sch.applicationDeadline).toLocaleDateString()}</span>
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <FaCalendarAlt className="text-purple-600 text-xl" />
                            <p className="text-gray-700">
                                Posted On: <span className="font-semibold">{new Date(sch.postDate).toLocaleDateString()}</span>
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="text-gray-700 font-semibold">Subject:</span>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">{sch.subjectCategory}</span>
                        </div>
                    </section>

                    {/* Apply Button */}
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={() => navigate(`/apply-scholarship/${id}`)}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-10 py-3 rounded-full font-semibold shadow-lg hover:from-indigo-600 hover:to-blue-500 transition-all"
                        >
                            Apply Now
                        </button>
                    </div>

                </div>

                {/* Right Column: Financial Info */}
                <div className="space-y-6">
                    <section className="bg-white p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Financial Information</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 flex items-center gap-2"><FaMoneyBillWave /> Stipend:</span>
                                <span className="font-semibold">{sch.stipend ? `$${sch.stipend}` : "N/A"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 flex items-center gap-2"><FaMoneyBillWave /> Service Charge:</span>
                                <span className="font-semibold">${sch.serviceCharge || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 flex items-center gap-2"><FaMoneyBillWave /> Application Fees:</span>
                                <span className="font-semibold">${sch.applicationFees || 0}</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Back Button */}
            <div className="mt-10 text-center">
                <button
                    onClick={() => navigate(-1)}
                    className="text-blue-600 hover:underline"
                >
                    ← Back to Scholarships
                </button>
            </div>
        </div>
    );
}
