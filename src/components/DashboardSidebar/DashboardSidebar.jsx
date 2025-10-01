import { NavLink } from "react-router";
import useRole from "../../hooks/useRole";

export default function DashboardSidebar({ onClose }) {
  const NavItem = ({ to, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-5 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${isActive
          ? "bg-[#10B981] text-white shadow"
          : "text-gray-700 hover:bg-red-50 hover:text-[#10B981]"
        }`
      }
      onClick={onClose} // closes sidebar on mobile
    >
      {label}
    </NavLink>
  );

  const { role, loading } = useRole();

  if (loading)
    return (
      <div className="p-4 text-center text-gray-500 animate-pulse">
        Loading sidebar...
      </div>
    );

  return (
    <aside className="w-64 min-h-screen bg-white shadow-md rounded-r-xl p-6 sticky top-0">
      <h2 className="text-xl font-semibold text-[#10B981] mb-6">Dashboard</h2>
      <nav className="flex flex-col gap-3">
        <NavItem to="/dashboard" label={`${role} Dashboard`} />

        {role === "admin" && (
          <>
            <NavItem to="/dashboard/add-scholarship" label="Add Scholarship" />
            <NavItem to="/dashboard/all-users" label="Manage Users" />
            <NavItem
              to="/dashboard/scholarships"
              label="Manage Scholarships"
            />
            <NavItem to="/dashboard/content-management" label="Manage Review" />
            <NavItem to="/dashboard/profile" label="Profile" />
          </>
        )}

        {role === "moderator" && (
          <>
            <NavItem to="/dashboard/profile" label="My Profile" />
            <NavItem
              to="/dashboard/scholarships"
              label="Manage Scholarships"
            />
            <NavItem to="/dashboard/all-reviews" label="All Reviews" />
            <NavItem to="/dashboard/all-applied-scholarships" label="All applied Scholarship" />
            <NavItem to="/dashboard/add-scholarship" label="Add Scholarship" />
            {/* <NavItem
              to="/dashboard/all-blood-donation-request"
              label="All Blood Donation Request"
            />
            <NavItem to="/dashboard/content-management" label="Content Management" />
            <NavItem to="/dashboard/profile" label="Profile" /> */}
          </>
        )}

        {role === "user" && (
          <>
            <NavItem to="/dashboard/profile" label="My Profile" />
            <NavItem to="/dashboard/my-applied-scholarships" label="My Applied Application" />
            <NavItem to="/dashboard/my-reviews" label="My Review" />

          </>
        )}
      </nav>
    </aside>
  );
}
