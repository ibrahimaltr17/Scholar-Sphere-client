import React from 'react';
import aboutImage from '../../assets/illas.svg';

const About = () => {
    return (
        <section className="min-h-screen py-16 px-6 md:px-16 my-20  dark:bg-gray-900 dark:text-gray-400 transition-colors duration-300">
            {/* Page Heading */}
            <div className="text-center max-w-3xl mx-auto mb-12">
                <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-400 mb-4 transition-colors duration-300">
                    About Scholar Sphere
                </h1>
                <p className="text-lg md:text-xl  transition-colors duration-300">
                    Scholar Sphere is a comprehensive Scholarship Management System designed to empower students to find, track, and apply for scholarships suited to their profile.
                </p>
            </div>

            {/* Content Section */}
            <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
                {/* Text Content */}
                <div className="flex-1 space-y-6">
                    <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400 transition-colors duration-300">
                        Our Mission
                    </h2>
                    <p>
                        We aim to simplify the scholarship application process by providing students with an intuitive platform where they can discover opportunities, manage applications, and stay updated on deadlines—all in one place.
                    </p>

                    <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400 transition-colors duration-300">
                        Who Can Benefit
                    </h2>
                    <p>
                        Scholar Sphere is designed for students of all levels seeking financial assistance for higher education. Whether you’re looking for national scholarships, international programs, or merit-based awards, our system helps you identify opportunities that match your profile.
                    </p>

                    <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400 transition-colors duration-300">
                        Features
                    </h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Browse and search scholarships easily.</li>
                        <li>Track your applications and deadlines.</li>
                        <li>Save scholarships for later consideration.</li>
                        <li>Receive updates and notifications on new opportunities.</li>
                    </ul>
                </div>

                {/* Image */}
                <div className="flex-1">
                    <img
                        src={aboutImage}
                        alt="Scholarship illustration"
                        className="rounded-2xl shadow-lg dark:shadow-gray-700 w-full object-cover max-h-[400px] transition-shadow duration-300"
                    />
                </div>
            </div>

            {/* Call-to-Action */}
            <div className="text-center mt-16">
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">
                    Ready to find your perfect scholarship?
                </p>
                <a
                    href="/all-scholarships"
                    className="inline-block bg-blue-900 dark:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-green-600 dark:hover:bg-green-400 transition-colors duration-300"
                >
                    Explore Scholarships
                </a>
            </div>
        </section>
    );
};

export default About;
