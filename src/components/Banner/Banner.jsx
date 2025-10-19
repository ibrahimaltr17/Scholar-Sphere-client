import React from 'react';
import { useNavigate } from 'react-router';

const Banner = () => {
    const navigate = useNavigate();

    const handleExplore = () => {
        navigate('/all-Scholarships');
    };

    const slides = [
        {
            title: "Unlock Your Global Opportunities",
            description: "Discover scholarships from top universities around the world. Apply with ease and take the next step toward your dream education.",
            image: "https://media.istockphoto.com/id/2197964909/photo/back-view-three-multiracial-people-outside-go-to-class-lesson-studying-together-students.jpg?s=612x612&w=0&k=20&c=Wdu7Wfv7qqfU1RxRSBNkcdwjDhEZvEP6SwVlSMqjdgs="
        },
        {
            title: "Empowering Scholars, Shaping Futures",
            description: "Find scholarships that match your goals, track your applications, and get the support you need to succeed academically.",
            image: "https://media.istockphoto.com/id/2198907844/photo/people-students-and-applause-at-university-for-graduation-peer-support-and-happy-for.jpg?s=612x612&w=0&k=20&c=p9fAlV2wwvzZy5-Y7WObxtcrlu3VabtdxY9P8CDxiCU="
        },
        {
            title: "Your Gateway to Higher Education",
            description: "Explore funding opportunities, connect with universities, and make your education dreams a reality with our platform.",
            image: "https://media.istockphoto.com/id/1461259206/photo/university-of-istanbul-turkey.jpg?s=612x612&w=0&k=20&c=iwhfsa4Rfygf7pM1mUmJtj53TIYucS5EDJ8U5yVKjlY="
        }
    ];


    return (
        <div className="carousel w-full h-[500px] relative">
            {slides.map((slide, idx) => (
                <div key={idx} id={`slide${idx + 1}`} className="carousel-item relative w-full">
                    <div
                        className="hero h-full"
                        style={{ backgroundImage: `url(${slide.image})` }}
                    >
                        <div className="hero-overlay bg-black/40"></div>
                        <div className="hero-content text-center text-white relative z-10">
                            <div className="max-w-md space-y-4">
                                <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold">{slide.title}</h1>
                                <p className="text-xs px-6 md:text-sm lg:text-lg">{slide.description}</p>
                                <button
                                    onClick={handleExplore}
                                    className="btn bg-[#10B981] hover:bg-[#0f8f6f] px-6 py-3 rounded-lg font-semibold"
                                >
                                    Explore Scholarships
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <a href={`#slide${idx === 0 ? slides.length : idx}`} className="btn btn-circle">❮</a>
                        <a href={`#slide${idx === slides.length - 1 ? 1 : idx + 2}`} className="btn btn-circle">❯</a>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Banner;
