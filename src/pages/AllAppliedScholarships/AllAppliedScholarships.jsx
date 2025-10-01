import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { getAuth, getIdToken } from "firebase/auth";

export default function AllAppliedScholarships() {
    const auth = getAuth();

    const [selectedApplication, setSelectedApplication] = useState(null);
    const [feedbackText, setFeedbackText] = useState("");
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [feedbackOpen, setFeedbackOpen] = useState(false);

    // Get fresh Firebase ID token
    const getToken = async () => {
        const user = auth.currentUser;
        if (!user) throw new Error("User not logged in");
        const token = await getIdToken(user);
        return token;
    };

    // Fetch all applied scholarships using TanStack Query
    const { data = [], isLoading, error, refetch } = useQuery({
        queryKey: ["allApplied"],
        queryFn: async () => {
            const token = await getToken();
            const res = await axios.get(
                `https://server-bloodbridge.vercel.app/applied-scholarships`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.data;
        },
    });

    // Cancel application
    const cancelApplication = async (id) => {
        try {
            const token = await getToken();
            await axios.patch(
                `https://server-bloodbridge.vercel.app/applied-scholarships/${id}/cancel`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Swal.fire("Cancelled!", "Application has been cancelled.", "success");
            refetch();
        } catch (err) {
            Swal.fire("Error!", "Failed to cancel application.", "error");
        }
    };

    // Submit feedback
    const submitFeedback = async () => {
        try {
            const token = await getToken();
            await axios.patch(
                `https://server-bloodbridge.vercel.app/applied-scholarships/${selectedApplication._id}/feedback`,
                { feedback: feedbackText },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Swal.fire("Success!", "Feedback submitted successfully.", "success");
            setFeedbackOpen(false);
            setFeedbackText("");
            refetch();
        } catch (err) {
            Swal.fire("Error!", "Failed to submit feedback.", "error");
        }
    };

    if (isLoading)
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-gray-500 text-xl">Loading...</div>
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500 text-xl">Error loading applications.</div>
            </div>
        );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-extrabold mb-6 text-gray-800">
                All Applied Scholarships
            </h2>

            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-3 text-gray-600 uppercase text-sm tracking-wider">
                                Applicant
                            </th>
                            <th className="text-left px-4 py-3 text-gray-600 uppercase text-sm tracking-wider">
                                Email
                            </th>
                            <th className="text-left px-4 py-3 text-gray-600 uppercase text-sm tracking-wider">
                                Scholarship
                            </th>
                            <th className="text-left px-4 py-3 text-gray-600 uppercase text-sm tracking-wider">
                                Applied Date
                            </th>
                            <th className="text-left px-4 py-3 text-gray-600 uppercase text-sm tracking-wider">
                                Status
                            </th>
                            <th className="text-center px-4 py-3 text-gray-600 uppercase text-sm tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((app, idx) => (
                            <tr
                                key={app._id}
                                className={`transition duration-300 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    } hover:bg-gray-100`}
                            >
                                <td className="px-4 py-3 text-gray-700 font-medium">
                                    {app.userName}
                                </td>
                                <td className="px-4 py-3 text-gray-700">{app.userEmail}</td>
                                <td className="px-4 py-3 text-gray-700">
                                    {app.scholarship?.title || "N/A"}
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                    {new Date(app.appliedDate).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`px-2 py-1 rounded-full text-sm font-semibold ${app.status === "pending"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : app.status === "approved"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {app.status || "pending"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 flex justify-center gap-2">
                                    <button
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md shadow-sm transition"
                                        onClick={() => {
                                            setSelectedApplication(app);
                                            setDetailsOpen(true);
                                        }}
                                    >
                                        Details
                                    </button>
                                    <button
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md shadow-sm transition"
                                        onClick={() => {
                                            setSelectedApplication(app);
                                            setFeedbackOpen(true);
                                            setFeedbackText(app.feedback || "");
                                        }}
                                    >
                                        Feedback
                                    </button>
                                    <button
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md shadow-sm transition"
                                        onClick={() => cancelApplication(app._id)}
                                    >
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Details Modal */}
            {detailsOpen && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative animate-fadeIn">
                        <button
                            className="absolute top-2 right-2 text-gray-500 text-lg hover:text-gray-700"
                            onClick={() => setDetailsOpen(false)}
                        >
                            ✖
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-gray-800">
                            Application Details
                        </h3>
                        <div className="space-y-2 text-gray-700">
                            <p>
                                <strong>Applicant:</strong> {selectedApplication.userName}
                            </p>
                            <p>
                                <strong>Email:</strong> {selectedApplication.userEmail}
                            </p>
                            <p>
                                <strong>University:</strong>{" "}
                                {selectedApplication.scholarship?.universityName || "N/A"}
                            </p>
                            <p>
                                <strong>Degree:</strong>{" "}
                                {selectedApplication.scholarship?.degree || "N/A"}
                            </p>
                            <p>
                                <strong>Scholarship Category:</strong>{" "}
                                {selectedApplication.scholarship?.category || "N/A"}
                            </p>
                            <p>
                                <strong>Status:</strong> {selectedApplication.status}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Feedback Modal */}
            {feedbackOpen && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative animate-fadeIn">
                        <button
                            className="absolute top-2 right-2 text-gray-500 text-lg hover:text-gray-700"
                            onClick={() => setFeedbackOpen(false)}
                        >
                            ✖
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-gray-800">
                            Submit Feedback
                        </h3>
                        <textarea
                            className="w-full border rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
                            rows={5}
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="Write feedback here..."
                        />
                        <button
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm transition"
                            onClick={submitFeedback}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
