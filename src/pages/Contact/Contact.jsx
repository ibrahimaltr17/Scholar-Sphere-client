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
        console.log('Contact Form Submitted:', formData);
        alert('Thank you! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <section className="min-h-screen py-16 px-6 md:px-16 my-20  transition-colors duration-300">
            {/* Heading */}
            <div className="text-center max-w-3xl mx-auto mb-12">
                <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-400 mb-4">Contact Us</h1>
                <p className="text-lg md:text-xl text-gray-300 dark:text-gray-300">
                    Have a question or need assistance? Reach out to us and our team will help you with your scholarship queries.
                </p>
            </div>

            {/* Contact Form & Info */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
                {/* Form */}
                <div className="flex-1  dark:bg-gray-800 p-8 rounded-2xl shadow-lg dark:shadow-gray-700 transition-colors duration-300">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {['name', 'email', 'subject'].map((field) => (
                            <div key={field}>
                                <label className="block  font-medium mb-2 capitalize">
                                    {field === 'name' ? 'Full Name' : field}
                                </label>
                                <input
                                    type={field === 'email' ? 'email' : 'text'}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300"
                                />
                            </div>
                        ))}

                        <div>
                            <label className="block  dark:text-gray-200 font-medium mb-2">Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="5"
                                required
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2  dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-900 dark:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-green-500 dark:hover:bg-green-400 transition-colors duration-300"
                        >
                            Send Message
                        </button>
                    </form>
                </div>

                {/* Contact Info */}
                <div className="flex-1 space-y-6">
                    {[
                        {
                            title: 'Get in Touch',
                            content: [
                                { label: 'Email', value: 'support@scholarsphere.com' },
                                { label: 'Phone', value: '+880 1234 567890' },
                                { label: 'Address', value: '123 Education Street, Dhaka, Bangladesh' },
                            ],
                        },
                        {
                            title: 'Working Hours',
                            content: [
                                { label: 'Sunday – Thursday', value: '9:00 AM – 6:00 PM' },
                                { label: 'Saturday', value: '10:00 AM – 3:00 PM' },
                                { label: 'Friday', value: 'Closed' },
                            ],
                        },
                    ].map((section, i) => (
                        <div
                            key={i}
                            className=" dark:bg-gray-800 p-8 rounded-2xl shadow-lg dark:shadow-gray-700 transition-colors duration-300"
                        >
                            <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-4">
                                {section.title}
                            </h2>
                            {section.content.map((item, idx) => (
                                <p
                                    key={idx}
                                    className="text-gray-400 dark:text-gray-200 mb-2"
                                >
                                    <strong>{item.label}:</strong> {item.value}
                                </p>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Contact;
