// src/components/HowToApply.jsx
import React from "react";
import { FaSearch, FaCheckCircle, FaFileAlt, FaPaperPlane, FaClock, FaGraduationCap } from "react-icons/fa";

export default function HowToApply() {
    const steps = [
        {
            id: 1,
            title: "Search Scholarships",
            desc: "Browse through our database to find scholarships that match your profile and goals.",
            icon: <FaSearch className="text-blue-600 text-4xl" />,
        },
        {
            id: 2,
            title: "Check Eligibility",
            desc: "Carefully read the scholarship requirements to ensure you are eligible to apply.",
            icon: <FaCheckCircle className="text-green-600 text-4xl" />,
        },
        {
            id: 3,
            title: "Prepare Documents",
            desc: "Gather transcripts, CV, language certificates, and recommendation letters.",
            icon: <FaFileAlt className="text-yellow-600 text-4xl" />,
        },
        {
            id: 4,
            title: "Submit Application",
            desc: "Complete the online form and upload required documents before the deadline.",
            icon: <FaPaperPlane className="text-purple-600 text-4xl" />,
        },
        {
            id: 5,
            title: "Wait for Results",
            desc: "Track your application status and wait for the scholarship committee’s response.",
            icon: <FaClock className="text-orange-600 text-4xl" />,
        },
        {
            id: 6,
            title: "Get Admission",
            desc: "Once selected, complete the admission process and prepare for your academic journey!",
            icon: <FaGraduationCap className="text-pink-600 text-4xl" />,
        },
    ];

    return (
        <section className=" py-16 px-6 transition-colors duration-500">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-12">
                    How to Apply for Scholarships
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className="bg-base-100 dark:bg-base-200 rounded-2xl shadow-lg hover:shadow-2xl p-6 flex flex-col items-center text-center transition-transform transform hover:-translate-y-1 hover:scale-105"
                        >
                            <div className="mb-4">{step.icon}</div>
                            <h3 className="text-xl font-semibold text-base-content mb-2">
                                {step.title}
                            </h3>
                            <p className="text-base-content/70">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
