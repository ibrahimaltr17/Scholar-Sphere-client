import React, { useContext, useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router';
import { updateProfile } from 'firebase/auth';
import { AuthContext } from '../../context/AuthContext';
import { showError, showSuccess } from '../../utility/sweetAlert';

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const imageBB_API_KEY = import.meta.env.VITE_IMAGEBB_KEY;

const Register = () => {
    const { createUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Fetch district/upazila data from GitHub or local JSON
    useEffect(() => {
        fetch('https://github.com/nuhil/bangladesh-geocode/blob/master/districts/districts.json')
            .then(res => res.json())
            .then(data => {
                setDistricts(data);
            });
    }, []);

    const handleDistrictChange = (e) => {
        const selected = e.target.value;
        setSelectedDistrict(selected);
        const selectedData = districts.find(d => d.name === selected);
        setUpazilas(selectedData?.upazilas || []);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm_password');
        const name = formData.get('name');
        const bloodGroup = formData.get('blood_group');
        const district = formData.get('district');
        const upazila = formData.get('upazila');
        const image = formData.get('avatar');

        if (password !== confirmPassword) {
            return showError("Password Mismatch", "Passwords do not match.");
        }

        try {
            // Upload avatar to imageBB
            const imageForm = new FormData();
            imageForm.append("image", image);
            const imageRes = await fetch(`https://api.imgbb.com/1/upload?key=${imageBB_API_KEY}`, {
                method: "POST",
                body: imageForm,
            });
            const imageData = await imageRes.json();
            const photoURL = imageData.data.url;

            // Create user in Firebase
            const result = await createUser(email, password);
            await updateProfile(result.user, {
                displayName: name,
                photoURL,
            });

            // Save user to database
            const newUser = {
                email,
                name,
                photo: photoURL,
                bloodGroup,
                district,
                upazila,
                role: "donor",
                status: "active",
                creationTime: result.user?.metadata?.creationTime,
                lastSignInTime: result.user?.metadata?.lastSignInTime,
            };

            const res = await fetch('https://server-bloodbridge.vercel.app/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });

            const dbResult = await res.json();
            if (dbResult.insertedId || dbResult.acknowledged) {
                showSuccess("Account Created", "Welcome to BloodBridge!");
                form.reset();
                navigate('/');
            }
        } catch (error) {
            showError("Registration Failed", error.message);
        }
    };

    return (
        <div className='bg-orange-600 min-h-screen lg:flex relative'>
            <Link to="/"><button className='btn btn-circle absolute right-4 top-4'>X</button></Link>

            <div className='w-5/12 hidden lg:flex h-screen px-5 text-white text-center items-center justify-center'>
                <h1 className='text-5xl font-bold'>Join BloodBridge Today!</h1>
            </div>

            <div className='text-white lg:text-black lg:bg-white rounded-l-2xl w-full lg:w-7/12 flex justify-center items-center py-12'>
                <div className='w-full max-w-md px-4'>
                    <h3 className='text-3xl font-bold text-center mb-4'>Register Now</h3>
                    <form onSubmit={handleSignUp}>
                        <label className="label">Name</label>
                        <input type="text" name="name" className="input text-black w-full" required />

                        <label className="label">Email</label>
                        <input type="email" name="email" className="input text-black w-full" required />

                        <label className="label">Avatar</label>
                        <input type="file" name="avatar" accept="image/*" className="file-input file-input-bordered w-full text-black" required />

                        <label className="label">Blood Group</label>
                        <select name="blood_group" className="select text-black w-full" required>
                            <option value="">Select</option>
                            {bloodGroups.map(group => (
                                <option key={group} value={group}>{group}</option>
                            ))}
                        </select>

                        <label className="label">District</label>
                        <select name="district" className="select text-black w-full" required onChange={handleDistrictChange}>
                            <option value="">Select</option>
                            {districts.map(d => (
                                <option key={d.name} value={d.name}>{d.name}</option>
                            ))}
                        </select>

                        <label className="label">Upazila</label>
                        <select name="upazila" className="select text-black w-full" required>
                            <option value="">Select</option>
                            {upazilas.map((u, index) => (
                                <option key={index} value={u}>{u}</option>
                            ))}
                        </select>

                        <label className="label">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                className="input text-black w-full"
                                required
                                minLength={6}
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
                                title="At least 6 characters, with uppercase, lowercase, and number"
                            />
                            <button
                                type="button"
                                className="absolute top-3 right-3"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        <label className="label">Confirm Password</label>
                        <input type="password" name="confirm_password" className="input text-black w-full" required />

                        <button type="submit" className="btn btn-neutral mt-5 w-full">Register</button>
                    </form>

                    <p className="mt-4 text-center">
                        Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
