import { useState } from "react";
import { FaEdit, FaTrash, FaInfoCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import EditScholarshipModal from "../../components/EditScholarshipModal/EditScholarshipModal";

export default function ManageScholarships() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ✅ Fetch scholarships
  const { data: scholarships = [], isLoading, isError } = useQuery({
    queryKey: ["scholarships"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/scholarships");
      return data || [];
    },
  });

  // ✅ Delete scholarship
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This scholarship will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/scholarships/${id}`);
        Swal.fire("Deleted!", "Scholarship has been deleted.", "success");
        queryClient.invalidateQueries(["scholarships"]);
      } catch (err) {
        Swal.fire("Error!", "Failed to delete scholarship.", "error");
      }
    }
  };

  // ✅ Edit scholarship
  const handleEdit = (scholarship) => {
    setSelectedScholarship(scholarship);
    setIsEditing(true);
  };

  // ✅ Update scholarship
  const handleUpdate = async (updatedScholarship) => {
    setIsSaving(true);
    try {
      const { _id, ...updateData } = updatedScholarship; // remove _id

      await axiosSecure.patch(`/scholarships/${_id}`, updateData);

      Swal.fire("Updated!", "Scholarship updated successfully.", "success");
      setIsEditing(false);
      queryClient.invalidateQueries(["scholarships"]);
    } catch (err) {
      console.error("Update Error:", err.response?.data || err.message);
      Swal.fire("Error!", "Failed to update scholarship.", "error");
    } finally {
      setIsSaving(false);
    }
  };



  if (isLoading) return <p className="p-6">Loading scholarships...</p>;
  if (isError) return <p className="p-6 text-red-600">Failed to load scholarships.</p>;
  if (!scholarships.length) return <p className="p-6">No scholarships found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Manage Scholarships</h2>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-[#10B981] text-white">
            <tr>
              <th className="py-3 px-6 text-left">Scholarship Name</th>
              <th className="py-3 px-6 text-left">University</th>
              <th className="py-3 px-6 text-left">Subject Category</th>
              <th className="py-3 px-6 text-left">Degree</th>
              <th className="py-3 px-6 text-left">Application Fees</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {scholarships.map((s) => (
              <tr key={s._id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-6">{s.scholarshipName}</td>
                <td className="py-3 px-6">{s.universityName}</td>
                <td className="py-3 px-6">{s.subjectCategory}</td>
                <td className="py-3 px-6">{s.degree}</td>
                <td className="py-3 px-6">{s.applicationFees}</td>
                <td className="py-3 px-6 flex justify-center gap-3">
                  {/* Details */}
                  <button
                    onClick={() =>
                      Swal.fire({
                        title: s.scholarshipName,
                        html: `
                          <p><b>University:</b> ${s.universityName}</p>
                          <p><b>Subject:</b> ${s.subjectCategory}</p>
                          <p><b>Degree:</b> ${s.degree}</p>
                          <p><b>Application Fees:</b> ${s.applicationFees}</p>
                          <p><b>Country:</b> ${s.country}</p>
                          <p><b>City:</b> ${s.city}</p>
                          <p><b>World Rank:</b> ${s.worldRank}</p>
                        `,
                        icon: "info",
                      })
                    }
                    className="text-blue-600 hover:text-blue-800 transition"
                    title="Details"
                  >
                    <FaInfoCircle size={18} />
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleEdit(s)}
                    className="text-green-600 hover:text-green-800 transition"
                    title="Edit"
                  >
                    <FaEdit size={18} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Delete"
                  >
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Edit Modal */}
      {isEditing && selectedScholarship && (
        <EditScholarshipModal
          scholarship={selectedScholarship}
          onClose={() => setIsEditing(false)}
          onUpdate={handleUpdate}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
