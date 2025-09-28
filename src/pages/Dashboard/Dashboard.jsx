import { Navigate } from "react-router";
import useRole from "../../hooks/useRole";
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import UserDashboard from "../UserDasboard/UserDashboard";
import Loading from "../Loading/Loading";

export default function Dashboard() {
  const { role, loading } = useRole();

  if (loading) {
    return <Loading></Loading>;
  }

  if (role === "user") {
    return <UserDashboard/>;
  }
  if (role === "volunteer") {
    return <div>Volunteer Dashboard</div>;
  }

  if (role === "admin") {

    return <AdminDashboard/>;
  }

  return <Navigate to={"/"} />;
}