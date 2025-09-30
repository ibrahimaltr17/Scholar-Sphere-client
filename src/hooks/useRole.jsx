// useRole.jsx
import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

export default function useRole() {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const { accessToken } = useContext(AuthContext); // ✅ get token directly
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (!accessToken) return; // wait until token is available

    const fetchRole = async () => {
      try {
        const res = await axiosSecure.get("/get-user-role");
        setRole(res.data.role);
      } catch (error) {
        console.error("Failed to fetch role:", error);
        setRole(""); // optional
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [accessToken]); // ✅ only run when accessToken changes

  return { role, loading };
}
