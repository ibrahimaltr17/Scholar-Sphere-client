import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Loading from "../../pages/Loading/Loading";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const RecentDonationRequests = () => {
    const { user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.email) return;

        const fetchRecentRequests = async () => {
            try {
                setLoading(true);
                const token = await user.getIdToken();
                const res = await axios.get(
                    `https://server-bloodbridge.vercel.app/requests?requesterEmail=${user.email}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const sorted = res.data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setRequests(sorted.slice(0, 3));
            } catch (error) {
                console.error("Error fetching recent donation requests:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentRequests();
    }, [user]);

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this donation request!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });

        if (confirm.isConfirmed) {
            try {
                await axios.delete(`https://server-bloodbridge.vercel.app/requests/${id}`);
                setRequests(prev => prev.filter(r => r._id !== id));
                Swal.fire("Deleted!", "The donation request has been deleted.", "success");
            } catch (error) {
                Swal.fire("Error", "Failed to delete the request.", "error");
            }
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.patch(`https://server-bloodbridge.vercel.app/requests/${id}`, {
                status: newStatus,
            });
            setRequests((prev) =>
                prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
            );
        } catch (error) {
            Swal.fire("Error", "Failed to update status", "error");
        }
    };

    if (loading) return <Loading />;
    if (!requests.length) return null;

    return (
        <div className="mt-12 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-center text-teal-600">
                Your Recent Donation Requests
            </h2>

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full min-w-[900px]">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Recipient</th>
                            <th>Location</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Blood Group</th>
                            <th>Status</th>
                            <th>user Info</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req, idx) => (
                            <tr key={req._id}>
                                <td>{idx + 1}</td>
                                <td>{req.recipientName}</td>
                                <td>{req.district}, {req.upazila}</td>
                                <td>{new Date(req.date).toLocaleDateString()}</td>
                                <td>{req.time}</td>
                                <td>{req.bloodGroup}</td>
                                <td>
                                    <span
                                        className={`badge ${req.status === "pending"
                                                ? "badge-warning"
                                                : req.status === "inprogress"
                                                    ? "badge-info"
                                                    : req.status === "done"
                                                        ? "badge-success"
                                                        : req.status === "canceled"
                                                            ? "badge-error"
                                                            : "badge-ghost"
                                            }`}
                                    >
                                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                    </span>
                                </td>
                                <td>
                                    {req.status === "inprogress" && req.user ? (
                                        <div className="text-xs leading-tight">
                                            <div>{req.user.name}</div>
                                            <div className="text-gray-500">{req.user.email}</div>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-xs">N/A</span>
                                    )}
                                </td>
                                <td className="flex flex-wrap gap-1">
                                    {req.status === "inprogress" && (
                                        <>
                                            <button
                                                onClick={() => handleStatusChange(req._id, "done")}
                                                className="btn btn-xs btn-success"
                                            >
                                                Done
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(req._id, "canceled")}
                                                className="btn btn-xs btn-error"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}

                                    <button
                                        onClick={() => navigate(`/dashboard/update-donation-request/${req._id}`)}
                                        className="btn btn-xs btn-warning"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(req._id)}
                                        className="btn btn-xs btn-outline"
                                    >
                                        Delete
                                    </button>

                                    <button
                                        onClick={() => navigate(`/donation-details/${req._id}`)}
                                        className="btn btn-xs btn-primary"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentDonationRequests;
