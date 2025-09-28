
import React, { useContext, useRef, useState } from 'react';
import google from '../../assets/google.png'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router';
import { showError, showSuccess, showWarning } from '../../utility/sweetAlert';
import { AuthContext } from '../../context/AuthContext';


const Login = () => {
    const [error, setError] = useState("")
    const { signInUser, googleLogIn, forgetPass, setUser } = useContext(AuthContext)
    const location = useLocation();
    const navigate = useNavigate();
    const emailRef = useRef()
    const [showPassword, setShowPassword] = useState(false)

    const handleSignIn = e => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;


        signInUser(email, password)
            .then(async result => {
                const signInInfo = {
                    email,
                    lastSignInTime: result.user?.metadata?.lastSignInTime
                };

                try {
                    await fetch("https://server-bloodbridge.vercel.app/get-users", {
                        method: "PATCH",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify(signInInfo)
                    });
                } catch (err) {
                    console.error("User login update failed:", err);
                }

                setUser(result.user);
                showSuccess("Login Successful!", "Welcome back!");
                navigate(location.state?.from || "/");
            })
            .catch(error => {
                setError(error.code);
                showError("Login Failed", error.message);
            });
    }
    
    const handleGoogleLogIn = () => {
        googleLogIn()
            .then(result => {
                const user = result.user;
                showSuccess('Login Successful!', 'Welcome back!')
                navigate(location.state?.path || "/");
            })
            .catch(error => {
                console.error("Google sign-in error:", error.message);
                setError(error.message);
                showError('Login Failed', error.message)
            });
    }

    const handleForgetPassword = (e) => {
        e.preventDefault();
        const email = emailRef.current.value;
        setError('')
        forgetPass(email)
            .then(() => {
                showWarning('Mail Sent', 'Please check your email')
            }).catch((error) => {
                setError(error.message)
            });
    }

    return (
        <div className='bg-[#10B981] h-screen lg:flex relative'>
            <Link to="/"><button className='btn btn-circle absolute right-4 top-4'>X</button></Link>
            <div className='w-5/12 hidden lg:block h-screen px-5 text-white text-center'>
                <div className='lg:flex h-full flex-col items-center justify-center'>
                    <h1 className='text-5xl font-bold text-center my-auto'>Welcome back! <br /><span className='text-3xl'>Please enter your credentials to access your account.</span></h1>
                </div>
            </div>
            <div className='text-white lg:text-black lg:bg-white rounded-l-2xl h-screen w-full lg:w-7/12 flex justify-center items-center '>
                <div>
                    <h3 className='hidden md:block lg:hidden text-2xl font-bold max-w-[320px] text-center my-4'>Welcome back! </h3>
                    <div>
                        <h3 className='text-2xl font-bold lg:text-3xl text-center my-3'>Login Now</h3>
                    </div>
                    <div className='min-w-[320px]'>
                        <form onSubmit={handleSignIn} className=''>
                            {/* email */}
                            <label className="label">Email</label><br />
                            <input name='email' type="email" className="input text-black" placeholder="Email" ref={emailRef} required /><br />
                            {/* password */}
                            <label className="label">Password</label><br />
                            <div className='relative'>
                                <input
                                    name='password'
                                    type={showPassword ? "text" : "password"}
                                    className="input text-black"
                                    placeholder="Password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute top-3 right-2 cursor-pointer'
                                    aria-label="Toggle Password Visibility"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                {error && <p className='text-xs text-red-600'>{error}</p>}
                            </div>

                            <div onClick={handleForgetPassword}><a className="link link-hover">Forgot password?</a></div>
                            <div>
                                <button type='submit' className="btn btn-neutral mt-4 w-full">Login</button>
                            </div>
                        </form>
                        <div className="divider text-white">OR</div>
                        <div
                            onClick={handleGoogleLogIn}
                            className='flex justify-center rounded-md gap-1.5 cursor-pointer p-1 bg-gray-100'
                        >
                            <img src={google} alt="Google logo" className='w-5' />
                            <p className='text-black'>Sign in with Google</p>
                        </div>

                        <p className='mt-3'>
                            Don't have account? <Link to="/signup" className='text-blue-500'>Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
