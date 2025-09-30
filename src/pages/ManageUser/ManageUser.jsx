import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { showSuccess } from "../../utility/sweetAlert";

const ManageUser = () => {
  const axiosSecure = useAxiosSecure();

  const {
    isLoading,
    isError,
    data: users = [],
    error,
    refetch,
  } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/get-users");
      return data;
    },
  });

  const handleRoleChange = async (e, email) => {
    const role = e.target.value;
    try {
      const { data } = await axiosSecure.patch("/update-role", { role, email });
      if (data.modifiedCount) {
        showSuccess('Done','Role has changed')
        refetch(); // refresh the user list
      }
    } catch (err) {
      console.error("Role update failed:", err);
    }
  };

  if (isLoading) {
    return <h1 className="text-3xl text-center mt-10 text-blue-600">Loading users...</h1>;
  }

  if (isError) {
    return <h1 className="text-2xl text-center mt-10 text-red-500">Failed to load users</h1>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-primary mb-8">Admin - Manage Users</h2>
      <div className="grid gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-600"
          >
            <div className="flex-1">
              <div className="text-gray-800 dark:text-gray-200 font-semibold">
                Name: <span className="text-blue-600 dark:text-blue-400">{user.name || 'Unknown'}</span>
              </div>
              <div className="text-gray-800 dark:text-gray-300 mt-1">
                Email: <span className="text-gray-600 dark:text-gray-400">{user.email}</span>
              </div>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Role:{" "}
                <span className="capitalize font-medium text-green-600 dark:text-green-400">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Change Role
              </label>
              <select
                defaultValue={user.role}
                onChange={(e) => handleRoleChange(e, user.email)}
                className="select select-sm select-bordered w-40"
              >
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUser;
