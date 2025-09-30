import { useEffect, useState } from "react";
import axios from "axios";

export default function ReviewCarousel({ scholarshipId }) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(
                    `https://server-bloodbridge.vercel.app/reviews/${scholarshipId}`
                );
                setReviews(res.data);
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
            }
        };
        fetchReviews();
    }, [scholarshipId]);

    if (!reviews || reviews.length === 0) return <p className="text-center py-6">No reviews yet.</p>;

    return (
        <div className="max-w-6xl mx-auto py-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Student Reviews</h2>

            <div className="carousel w-full space-x-4 overflow-x-auto scroll-smooth">
                {reviews.map((review) => (
                    <div key={review._id} className="carousel-item w-80 flex-shrink-0">
                        <div className="card bg-white shadow-md rounded-lg p-4">
                            <div className="flex items-center mb-3">
                                <div className="avatar">
                                    <div className="w-12 h-12 rounded-full">
                                        <img
                                            src={review.userImage || "https://via.placeholder.com/50"}
                                            alt={review.userName}
                                        />
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <h3 className="font-semibold">{review.userName}</h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(review.reviewDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="mb-2">
                                <span className="text-yellow-500 font-semibold">Rating: {review.rating}/5</span>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
