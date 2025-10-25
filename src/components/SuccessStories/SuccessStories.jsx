import React from "react";
import { Quote } from "lucide-react";

const stories = [
    {
        name: "Nusrat Jahan",
        university: "University of Toronto",
        scholarship: "Global Excellence Scholarship",
        image: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?cs=srgb&dl=pexels-olly-712513.jpg&fm=jpg",
        text: "Scholar Sphere helped me find the perfect scholarship match. The application tracking and recommendations made the process so easy!",
    },
    {
        name: "Ayman Rahman",
        university: "Monash University, Australia",
        scholarship: "Monash International Merit Award",
        image: "https://plus.unsplash.com/premium_photo-1682096259050-361e2989706d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8eW91bmclMjBtYW58ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000",
        text: "I never thought studying abroad would be possible. Thanks to Scholar Sphere, I secured my dream scholarship and moved forward confidently!",
    },
    {
        name: "Fatima Noor",
        university: "National University of Singapore",
        scholarship: "ASEAN Undergraduate Scholarship",
        image: "https://media.gettyimages.com/id/2151722897/photo/young-indian-girl-portrait-closeup-in-front-of-a-grey-background.jpg?s=612x612&w=gi&k=20&c=K9r81ydjjZf8_oyB0hG7gC1qs8hapt3SFecOMB6tTus=",
        text: "The platform guided me step-by-step — from selecting the right program to submitting a strong application. Truly a life-changing experience!",
    },
];

const SuccessStories = () => {
    return (
        <section className="py-16 px-6 md:px-12 lg:px-20  transition-colors duration-500">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
                    Student Success Stories
                </h2>
                <p className="text-base-content/70 max-w-2xl mx-auto">
                    Hear from students who achieved their dreams through our scholarship
                    platform — your success could be next!
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stories.map((story, index) => (
                    <div
                        key={index}
                        className="bg-base-100 dark:bg-base-200 border border-base-300 dark:border-base-400 rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 p-6 flex flex-col items-center text-center"
                    >
                        <img
                            src={story.image}
                            alt={story.name}
                            className="w-28 h-28 rounded-full object-cover border-4 border-primary mb-4 shadow-md"
                        />
                        <Quote className="w-6 h-6 text-primary mb-3" />
                        <p className="text-base-content/70 italic text-center mb-4">
                            “{story.text}”
                        </p>
                        <h3 className="text-lg font-semibold text-base-content">{story.name}</h3>
                        <p className="text-sm text-base-content/60">{story.university}</p>
                        <p className="text-sm font-medium text-primary">{story.scholarship}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SuccessStories;
