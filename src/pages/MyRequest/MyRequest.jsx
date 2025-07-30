import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Loading from "../Loading/Loading"; 

const STATUS_OPTIONS = ["all", "pending", "inprogress", "done", "canceled"];

const MyRequest = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchRequests = async () => {
      try {
        setLoading(true);
        const idToken = await user.getIdToken();
        const res = await axios.get(
          `https://server-bloodbridge.vercel.app/requests?requesterEmail=${user.email}`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );
        setRequests(res.data);
      } catch (error) {
        console.error("Failed to fetch donation requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  const filteredRequests =
    filteredStatus === "all"
      ? requests
      : requests.filter((req) => req.status === filteredStatus);

  const handleStatusChange = (e) => {
    setFilteredStatus(e.target.value);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">My Donation Requests</h2>

      {/* Filter */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <label htmlFor="statusFilter" className="font-semibold mr-2">
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={filteredStatus}
            onChange={handleStatusChange}
            className="select select-bordered w-40"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-gray-600">
          Showing {filteredRequests.length} request(s)
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full min-w-[700px]">
          <thead>
            <tr>
              <th>#</th>
              <th>Recipient</th>
              <th>Blood Group</th>
              <th>District</th>
              <th>Upazila</th>
              <th>Hospital</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-6">
                  No donation requests found.
                </td>
              </tr>
            ) : (
              filteredRequests.map((req, idx) => (
                <tr key={req._id}>
                  <td>{idx + 1}</td>
                  <td>{req.recipientName}</td>
                  <td>{req.bloodGroup}</td>
                  <td>{req.district}</td>
                  <td>{req.upazila}</td>
                  <td>{req.hospital}</td>
                  <td>{new Date(req.date).toLocaleDateString()}</td>
                  <td>{req.time}</td>
                  <td>
                    <span
                      className={`badge ${
                        req.status === "pending"
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyRequest;
