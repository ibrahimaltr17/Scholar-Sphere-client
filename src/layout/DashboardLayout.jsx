import { useState } from "react";
import { Outlet } from "react-router";
import DashboardSidebar from "../components/DashboardSidebar/DashboardSidebar";
import { Menu } from "lucide-react";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>

      {/* Sidebar for Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50">
            <DashboardSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6">
        {/* Hamburger button for mobile */}
        <button
          className="md:hidden mb-4 p-2 bg-white shadow rounded-lg"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>

        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
