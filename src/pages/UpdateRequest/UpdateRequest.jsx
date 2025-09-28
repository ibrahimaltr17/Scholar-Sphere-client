import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import districts from "../../json/districts.json";
import upazilas from "../../json/upazilas.json";
import Loading from "../Loading/Loading";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const UpdateRequest = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    recipientName: "",
    district: "",
    upazila: "",
    hospital: "",
    bloodGroup: "",
    date: "",
    time: ""
  });

  const [loading, setLoading] = useState(true);

  // Fetch existing request data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await user.getIdToken();
        const res = await axios.get(`https://server-bloodbridge.vercel.app/requests/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = res.data;
        setFormData({
          recipientName: data.recipientName,
          district: data.district,
          upazila: data.upazila,
          hospital: data.hospital,
          bloodGroup: data.bloodGroup,
          date: data.date?.split("T")[0], // format YYYY-MM-DD
          time: data.time
        });
      } catch (error) {
        console.error("Failed to fetch request", error);
        Swal.fire("Error", "Unable to load request data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await user.getIdToken();
      await axios.patch(
        `https://server-bloodbridge.vercel.app/requests/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      Swal.fire("Updated", "Donation request updated successfully!", "success");
      navigate("/dashboard/my-donation-requests");
    } catch (error) {
      console.error("Update failed", error);
      Swal.fire("Error", "Failed to update the request", "error");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Donation Request</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label">Recipient Name</label>
          <input
            type="text"
            name="recipientName"
            value={formData.recipientName}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="label">Blood Group</label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option disabled value="">Select Blood Group</option>
            {bloodGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">District</label>
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option disabled value="">Select District</option>
            {districts.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Upazila</label>
          <select
            name="upazila"
            value={formData.upazila}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option disabled value="">Select Upazila</option>
            {upazilas
              .filter((u) => u.district_name === formData.district)
              .map((u) => (
                <option key={u.name} value={u.name}>
                  {u.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="label">Hospital</label>
          <input
            type="text"
            name="hospital"
            value={formData.hospital}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="label">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="label">Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="md:col-span-2 flex justify-end mt-4">
          <button className="btn btn-primary px-8">Update Donation Request</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateRequest;
