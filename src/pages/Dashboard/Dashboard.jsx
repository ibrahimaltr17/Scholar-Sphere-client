import { Navigate } from "react-router";
import useRole from "../../hooks/useRole";
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import DonorDashboard from "../DonorDasboard/DonorDashboard";
import Loading from "../Loading/Loading";

export default function Dashboard() {
  const { role, loading } = useRole();

  if (loading) {
    return <Loading></Loading>;
  }

  if (role === "donor") {
    return <DonorDashboard/>;
  }
  if (role === "volunteer") {
    return <div>Volunteer Dashboard</div>;
  }

  if (role === "admin") {

    return <AdminDashboard/>;
  }

  return <Navigate to={"/"} />;
}