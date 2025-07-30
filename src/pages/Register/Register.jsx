import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { updateProfile } from 'firebase/auth';
import { AuthContext } from '../../context/AuthContext';
import { showError, showSuccess } from '../../utility/sweetAlert';
import districtsData from '../../json/districts.json';
import upazilasData from '../../json/upazilas.json';
import axios from 'axios';

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Register = () => {
  const { createUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Controlled form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    image: '',
    blood: '',
    district: '',
    upazila: '',
    password: '',
    confirm_password: '',
  });

  useEffect(() => {
    setDistricts(districtsData);
    setUpazilas(upazilasData);
  }, []);

  const handleDistrictChange = (e) => {
    const selectedDistrictName = e.target.value;
    setFormData(prev => ({ ...prev, district: selectedDistrictName, upazila: '' }));

    const districtObj = districts.find(d => d.name === selectedDistrictName);
    const districtId = districtObj ? districtObj.id : null;
    setSelectedDistrictId(districtId);

    if (districtId) {
      const filtered = upazilas.filter(u => u.district_id === districtId);
      setFilteredUpazilas(filtered);
    } else {
      setFilteredUpazilas([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { name, email, password, confirm_password, blood, district, upazila, image } = formData;

    if (password !== confirm_password) {
      return showError('Passwords do not match!');
    }

    if (!image) {
      return showError('Please provide an image URL.');
    }

    try {
      // Create Firebase user
      const res = await createUser(email, password);
      await updateProfile(res.user, {
        displayName: name,
        photoURL: image
      });

      // Prepare user info exactly as backend expects
      const userInfo = {
        name,
        email,
        image,
        blood,
        district,
        upazila,
        role: 'donor',
        status: 'active',
      };

      // Send to backend API (make sure URL matches your backend)
      await axios.post('https://server-bloodbridge.vercel.app/get-users', userInfo);

      showSuccess('Account Created', 'Welcome to BloodBridge!');
      navigate('/');
    } catch (err) {
      showError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 shadow-lg rounded-lg my-10">
      <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Register</h2>
      <form onSubmit={handleSignUp} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Full Name"
          required
          className="input input-bordered w-full"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
          className="input input-bordered w-full"
        />
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleInputChange}
          placeholder="Image URL"
          
          className="input input-bordered w-full"
        />
        <select
          name="blood"
          value={formData.blood}
          onChange={handleInputChange}
          required
          className="select select-bordered w-full"
        >
          <option value="">Select Blood Group</option>
          {bloodGroups.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <select
          name="district"
          value={formData.district}
          onChange={handleDistrictChange}
          required
          className="select select-bordered w-full"
        >
          <option value="">Select District</option>
          {districts.map(d => (
            <option key={d.id} value={d.name}>{d.name}</option>
          ))}
        </select>
        <select
          name="upazila"
          value={formData.upazila}
          onChange={handleInputChange}
          required
          className="select select-bordered w-full"
        >
          <option value="">Select Upazila</option>
          {filteredUpazilas.map(up => (
            <option key={up.id} value={up.name}>{up.name}</option>
          ))}
        </select>
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Password"
          required
          className="input input-bordered w-full"
        />
        <input
          type={showPassword ? 'text' : 'password'}
          name="confirm_password"
          value={formData.confirm_password}
          onChange={handleInputChange}
          placeholder="Confirm Password"
          required
          className="input input-bordered w-full"
        />
        <label className="label cursor-pointer">
          <span className="label-text">Show Password</span>
          <input
            type="checkbox"
            className="toggle toggle-error"
            onChange={() => setShowPassword(!showPassword)}
            checked={showPassword}
          />
        </label>
        <button type="submit" className="btn bg-red-600 text-white w-full hover:bg-red-700">
          Register
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-red-500 font-semibold">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
