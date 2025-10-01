import { Navigate } from "react-router";
import useRole from "../../hooks/useRole";
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import UserDashboard from "../UserDasboard/UserDashboard";
import Loading from "../Loading/Loading";
import ModeratorDashboard from "../ModeratorDashboard/ModeratorDashboard";

export default function Dashboard() {
  const { role, loading } = useRole();

  if (loading) {
    return <Loading></Loading>;
  }

  if (role === "user") {
    return <UserDashboard/>;
  }
  if (role === "moderator") {
    return <ModeratorDashboard></ModeratorDashboard>;
  }

  if (role === "admin") {

    return <AdminDashboard/>;
  }

  return <Navigate to={"/"} />;
}