import { useEffect, useState } from "react";
import { getAuth, getIdToken } from "firebase/auth";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../Loading/Loading";

export default function MyAppliedScholarships() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: "" });

  const auth = getAuth();

  // Fetch applied scholarships
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not logged in");

        const token = await getIdToken(user);

        const res = await axios.get(
          "https://server-bloodbridge.vercel.app/my-applied-scholarships",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setApplications(res.data);
        setLoading(false);
      } catch (err) {
        console.error("AxiosError", err);
        setLoading(false);
        Swal.fire("Error", err.message || "Failed to load applications", "error");
      }
    };

    fetchApplications();
  }, [auth]);

  const handleCancel = async (appId) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Cancel Application",
      text: "Are you sure you want to cancel this application?",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "No",
    });

    if (confirm.isConfirmed) {
      try {
        const user = auth.currentUser;
        const token = await getIdToken(user);

        await axios.patch(
          `https://server-bloodbridge.vercel.app/cancel-application/${appId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire("Cancelled!", "Your application has been cancelled.", "success");

        setApplications((prev) =>
          prev.map((app) =>
            app._id === appId ? { ...app, status: "Rejected" } : app
          )
        );
      } catch (err) {
        console.error(err);
        Swal.fire("Error", err.message || "Failed to cancel application", "error");
      }
    }
  };

  const handleEdit = (app) => {
    if (app.status !== "pending") {
      Swal.fire("Cannot Edit", "Application is already processing or completed.", "info");
      return;
    }
    window.location.href = `/apply-scholarship/${app.scholarshipId}`;
  };

  const handleDetails = (app) => {
    window.location.href = `/scholarship/${app.scholarshipId}`;
  };

  const handleAddReview = (app) => {
    setSelectedApp(app);
    setReviewData({ rating: 0, comment: "" });
    setShowModal(true);
  };

  const submitReview = async () => {
    if (!reviewData.rating || !reviewData.comment.trim()) {
      Swal.fire("Error", "Please provide rating and comment", "warning");
      return;
    }

    try {
      const user = auth.currentUser;
      const token = await getIdToken(user);

      const payload = {
        scholarshipId: selectedApp.scholarship._id,
        scholarshipName: selectedApp.scholarship.name,
        universityName: selectedApp.scholarship.universityName,
        universityId: selectedApp.scholarship.universityId || "",
        rating: reviewData.rating,
        comment: reviewData.comment,
        reviewDate: new Date(),
        userName: user.displayName || "Anonymous",
        userEmail: user.email,
        userImage: user.photoURL || null,
      };

      await axios.post(
        "https://server-bloodbridge.vercel.app/reviews",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire("Success", "Review submitted successfully!", "success");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Failed to submit review", "error");
    }
  };

  if (loading) return <Loading />;

  if (!applications.length) {
    return (
      <p className="text-center mt-20 text-gray-500 text-lg font-medium">
        You have not applied for any scholarships yet.
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        My Applied Scholarships
      </h1>
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                University Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                Subject Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                Applied Degree
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                Application Fees
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((app) => (
              <tr key={app._id} className="hover:bg-gray-50 transition duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {app.scholarship.universityName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {app.scholarship.address || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {app.scholarship.subjectCategory}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {app.degree || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${app.scholarship.applicationFees || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                      app.status === "pending"
                        ? "bg-yellow-500"
                        : app.status === "processing"
                        ? "bg-blue-500"
                        : app.status === "completed"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {app.status || "pending"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center space-x-2 flex justify-center flex-wrap gap-2">
                  <button
                    className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition"
                    onClick={() => handleDetails(app)}
                  >
                    Details
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-4 py-1 rounded-md hover:bg-yellow-600 transition"
                    onClick={() => handleEdit(app)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700 transition"
                    onClick={() => handleCancel(app._id)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700 transition"
                    onClick={() => handleAddReview(app)}
                  >
                    Add Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg relative">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Review</h2>
            <p className="mb-2 text-gray-600">
              Scholarship: <span className="font-semibold">{selectedApp.scholarship.name}</span>
            </p>
            <p className="mb-4 text-gray-600">
              University: <span className="font-semibold">{selectedApp.scholarship.universityName}</span>
            </p>

            <label className="block mb-2 font-medium text-gray-700">Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={reviewData.rating}
              onChange={(e) => setReviewData({ ...reviewData, rating: parseInt(e.target.value) })}
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <label className="block mb-2 font-medium text-gray-700">Comment</label>
            <textarea
              rows="4"
              value={reviewData.comment}
              onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                onClick={submitReview}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
