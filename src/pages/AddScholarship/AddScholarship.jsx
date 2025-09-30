import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { showSuccess, showError } from "../../utility/sweetAlert";

const AddScholarship = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    scholarshipName: "",
    universityName: "",
    universityImage: "",
    country: "",
    city: "",
    worldRank: "",
    subjectCategory: "",
    scholarshipCategory: "",
    degree: "",
    tuitionFees: "0",        // ✅ default numeric
    applicationFees: "0",    // ✅ default numeric
    serviceCharge: "0",      // ✅ default numeric
    applicationDeadline: "",
    postDate: new Date().toISOString().split("T")[0],
    postedBy: user?.email || "",
  });
  const [uploading, setUploading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Image Upload to ImgBB
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        { method: "POST", body: data }
      );
      const result = await res.json();

      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          universityImage: result.data.display_url,
        }));
        showSuccess("Image Uploaded", "University image uploaded successfully!");
      } else {
        showError("Upload Failed", "Could not upload image. Try again.");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      showError("Upload Failed", "Could not upload image. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📦 Scholarship Form Data:", formData);

    try {
      const token = await user.getIdToken(); // get Firebase ID token

      const res = await axios.post(
        "https://server-bloodbridge.vercel.app/scholarships",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ important
          },
        }
      );

      if (res.data.insertedId) {
        showSuccess("Success", "Scholarship added successfully!");
        // Reset form
        setFormData({
          scholarshipName: "",
          universityName: "",
          universityImage: "",
          country: "",
          city: "",
          worldRank: "",
          subjectCategory: "",
          scholarshipCategory: "",
          degree: "",
          tuitionFees: "0",
          applicationFees: "0",
          serviceCharge: "0",
          applicationDeadline: "",
          postDate: new Date().toISOString().split("T")[0],
          postedBy: user?.email || "",
        });
      }
    } catch (error) {
      console.error(error);
      showError("Failed to add scholarship", error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Add Scholarship</h2>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {/* Scholarship Name */}
        <div>
          <label className="block font-semibold mb-1">Scholarship Name</label>
          <input
            name="scholarshipName"
            type="text"
            value={formData.scholarshipName}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* University Name */}
        <div>
          <label className="block font-semibold mb-1">University Name</label>
          <input
            name="universityName"
            type="text"
            value={formData.universityName}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* University Image */}
        <div>
          <label className="block font-semibold mb-1">University Logo/Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-full"
          />
          {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
          {formData.universityImage && (
            <img
              src={formData.universityImage}
              alt="University"
              className="w-32 h-32 mt-2 object-cover rounded-md"
            />
          )}
        </div>

        {/* Country & City */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Country</label>
            <input
              name="country"
              type="text"
              value={formData.country}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">City</label>
            <input
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
        </div>

        {/* World Rank */}
        <div>
          <label className="block font-semibold mb-1">University World Rank</label>
          <input
            name="worldRank"
            type="number"
            value={formData.worldRank}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        {/* Subject Category */}
        <div>
          <label className="block font-semibold mb-1">Subject Category</label>
          <select
            name="subjectCategory"
            value={formData.subjectCategory}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Subject</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Engineering">Engineering</option>
            <option value="Doctor">Doctor</option>
          </select>
        </div>

        {/* Scholarship Category */}
        <div>
          <label className="block font-semibold mb-1">Scholarship Category</label>
          <select
            name="scholarshipCategory"
            value={formData.scholarshipCategory}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Category</option>
            <option value="Full fund">Full fund</option>
            <option value="Partial">Partial</option>
            <option value="Self-fund">Self-fund</option>
          </select>
        </div>

        {/* Degree */}
        <div>
          <label className="block font-semibold mb-1">Degree</label>
          <select
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Degree</option>
            <option value="Diploma">Diploma</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Masters">Masters</option>
          </select>
        </div>

        {/* Fees */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Tuition Fees (Optional)</label>
            <input
              name="tuitionFees"
              type="number"
              value={formData.tuitionFees}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Application Fees</label>
            <input
              name="applicationFees"
              type="number"
              value={formData.applicationFees}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Service Charge</label>
            <input
              name="serviceCharge"
              type="number"
              value={formData.serviceCharge}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
        </div>

        {/* Deadlines */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Application Deadline</label>
            <input
              name="applicationDeadline"
              type="date"
              value={formData.applicationDeadline}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Scholarship Post Date</label>
            <input
              name="postDate"
              type="date"
              value={formData.postDate}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
        </div>

        {/* Posted By */}
        <div>
          <label className="block font-semibold mb-1">Posted By</label>
          <input
            name="postedBy"
            type="email"
            value={formData.postedBy}
            disabled
            className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary mt-4 w-full"
          disabled={uploading}
        >
          {uploading ? "Uploading Image..." : "Add Scholarship"}
        </button>
      </form>
    </div>
  );
};

export default AddScholarship;
