import React from 'react';
import { Link } from 'react-router';
import Lottie from 'lottie-react';
import Animation from '../../assets/XkP3cEiWKK.json';

const Error = () => {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-white p-4'>
            <div className='w-[300px] md:w-[400px] mx-auto'>
                <Lottie animationData={Animation} loop={true} />
            </div>

            <h2 className='text-2xl md:text-3xl font-bold mt-4 mb-2'>
                Oops! Page Not Found
            </h2>
            <p className='text-gray-600 mb-4 text-center'>
                The page you are looking for doesn't exist or has been moved.
            </p>

            <Link to='/'>
                <button className='btn w-fit bg-green-900 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition-colors'>
                    Back to Home
                </button>
            </Link>
        </div>
    );
};

export default Error;
