import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { getAuth, onAuthStateChanged, getIdToken } from "firebase/auth";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../Loading/Loading";

export default function PaymentSuccess() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sessionId = searchParams.get("session_id");
  const scholarshipId = searchParams.get("scholarshipId");

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setErrorMsg("User not logged in");
        setLoading(false);
        await Swal.fire("Error", "You must be logged in to complete payment", "error");
        navigate("/login");
        return;
      }

      try {
        const token = await getIdToken(user);

        // 1️⃣ Get user info
        const { data: userData } = await axios.get(
          "https://server-bloodbridge.vercel.app/get-user-info",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // 2️⃣ Record applied scholarship
        await axios.post(
          "https://server-bloodbridge.vercel.app/applied-scholarships",
          {
            userId: userData._id,
            userName: userData.name,
            userEmail: userData.email,
            scholarshipId,
            appliedDate: new Date(),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setLoading(false);
        await Swal.fire("Success", "Applied Successfully!", "success");
        navigate("/all-scholarships"); // ✅ matches router path exactly

      } catch (err) {
        console.error(err);
        setErrorMsg(err.message || "Something went wrong!");
        setLoading(false);
        await Swal.fire("Error", err.message || "Failed to apply scholarship", "error");
        navigate("/all-scholarships");
      }
    });

    return () => unsubscribe();
  }, [scholarshipId, navigate]);

  if (loading) return <Loading />;

  if (errorMsg) {
    return (
      <div className="text-center mt-20 text-red-500">
        <h1 className="text-2xl font-bold">Failed to apply scholarship</h1>
        <p>{errorMsg}</p>
      </div>
    );
  }

  return null; // SweetAlert handles success
}
