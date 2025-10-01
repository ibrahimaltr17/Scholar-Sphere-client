import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { showSuccess } from "../../utility/sweetAlert";
import Swal from "sweetalert2";

const ManageUser = () => {
  const axiosSecure = useAxiosSecure();
  const [filterRole, setFilterRole] = useState("");

  // Fetch all users
  const { isLoading, isError, data: users = [], refetch } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/get-users");
      return data;
    },
  });

  // Change user role
  const handleRoleChange = async (e, email) => {
    const role = e.target.value;
    try {
      const { data } = await axiosSecure.patch("/update-role", { role, email });
      if (data.modifiedCount) {
        showSuccess("Done", "Role has changed");
        refetch();
      }
    } catch (err) {
      console.error("Role update failed:", err);
    }
  };

  // Delete user

  const handleDelete = async (email) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const { data } = await axiosSecure.delete(`/delete-user/${email}`);
        if (data.deletedCount) {
          Swal.fire("Deleted!", "User has been deleted.", "success");
          refetch();
        } else {
          Swal.fire("Error!", "User could not be deleted.", "error");
        }
      } catch (err) {
        console.error("Delete failed:", err);
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };


  if (isLoading)
    return <h1 className="text-3xl text-center mt-10 text-blue-600">Loading users...</h1>;

  if (isError)
    return <h1 className="text-2xl text-center mt-10 text-red-500">Failed to load users</h1>;

  // Apply filter
  const filteredUsers = filterRole ? users.filter((u) => u.role === filterRole) : users;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-primary mb-6">Admin - Manage Users</h2>

      {/* Filter by Role */}
      <div className="flex justify-end mb-4">
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="select select-bordered w-40"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Users Table */}
      <table className="min-w-full border border-gray-300 dark:border-gray-600">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr
              key={user._id}
              className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="p-3 text-gray-800 dark:text-gray-200">{user.name || "Unknown"}</td>
              <td className="p-3 text-gray-700 dark:text-gray-300">{user.email}</td>
              <td className="p-3">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(e, user.email)}
                  className="select select-sm select-bordered w-36"
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="p-3">
                <button
                  onClick={() => handleDelete(user.email)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="4" className="p-3 text-center text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUser;
