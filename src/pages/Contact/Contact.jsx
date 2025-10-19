import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // For now, just log the form data
        console.log('Contact Form Submitted:', formData);
        alert('Thank you! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <section className="min-h-screen bg-gray-50 my-20 py-16 px-6 md:px-16">
            {/* Heading */}
            <div className="text-center max-w-3xl mx-auto mb-12">
                <h1 className="text-4xl font-bold text-[#1E3A8A] mb-4">Contact Us</h1>
                <p className="text-gray-600 text-lg md:text-xl">
                    Have a question or need assistance? Reach out to us and our team will help you with your scholarship queries.
                </p>
            </div>

            {/* Contact Form & Info */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
                {/* Form */}
                <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="5"
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="bg-[#1E3A8A] text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-[#10B981] transition-colors duration-300"
                        >
                            Send Message
                        </button>
                    </form>
                </div>

                {/* Contact Info */}
                <div className="flex-1 space-y-6">
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-semibold text-[#10B981] mb-4">Get in Touch</h2>
                        <p className="text-gray-700 mb-2"><strong>Email:</strong> support@scholarsphere.com</p>
                        <p className="text-gray-700 mb-2"><strong>Phone:</strong> +880 1234 567890</p>
                        <p className="text-gray-700 mb-2"><strong>Address:</strong> 123 Education Street, Dhaka, Bangladesh</p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-semibold text-[#10B981] mb-4">Working Hours</h2>
                        <p className="text-gray-700 mb-2">Sunday – Thursday: 9:00 AM – 6:00 PM</p>
                        <p className="text-gray-700 mb-2">Saturday: 10:00 AM – 3:00 PM</p>
                        <p className="text-gray-700 mb-2">Friday: Closed</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
