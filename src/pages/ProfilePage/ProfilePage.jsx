import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import districtsData from "../../json/districts.json";
import upazilasData from "../../json/upazilas.json";
import { showSuccess, showError } from "../../utility/sweetAlert";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const ProfilePage = () => {
    const { user } = useContext(AuthContext);
    console.log(user)
    const axiosSecure = useAxiosSecure();

    const [districts] = useState(districtsData);
    const [upazilas] = useState(upazilasData);
    const [filteredUpazilas, setFilteredUpazilas] = useState([]);

    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        avatar: "", // URL or base64 string
        district: "",
        upazila: "",
        blood: "",
    });
    const [loading, setLoading] = useState(true);

    // Fetch user profile on mount
    useEffect(() => {
        if (user?.email) {
            axiosSecure
                .get("/get-user-profile")
                .then(({ data }) => {
                    setProfile(data);
                    setFormData({
                        name: data.name || "",
                        email: data.email || "",
                        avatar: data.avatar || "",
                        district: data.district || "",
                        upazila: data.upazila || "",
                        blood: data.blood || "",
                    });
                    // Filter upazilas for current district
                    const dist = districts.find((d) => d.name === data.district);
                    if (dist) {
                        setFilteredUpazilas(upazilas.filter((u) => u.district_id === dist.id));
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    showError("Failed to fetch profile");
                    setLoading(false);
                });
        }
    }, [user, axiosSecure, districts, upazilas]);

    const handleDistrictChange = (e) => {
        const districtName = e.target.value;
        setFormData((prev) => ({ ...prev, district: districtName, upazila: "" }));
        const districtObj = districts.find((d) => d.name === districtName);
        if (districtObj) {
            setFilteredUpazilas(upazilas.filter((u) => u.district_id === districtObj.id));
        } else {
            setFilteredUpazilas([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            const updateData = {
                name: formData.name,
                avatar: formData.avatar,
                district: formData.district,
                upazila: formData.upazila,
                blood: formData.blood,
            };
            const res = await axiosSecure.patch("/update-profile", updateData);
            if (res.data.modifiedCount) {
                showSuccess("Success", "Profile updated");
                setProfile((prev) => ({ ...prev, ...updateData }));
                setIsEditing(false);
            } else {
                showError("No changes made");
            }
        } catch (err) {
            showError("Failed to update profile");
        }
    };

    if (loading) return <p>Loading profile...</p>;
    if (!profile) return <p>No profile data found.</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">My Profile</h2>

            {/* Avatar (optional preview and upload) */}
            <div className="mb-4">
                <label className="block font-semibold mb-1">Avatar</label>
                {formData.avatar ? (
                    <img
                        src={formData.avatar}
                        alt="avatar"
                        className="w-24 h-24 rounded-full object-cover mb-2"
                    />
                ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-full mb-2 flex items-center justify-center text-gray-400">
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

            <form>
                <div className="mb-4">
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

                <div className="mb-4">
                    <label className="block font-semibold mb-1">Email</label>
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        disabled
                        className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold mb-1">District</label>
                    <select
                        name="district"
                        value={formData.district}
                        onChange={handleDistrictChange}
                        disabled={!isEditing}
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

                <div className="mb-4">
                    <label className="block font-semibold mb-1">Upazila</label>
                    <select
                        name="upazila"
                        value={formData.upazila}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="select select-bordered w-full"
                    >
                        <option value="">Select Upazila</option>
                        {filteredUpazilas.map((u) => (
                            <option key={u.id} value={u.name}>
                                {u.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block font-semibold mb-1">Blood Group</label>
                    <select
                        name="blood"
                        value={formData.blood}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="select select-bordered w-full"
                    >
                        <option value="">Select Blood Group</option>
                        {bloodGroups.map((bg) => (
                            <option key={bg} value={bg}>
                                {bg}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Buttons */}
                <div>
                    {!isEditing ? (
                        <button
                            type="button"
                            onClick={handleEditClick}
                            className="btn btn-primary"
                        >
                            Edit
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSaveClick}
                            className="btn btn-success"
                        >
                            Save
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ProfilePage;
