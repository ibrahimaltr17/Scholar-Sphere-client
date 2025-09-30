import { useState } from "react";

export default function EditScholarshipModal({ scholarship, onClose, onUpdate, isSaving }) {
  const [formData, setFormData] = useState({ ...scholarship });

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData._id) {
      console.error("❌ Scholarship _id is missing!");
      return;
    }

    // Convert dates to proper ISO format before sending to backend
    const updatedData = {
      ...formData,
      applicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline) : null,
      postDate: formData.postDate ? new Date(formData.postDate) : null,
    };

    onUpdate(updatedData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <h3 className="text-2xl font-semibold mb-6 text-center">Edit Scholarship</h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Scholarship Name */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Scholarship Name</label>
            <input
              type="text"
              value={formData.scholarshipName || ""}
              onChange={(e) => handleChange("scholarshipName", e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          {/* University Name */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">University Name</label>
            <input
              type="text"
              value={formData.universityName || ""}
              onChange={(e) => handleChange("universityName", e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          {/* University Logo/Image */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">University Logo/Image</label>
            <input
              type="text"
              placeholder="Click to upload image"
              value={formData.universityImage || ""}
              onChange={(e) => handleChange("universityImage", e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          {/* Country */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Country</label>
            <input
              type="text"
              value={formData.country || ""}
              onChange={(e) => handleChange("country", e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          {/* City */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">City</label>
            <input
              type="text"
              value={formData.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          {/* World Rank */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">University World Rank</label>
            <input
              type="text"
              value={formData.worldRank || ""}
              onChange={(e) => handleChange("worldRank", e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          {/* Subject Category */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Subject Category</label>
            <select
              value={formData.subjectCategory || ""}
              onChange={(e) => handleChange("subjectCategory", e.target.value)}
              className="border p-2 rounded"
            >
              <option value="Agriculture">Agriculture</option>
              <option value="Engineering">Engineering</option>
              <option value="Doctor">Doctor</option>
            </select>
          </div>

          {/* Scholarship Category */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Scholarship Category</label>
            <select
              value={formData.scholarshipCategory || ""}
              onChange={(e) => handleChange("scholarshipCategory", e.target.value)}
              className="border p-2 rounded"
            >
              <option value="Full fund">Full fund</option>
              <option value="Partial">Partial</option>
              <option value="Self-fund">Self-fund</option>
            </select>
          </div>

          {/* Degree */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Degree</label>
            <select
              value={formData.degree || ""}
              onChange={(e) => handleChange("degree", e.target.value)}
              className="border p-2 rounded"
            >
              <option value="Diploma">Diploma</option>
              <option value="Bachelor">Bachelor</option>
              <option value="Masters">Masters</option>
            </select>
          </div>

          {/* Tuition Fees */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Tuition Fees (optional)</label>
            <input
              type="text"
              value={formData.tuitionFees || ""}
              onChange={(e) => handleChange("tuitionFees", e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          {/* Application Fees */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Application Fees</label>
            <input
              type="text"
              value={formData.applicationFees || ""}
              onChange={(e) => handleChange("applicationFees", e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          {/* Service Charge */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Service Charge</label>
            <input
              type="text"
              value={formData.serviceCharge || ""}
              onChange={(e) => handleChange("serviceCharge", e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          {/* Application Deadline */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Application Deadline</label>
            <input
              type="date"
              value={
                formData.applicationDeadline
                  ? new Date(formData.applicationDeadline).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => handleChange("applicationDeadline", e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          {/* Post Date */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Post Date</label>
            <input
              type="date"
              value={
                formData.postDate
                  ? new Date(formData.postDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => handleChange("postDate", e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
