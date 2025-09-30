import { useEffect, useState } from "react";
import { getAuth, getIdToken } from "firebase/auth";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../Loading/Loading";

export default function MyReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingReview, setEditingReview] = useState(null); // review being edited
    const auth = getAuth();

    // Fetch user's reviews
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const user = auth.currentUser;
                if (!user) throw new Error("User not logged in");

                const token = await getIdToken(user);

                const res = await axios.get(
                    "https://server-bloodbridge.vercel.app/my-reviews",
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setReviews(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
                Swal.fire("Error", err.message || "Failed to load reviews", "error");
            }
        };

        fetchReviews();
    }, [auth]);

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Delete Review?",
            text: "Are you sure you want to delete this review?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
        });

        if (confirm.isConfirmed) {
            try {
                const user = auth.currentUser;
                const token = await getIdToken(user);

                await axios.delete(`https://server-bloodbridge.vercel.app/reviews/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setReviews((prev) => prev.filter((rev) => rev._id !== id));

                Swal.fire("Deleted!", "Your review has been deleted.", "success");
            } catch (err) {
                console.error(err);
                Swal.fire("Error", err.message || "Failed to delete review", "error");
            }
        }
    };

    const handleEditClick = (review) => {
        setEditingReview(review); // open modal with review data
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = auth.currentUser;
            const token = await getIdToken(user);

            await axios.patch(
                `https://server-bloodbridge.vercel.app/reviews/${editingReview._id}`,
                { rating: editingReview.rating, comment: editingReview.comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update local state
            setReviews((prev) =>
                prev.map((rev) => (rev._id === editingReview._id ? editingReview : rev))
            );

            setEditingReview(null);
            Swal.fire("Success", "Your review has been updated!", "success");
        } catch (err) {
            console.error(err);
            Swal.fire("Error", err.message || "Failed to update review", "error");
        }
    };

    if (loading) return <Loading />;

    if (!reviews.length)
        return <p className="text-center mt-20 text-gray-500 text-lg">You have not written any reviews yet.</p>;

    return (
        <div className="max-w-7xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">My Reviews</h1>

            <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scholarship</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {reviews.map((rev) => (
                            <tr key={rev._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rev.scholarshipName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rev.universityName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rev.comment}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(rev.reviewDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center space-x-2 flex justify-center">
                                    <button
                                        className="bg-yellow-500 text-white px-4 py-1 rounded-md hover:bg-yellow-600 transition"
                                        onClick={() => handleEditClick(rev)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700 transition"
                                        onClick={() => handleDelete(rev._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Review Modal */}
            {editingReview && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-96 p-6">
                        <h2 className="text-xl font-bold mb-4">Edit Review</h2>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={editingReview.rating}
                                    onChange={(e) =>
                                        setEditingReview({ ...editingReview, rating: Number(e.target.value) })
                                    }
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Comment</label>
                                <textarea
                                    value={editingReview.comment}
                                    onChange={(e) =>
                                        setEditingReview({ ...editingReview, comment: e.target.value })
                                    }
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="bg-gray-400 text-white px-4 py-1 rounded-md hover:bg-gray-500 transition"
                                    onClick={() => setEditingReview(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700 transition"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
