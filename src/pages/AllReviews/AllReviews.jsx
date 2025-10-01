import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuth, getIdToken } from "firebase/auth";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

export default function AllReviews() {
    const queryClient = useQueryClient();
    const auth = getAuth();

    const [userRole, setUserRole] = useState("user"); // default role

    // ✅ Fetch user role
    useEffect(() => {
        const fetchRole = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const token = await getIdToken(user);
            try {
                const res = await fetch("https://server-bloodbridge.vercel.app/get-user-role", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setUserRole(data.role || "user");
            } catch (err) {
                console.error("Failed to fetch user role:", err);
            }
        };

        fetchRole();
    }, [auth.currentUser]);

    // ✅ Fetch all reviews
    const { data: reviews = [], isLoading, isError } = useQuery({
        queryKey: ["all-reviews"],
        queryFn: async () => {
            const user = auth.currentUser;
            if (!user) throw new Error("User not logged in");

            const token = await getIdToken(user);

            const res = await fetch("https://server-bloodbridge.vercel.app/all-reviews", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

            return res.json();
        },
    });

    // ✅ Delete review (only for admin/mod)
    const handleDelete = async (id) => {
        if (userRole !== "admin" && userRole !== "moderator") {
            Swal.fire("Unauthorized", "Only admins or moderators can delete reviews.", "error");
            return;
        }

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This review will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                const user = auth.currentUser;
                const token = await getIdToken(user);

                await fetch(`https://server-bloodbridge.vercel.app/reviews/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });

                // ✅ Optimistic update: remove from local cache immediately
                queryClient.setQueryData(["all-reviews"], (oldData) =>
                    oldData.filter((review) => review._id !== id)
                );

                Swal.fire("Deleted!", "Review deleted successfully.", "success");
            } catch (err) {
                Swal.fire("Error!", "Failed to delete review.", "error");
            }
        }
    };


    if (isLoading) return <p className="p-6">Loading reviews...</p>;
    if (isError) return <p className="p-6 text-red-600">Failed to load reviews.</p>;
    if (!reviews.length) return <p className="p-6">No reviews found.</p>;

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">All Reviews</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                    <div key={review._id} className="card bg-white shadow-xl p-5 border rounded-xl">
                        <h3 className="text-xl font-semibold text-red-600 mb-2">{review.universityName}</h3>
                        <p className="text-gray-600 text-sm mb-3">Subject: {review.subjectCategory}</p>

                        <div className="flex items-center gap-3 mb-3">
                            <img
                                src={review.userImage || review.reviewerImage || "/default-avatar.png"}
                                alt={review.userName || review.reviewerName || "Anonymous"}
                                className="w-12 h-12 rounded-full object-cover border"
                            />
                            <div>
                                <p className="font-medium">{review.userName || review.reviewerName || "Anonymous"}</p>
                                <p className="text-xs text-gray-500">{new Date(review.reviewDate || review.date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <p className="text-yellow-600 font-semibold mb-2">⭐ {review.rating} / 5</p>
                        <p className="text-gray-700 mb-4">{review.comment || review.comments}</p>

                        {(userRole === "admin" || userRole === "moderator") && (
                            <button
                                onClick={() => handleDelete(review._id)}
                                className="btn btn-error w-full text-white"
                            >
                                Delete Review
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
