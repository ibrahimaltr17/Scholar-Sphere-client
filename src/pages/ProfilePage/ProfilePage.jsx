import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { showSuccess, showError } from "../../utility/sweetAlert";
import Loading from "../Loading/Loading"

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get("/get-user-info")
        .then(({ data }) => {
          setProfile(data);
          setFormData({
            name: data.name || "",
            email: data.email || "",
            avatar: data.image || "", // map "image" to "avatar"
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

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = async () => {
    try {
      const updateData = {
        name: formData.name,
        image: formData.avatar, // send as "image" to backend
      };
      const res = await axiosSecure.patch("/update-user-profile", updateData);
      if (res.data.modifiedCount || res.data.matchedCount) {
        showSuccess("Success", "Profile updated successfully!");
        setProfile((prev) => ({ ...prev, ...updateData }));
        setIsEditing(false);
      } else {
        showError("No changes made");
      }
    } catch {
      showError("Failed to update profile");
    }
  };

  if (loading) return <Loading></Loading>;
  if (!profile) return <p className="text-center mt-10">No profile data found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 bg-white rounded-xl shadow-md mt-20">
      <h2 className="text-3xl font-bold mb-6 text-center">My Profile</h2>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center md:items-start gap-4 w-full md:w-1/3">
          {formData.avatar ? (
            <img
              src={formData.avatar}
              alt="avatar"
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-lg font-medium border-2 border-gray-300">
              No Avatar
            </div>
          )}
          {isEditing && (
            <input
              type="url"
              name="avatar"
              placeholder="Avatar image URL"
              value={formData.avatar}
              onChange={handleInputChange}
              className="input input-bordered w-full max-w-xs"
            />
          )}
        </div>

        {/* Form Section */}
        <div className="flex-1 w-full">
          <form className="flex flex-col gap-5">
            {/* Name */}
            <div>
              <label className="block font-semibold mb-1">Name</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="input input-bordered w-full"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                disabled
                className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="btn btn-primary flex-1"
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleSaveClick}
                    className="btn btn-success flex-1"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn btn-outline flex-1"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
