import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { getAuth, onIdTokenChanged } from "firebase/auth";

export default function useRole() {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const { accessToken } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const auth = getAuth();

  const fetchRole = async () => {
    if (!auth.currentUser) return;
    try {
      setLoading(true);
      const res = await axiosSecure.get("/get-user-role");
      setRole(res.data.role);
    } catch (err) {
      console.error("Failed to fetch role:", err);
      setRole("user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!accessToken) return;
    fetchRole();

    // ✅ refetch role when Firebase token changes
    const unsubscribe = onIdTokenChanged(auth, () => {
      fetchRole();
    });

    return () => unsubscribe();
  }, [accessToken]);

  return { role, loading };
}
