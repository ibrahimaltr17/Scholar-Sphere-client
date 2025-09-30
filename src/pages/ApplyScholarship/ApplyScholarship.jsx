import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getAuth, getIdToken } from "firebase/auth";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../Loading/Loading";

export default function ApplyScholarship() {
    const { id } = useParams(); // scholarship ID
    const navigate = useNavigate();
    const auth = getAuth();

    const [scholarship, setScholarship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        phone: "",
        photo: "",
        address: "",
        gender: "",
        degree: "",
        sscResult: "",
        hscResult: "",
        studyGap: "",
    });

    // Fetch scholarship details
    useEffect(() => {
        const fetchScholarship = async () => {
            try {
                const user = auth.currentUser;
                if (!user) throw new Error("User not logged in");
                const token = await getIdToken(user);

                const res = await axios.get(
                    `https://server-bloodbridge.vercel.app/scholarships/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setScholarship(res.data.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "Failed to load scholarship", "error");
                setLoading(false);
            }
        };
        fetchScholarship();
    }, [id, auth]);

    if (loading) return <Loading />;
    if (!scholarship) return <p className="text-center text-red-500 mt-10">Scholarship not found.</p>;

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission -> create Stripe checkout
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = auth.currentUser;
            const token = await getIdToken(user);

            // 1️⃣ Get user info
            const userRes = await axios.get(
                "https://server-bloodbridge.vercel.app/get-user-info",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const userData = userRes.data;

            // 2️⃣ Create Stripe checkout session
            const checkoutRes = await axios.post(
                "https://server-bloodbridge.vercel.app/create-checkout-session",
                {
                    amount: scholarship.applicationFees || 0,
                    scholarshipId: id,
                    applicant: {
                        ...formData,
                        userId: userData._id,
                        userName: userData.name,
                        userEmail: userData.email,
                    },
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // 3️⃣ Redirect to Stripe
            const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY); // Your Stripe publishable key
            await stripe.redirectToCheckout({ sessionId: checkoutRes.data.id });
        } catch (err) {
            console.error(err);
            Swal.fire("Error", err.message || "Failed to process payment", "error");
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold text-center mb-8">Apply for {scholarship.universityName}</h1>

            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-2xl shadow-lg">
                <div>
                    <label className="block font-semibold">Phone Number</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                        placeholder="Village, District, Country"
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold">Gender</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block font-semibold">Degree</label>
                    <select
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                        required
                    >
                        <option value="">Select Degree</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Bachelor">Bachelor</option>
                        <option value="Masters">Masters</option>
                    </select>
                </div>

                <div>
                    <label className="block font-semibold">SSC Result</label>
                    <input
                        type="text"
                        name="sscResult"
                        value={formData.sscResult}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold">HSC Result</label>
                    <input
                        type="text"
                        name="hscResult"
                        value={formData.hscResult}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold">Study Gap (Optional)</label>
                    <select
                        name="studyGap"
                        value={formData.studyGap}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                    >
                        <option value="">No Gap</option>
                        <option value="1 year">1 year</option>
                        <option value="2 years">2 years</option>
                        <option value="3+ years">3+ years</option>
                    </select>
                </div>

                <div>
                    <label className="block font-semibold">University Name</label>
                    <input
                        type="text"
                        value={scholarship.universityName}
                        className="w-full border px-3 py-2 rounded-lg bg-gray-100"
                        readOnly
                    />
                </div>

                <div>
                    <label className="block font-semibold">Scholarship Category</label>
                    <input
                        type="text"
                        value={scholarship.scholarshipCategory}
                        className="w-full border px-3 py-2 rounded-lg bg-gray-100"
                        readOnly
                    />
                </div>

                <div>
                    <label className="block font-semibold">Subject Category</label>
                    <input
                        type="text"
                        value={scholarship.subjectCategory}
                        className="w-full border px-3 py-2 rounded-lg bg-gray-100"
                        readOnly
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    Proceed to Payment (${scholarship.applicationFees || 0})
                </button>
            </form>
        </div>
    );
}
