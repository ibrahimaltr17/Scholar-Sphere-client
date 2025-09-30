import { useEffect, useState } from "react";
import { getAuth, getIdToken } from "firebase/auth";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../Loading/Loading";

export default function MyReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentReview, setCurrentReview] = useState(null);

    const auth = getAuth();

    // Fetch user reviews
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
            title: "Delete Review",
            text: "Are you sure you want to delete this review?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
        });

        if (confirm.isConfirmed) {
            try {
                const token = await getIdToken(auth.currentUser);
                await axios.delete(`https://server-bloodbridge.vercel.app/reviews/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                Swal.fire("Deleted!", "Your review has been deleted.", "success");
                setReviews(reviews.filter((r) => r._id !== id));
            } catch (err) {
                console.error(err);
                Swal.fire("Error", err.message || "Failed to delete review", "error");
            }
        }
    };

    const handleEditClick = (review) => {
        setCurrentReview(review);
        setEditModalOpen(true);
    };

    const handleEditSave = async () => {
        try {
            const token = await getIdToken(auth.currentUser);
            await axios.patch(
                `https://server-bloodbridge.vercel.app/reviews/${currentReview._id}`,
                {
                    rating: currentReview.rating,
                    comment: currentReview.comment,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            Swal.fire("Success", "Review updated successfully", "success");
            setReviews(
                reviews.map((r) => (r._id === currentReview._id ? currentReview : r))
            );
            setEditModalOpen(false);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", err.message || "Failed to update review", "error");
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="max-w-7xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">My Reviews</h1>
            {reviews.length === 0 ? (
                <p className="text-center text-gray-500">You have not written any reviews yet.</p>
            ) : (
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
                            {reviews.map((review) => (
                                <tr key={review._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{review.scholarshipName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{review.universityName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{review.comment}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(review.reviewDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center space-x-2 flex justify-center">
                                        <button
                                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                            onClick={() => handleEditClick(review)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                            onClick={() => handleDelete(review._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-96 p-6 relative">
                        <h2 className="text-xl font-semibold mb-4">Edit Review</h2>
                        <label className="block mb-2 text-sm font-medium">Rating</label>
                        <input
                            type="number"
                            min={1}
                            max={5}
                            value={currentReview.rating}
                            onChange={(e) => setCurrentReview({ ...currentReview, rating: Number(e.target.value) })}
                            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                        />
                        <label className="block mb-2 text-sm font-medium">Comment</label>
                        <textarea
                            value={currentReview.comment}
                            onChange={(e) => setCurrentReview({ ...currentReview, comment: e.target.value })}
                            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                onClick={() => setEditModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                onClick={handleEditSave}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
