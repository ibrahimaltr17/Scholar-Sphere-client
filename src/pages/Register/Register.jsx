import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { updateProfile } from 'firebase/auth';
import { AuthContext } from '../../context/AuthContext';
import { showError, showSuccess } from '../../utility/sweetAlert';
import axios from 'axios';

const Register = () => {
  const { createUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Controlled form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    image: '',
    password: '',
    confirm_password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { name, email, password, confirm_password, image } = formData;

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
        role: 'user',
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
      <h2 className="text-3xl font-bold text-center text-[#10B981] mb-6">Register</h2>
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
        <button type="submit" className="btn bg-[#10B981] text-white w-full hover:bg-[#10B981]">
          Register
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-[#10B981] font-semibold">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
