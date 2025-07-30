import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import districtsData from "../../json/districts.json";
import upazilasData from "../../json/upazilas.json";
import { showError, showSuccess } from "../../utility/sweetAlert";
import axios from "axios";
import { useNavigate } from "react-router";

const CreateRequest = () => {
  const { user } = useContext(AuthContext); // only Firebase user available
  const navigate = useNavigate();

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);

  const [formData, setFormData] = useState({
    requesterName: user?.displayName || "",
    requesterEmail: user?.email || "",
    recipientName: "",
    district: "",
    upazila: "",
    hospital: "",
    address: "",
    bloodGroup: "",
    date: "",
    time: "",
    message: "",
  });

  useEffect(() => {
    setDistricts(districtsData);
    setUpazilas(upazilasData);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setFormData((prev) => ({ ...prev, district: selectedDistrict, upazila: "" }));

    const districtObj = districts.find((d) => d.name === selectedDistrict);
    const districtId = districtObj ? districtObj.id : null;
    setSelectedDistrictId(districtId);

    if (districtId) {
      const filtered = upazilas.filter((u) => u.district_id === districtId);
      setFilteredUpazilas(filtered);
    } else {
      setFilteredUpazilas([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const request = {
      ...formData,
      requesterEmail: user?.email || "",
      requesterName: user?.displayName || "",
      status: "pending",
      requesterPhoto: user?.photoURL || "",
      createdAt: new Date(),
    };

    console.log("Sending request:", request);

    try {
      const idToken = await user.getIdToken();

      const res = await axios.post("https://server-bloodbridge.vercel.app/requests", request, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (res.data.insertedId) {
        showSuccess("Donation request created successfully!");
        navigate("/dashboard/my-donation-requests");
      }
    } catch (err) {
      console.error("❌ Request creation failed:", err?.response?.data || err.message);
      showError("Failed to create request. Try again.");
    }
  };



  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Donation Request</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* requesterName and Email are readonly */}
        <div>
          <label className="label">Requester Name</label>
          <input
            type="text"
            value={user?.displayName || ""}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Requester Email</label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        {/* Rest of the inputs */}
        <div>
          <label className="label">Recipient Name</label>
          <input
            type="text"
            name="recipientName"
            value={formData.recipientName}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Blood Group</label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
            className="select select-bordered w-full"
          >
            <option value="">Select</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Recipient District</label>
          <select
            name="district"
            value={formData.district}
            onChange={handleDistrictChange}
            required
            className="select select-bordered w-full"
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Recipient Upazila</label>
          <select
            name="upazila"
            value={formData.upazila}
            onChange={handleChange}
            required
            className="select select-bordered w-full"
          >
            <option value="">Select Upazila</option>
            {filteredUpazilas.map((up) => (
              <option key={up.id} value={up.name}>
                {up.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Hospital Name</label>
          <input
            type="text"
            name="hospital"
            value={formData.hospital}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
            placeholder="e.g. Dhaka Medical College Hospital"
          />
        </div>

        <div>
          <label className="label">Full Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
            placeholder="e.g. Zahir Raihan Rd, Dhaka"
          />
        </div>

        <div>
          <label className="label">Donation Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Donation Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
        </div>

        <div className="md:col-span-2">
          <label className="label">Request Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="textarea textarea-bordered w-full h-28"
            placeholder="Explain why you need the blood..."
          ></textarea>
        </div>

        <div className="md:col-span-2 text-center mt-4">
          <button type="submit" className="btn btn-primary w-1/2">
            Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRequest;
