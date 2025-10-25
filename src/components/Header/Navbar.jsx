import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import './Navbar.css'
import { AuthContext } from '../../context/AuthContext';
import { showError, showWarning } from '../../utility/sweetAlert';
import logo from '../../assets/scholLogo.png'
import logo2 from '../../assets/scholLogo2.png'
import ThemeToggle from '../Theme/Theme';

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext)
    const navigate = useNavigate();

    const handleLogOut = () => {
        logOut().then(() => {
            navigate('/');
            showWarning('Logged Out Successfully', 'See you again soon!')
        }).catch((error) => {
            showError(error)
        });
    }

    return (
        <div className="navbar fixed top-0 left-0 w-full z-50 bg-[#1E3A8A]">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-32 p-2 shadow">
                        <NavLink className=' text-black lg:text-[#1cffb3]' to="/">Home</NavLink>
                        <NavLink className=' text-black lg:text-[#1cffb3]' to="/all-Scholarships">All Scholarship</NavLink>
                        {!user && <NavLink className=' text-black lg:text-[#1cffb3]' to="/about">About</NavLink>}
                        {user && <>
                            <NavLink className=' text-black lg:text-[#1cffb3]' to="/dashboard">Dashboard</NavLink>
                            <NavLink className=' text-black lg:text-[#1cffb3]' to="/about">About</NavLink>
                            <NavLink className=' text-black lg:text-[#1cffb3]' to="/contact">Contact</NavLink>
                        </>}
                    </ul>
                </div>

                {/* Logo Section */}
                <a href="/">
                    <div className="flex items-center gap-2">
                        {/* Desktop Logo */}
                        <img src={logo} alt="Logo" className="hidden md:block max-w-[190px]" />
                        {/* Mobile Logo */}
                        <img src={logo2} alt="Mobile Logo" className="block md:hidden max-w-[50px]" />
                    </div>
                </a>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal text-md font-semibold flex gap-4 px-1 text-[#F1F8E9] items-center">
                    <NavLink className=' text-black lg:text-[#1cffb3]' to="/">Home</NavLink>
                    <NavLink className=' text-black lg:text-[#1cffb3]' to="/all-Scholarships">All Scholarship</NavLink>
                    {!user && <NavLink className=' text-black lg:text-[#1cffb3]' to="/about">About</NavLink>}
                    {user && <>
                        <NavLink className=' text-black lg:text-[#1cffb3]' to="/dashboard">Dashboard</NavLink>
                        <NavLink className=' text-black lg:text-[#1cffb3]' to="/about">About</NavLink>
                        <NavLink className=' text-black lg:text-[#1cffb3]' to="/contact">Contact</NavLink>
                    </>}
                </ul>
            </div>

            <div className="navbar-end flex gap-3">
                <ThemeToggle></ThemeToggle>
                <div className="dropdown dropdown-hover dropdown-left dropdown-center">
                    {user && <div className="avatar max-w-8">
                        <div className="ring-primary bg-white ring-offset-base-100 w-12s rounded-full ring-2 ring-offset-2">
                            <img src={user.photoURL ? user.photoURL :
                                "https://img.icons8.com/?size=48&id=84020&format=png"
                            } />
                        </div>
                    </div>}
                    {user?.displayName && (
                        <p tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                            {user.displayName}
                        </p>
                    )}
                </div>

                {user ?
                    <Link to="/">
                        <button onClick={handleLogOut} className="btn bg-[#10B981] text-white">LogOut</button>
                    </Link>
                    :
                    <Link to="/login">
                        <button className="btn bg-[#10B981] text-white">Login</button>
                    </Link>
                }
            </div>
        </div>
    );
};

export default Navbar;
