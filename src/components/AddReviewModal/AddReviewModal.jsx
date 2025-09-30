import { useState } from "react";
import axios from "axios";

const BACKEND_URL = "https://your-backend-domain.com"; // your backend URL directly

export default function AddReviewModal({ scholarship, user, onClose, onReviewAdded }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rating || !comment) {
            setError("Rating and comment are required");
            return;
        }

        setLoading(true);
        setError("");

        const reviewData = {
            scholarshipId: scholarship._id,
            scholarshipName: scholarship.name,
            universityName: scholarship.universityName,
            universityId: scholarship.universityId || "", // if you have universityId
            rating,
            comment,
            reviewDate: new Date(),
            userName: user.name,
            userEmail: user.email,
            userImage: user.image || null,
        };

        try {
            await axios.post(`${BACKEND_URL}/reviews`, reviewData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Firebase token
                },
            });
            setLoading(false);
            onReviewAdded(); // refresh reviews list in parent
            onClose(); // close modal
        } catch (err) {
            console.error(err);
            setLoading(false);
            setError("Failed to submit review. Try again.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-[400px] max-w-full">
                <h2 className="text-xl font-semibold mb-4">Add Review</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2">
                        Rating (1-5):
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className="w-full border p-2 rounded mt-1"
                        />
                    </label>
                    <label className="block mb-4">
                        Comment:
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full border p-2 rounded mt-1"
                            rows={4}
                        />
                    </label>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
