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

  // Local state for form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    blood: '',
    district: '',
    upazila: '',
    password: '',
    confirm_password: '',
    // photo removed from formData
  });

  useEffect(() => {
    setDistricts(districtsData);
    setUpazilas(upazilasData);
  }, []);

  const handleDistrictChange = (e) => {
    const selectedDistrictName = e.target.value;
    setFormData({ ...formData, district: selectedDistrictName, upazila: '' }); // reset upazila on district change

    // Find district ID by name
    const districtObj = districts.find(d => d.name === selectedDistrictName);
    const districtId = districtObj ? districtObj.id : null;
    setSelectedDistrictId(districtId);

    // Filter upazilas by district_id
    if (districtId) {
      const filtered = upazilas.filter(u => u.district_id === districtId);
      setFilteredUpazilas(filtered);
    } else {
      setFilteredUpazilas([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { name, email, password, confirm_password, blood, district, upazila } = formData;

    if (password !== confirm_password) {
      return showError('Passwords do not match!');
    }

    try {
      // No image upload here

      // Create user in Firebase
      const res = await createUser(email, password);
      await updateProfile(res.user, {
        displayName: name,
        // photoURL removed
      });

      // Save user info to database
      const userInfo = {
        name,
        email,
        blood,
        district,
        upazila,
        role: 'donor',
        status: 'active',
        // image removed
      };

      await axios.post(`http://localhost:3000/get-users`, userInfo);
      showSuccess('Account Created', 'Welcome to BloodBridge!');
      navigate('/');
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 shadow-lg rounded-lg my-10">
      <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Register</h2>
      <form onSubmit={handleSignUp} className="space-y-4">
        <input type="text" name="name" onChange={handleInputChange} placeholder="Full Name" required className="input input-bordered w-full" />
        <input type="email" name="email" onChange={handleInputChange} placeholder="Email" required className="input input-bordered w-full" />

        <select name="blood" onChange={handleInputChange} required className="select select-bordered w-full">
          <option value="">Select Blood Group</option>
          {bloodGroups.map(b => <option key={b} value={b}>{b}</option>)}
        </select>

        <select name="district" onChange={handleDistrictChange} required className="select select-bordered w-full" value={formData.district}>
          <option value="">Select District</option>
          {districts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
        </select>

        <select name="upazila" onChange={handleInputChange} required className="select select-bordered w-full" value={formData.upazila}>
          <option value="">Select Upazila</option>
          {filteredUpazilas.map(up => <option key={up.id} value={up.name}>{up.name}</option>)}
        </select>

        <input type={showPassword ? 'text' : 'password'} name="password" onChange={handleInputChange} placeholder="Password" required className="input input-bordered w-full" />
        <input type={showPassword ? 'text' : 'password'} name="confirm_password" onChange={handleInputChange} placeholder="Confirm Password" required className="input input-bordered w-full" />

        <label className="label cursor-pointer">
          <span className="label-text">Show Password</span>
          <input type="checkbox" className="toggle toggle-error" onChange={() => setShowPassword(!showPassword)} />
        </label>

        <button type="submit" className="btn bg-red-600 text-white w-full hover:bg-red-700">Register</button>
      </form>
      <p className="mt-4 text-center text-sm">
        Already have an account? <Link to="/login" className="text-red-500 font-semibold">Login</Link>
      </p>
    </div>
  );
};

export default Register;
