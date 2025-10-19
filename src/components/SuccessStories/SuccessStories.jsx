import React from "react";
import { Quote } from "lucide-react";

const stories = [
    {
        name: "Nusrat Jahan",
        university: "University of Toronto",
        scholarship: "Global Excellence Scholarship",
        image: "https://i.ibb.co.com/tPgmvCN/student1.jpg",
        text: "Scholar Sphere helped me find the perfect scholarship match. The application tracking and recommendations made the process so easy!",
    },
    {
        name: "Ayman Rahman",
        university: "Monash University, Australia",
        scholarship: "Monash International Merit Award",
        image: "https://www.freepik.com/free-photo/indian-man-smiling-mockup-psd-cheerful-expression-closeup-portra_18836325.htm#fromView=search&page=1&position=20&uuid=40cf4675-dc29-4bbb-8cc9-cd700a9b858e&query=face+south+asian",
        text: "I never thought studying abroad would be possible. Thanks to Scholar Sphere, I secured my dream scholarship and moved forward confidently!",
    },
    {
        name: "Fatima Noor",
        university: "National University of Singapore",
        scholarship: "ASEAN Undergraduate Scholarship",
        image: "",
        text: "The platform guided me step-by-step — from selecting the right program to submitting a strong application. Truly a life-changing experience!",
    },
];

const SuccessStories = () => {
    return (
        <section className=" py-16 px-6 md:px-12 lg:px-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-green-950 mb-4">
                    Student Success Stories
                </h2>
                <p className="text-gray-700 max-w-2xl mx-auto">
                    Hear from students who achieved their dreams through our scholarship
                    platform — your success could be next!
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stories.map((story, index) => (
                    <div
                        key={index}
                        className="bg-white border border-green-100 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 p-6 flex flex-col items-center"
                    >
                        <img
                            src={story.image}
                            alt={story.name}
                            className="w-28 h-28 rounded-full object-cover border-4 border-green-800 mb-4 shadow-md"
                        />
                        <Quote className="w-6 h-6 text-green-700 mb-3" />
                        <p className="text-gray-600 italic text-center mb-4">
                            “{story.text}”
                        </p>
                        <h3 className="text-lg font-semibold text-green-950">
                            {story.name}
                        </h3>
                        <p className="text-sm text-gray-500">{story.university}</p>
                        <p className="text-sm text-green-700 font-medium">
                            {story.scholarship}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SuccessStories;
