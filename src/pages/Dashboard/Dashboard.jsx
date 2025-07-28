import { Navigate } from "react-router";
import useRole from "../../hooks/useRole";
import AdminDashboard from "../AdminDashboard/AdminDashboard";

export default function Dashboard() {
  const { role, loading } = useRole();

  if (loading) {
    return <h1>Loading</h1>;
  }

  if (role === "donor") {
    return <div>Donor Dashboard</div>;
  }
  if (role === "volunteer") {
    return <div>Volunteer Dashboard</div>;
  }

  if (role === "admin") {

    return <AdminDashboard/>;
  }

  return <Navigate to={"/"} />;
}