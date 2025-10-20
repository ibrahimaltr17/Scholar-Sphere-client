import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { showSuccess, showError } from "../../utility/sweetAlert";
import Loading from "../Loading/Loading";
import { FaEdit, FaTimes, FaCheck } from "react-icons/fa";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    avatar: "",
    address: "",
    bio: "",
  });

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get("/get-user-info")
        .then(({ data }) => {
          setProfile(data);
          setFormData({
            name: data.name || "",
            avatar: data.image || "",
            address: data.address || "",
            bio: data.bio || "",
          });
          setLoading(false);
        })
        .catch(() => {
          showError("Failed to fetch profile");
          setLoading(false);
        });
    }
  }, [user, axiosSecure]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updateData = {
        name: formData.name,
        image: formData.avatar,
        address: formData.address,
        bio: formData.bio,
      };
      const res = await axiosSecure.patch("/update-user-profile", updateData);
      if (res.data.modifiedCount || res.data.matchedCount) {
        showSuccess("Success", "Profile updated successfully!");
        setProfile((prev) => ({ ...prev, ...updateData }));
        setIsModalOpen(false);
      } else {
        showError("No changes made");
      }
    } catch {
      showError("Failed to update profile");
    }
  };

  if (loading) return <Loading />;
  if (!profile) return <p className="text-center mt-10">No profile data found.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg">
      <div className="flex flex-col items-center gap-4">
        {/* Avatar */}
        {profile.image ? (
          <img
            src={profile.image}
            alt="avatar"
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
          />
        ) : (
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xl border-2 border-gray-300">
            👤
          </div>
        )}

        {/* Name */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          {profile.name || "Anonymous"} <span>✨</span>
        </h1>

        {/* Email */}
        <p className="text-gray-600 text-sm md:text-base">📧 {profile.email}</p>

        {/* Address */}
        <p className="text-gray-600 text-sm md:text-base">📍 {profile.address || "Not added"}</p>

        {/* Bio / Description */}
        <p className="text-gray-700 text-center text-sm md:text-base mt-2">
          {profile.bio || "No bio added yet. Add something about yourself!"}
        </p>

        {/* Edit Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <FaEdit /> Edit Profile
        </button>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 md:w-1/2 rounded-xl p-6 relative shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Profile ✏️</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              <FaTimes />
            </button>

            <div className="flex flex-col gap-4">
              <label className="flex flex-col">
                Name
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input input-bordered mt-1"
                />
              </label>

              <label className="flex flex-col">
                Avatar URL
                <input
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                  className="input input-bordered mt-1"
                />
              </label>

              <label className="flex flex-col">
                Address
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="input input-bordered mt-1"
                />
              </label>

              <label className="flex flex-col">
                Bio
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="input input-bordered mt-1 resize-none"
                />
              </label>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600"
                >
                  <FaCheck /> Save
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
