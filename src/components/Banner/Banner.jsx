import React from 'react';
// import b1 from "../../assets/banner 1.jpg"
// import b2 from "../../assets/banner 2.jpg"
// import b3 from "../../assets/banner 3.jpg"

const Banner = () => {
    return (
        <div className="carousel w-full h-[450px]">
            <div id="slide1" className="carousel-item relative w-full">
                <div
                    className="hero h-full"
                    style={{
                        backgroundImage:
                            "url(https://media.istockphoto.com/id/2197964909/photo/back-view-three-multiracial-people-outside-go-to-class-lesson-studying-together-students.jpg?s=612x612&w=0&k=20&c=Wdu7Wfv7qqfU1RxRSBNkcdwjDhEZvEP6SwVlSMqjdgs=)",
                    }}
                >
                    <div className="hero-overlay"></div>
                    <div className="hero-content text-neutral-content text-center">
                        <div className="max-w-md">
                            <h1 className="mb-5 text-2xl md:text-3xl lg:text-5xl font-bold">Unlock Your Global Opportunities</h1>
                            <p className="mb-5 text-xs px-12 md:px-0 md:text-sm lg:px-0 lg:text-lg">
                                Discover scholarships from top universities around the world. Apply with ease and take the next step toward your dream education.
                            </p>
                            <button className="btn btn-primary bg-green-950">Explore More</button>
                        </div>
                    </div>
                </div>
                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide3" className="btn btn-circle">❮</a>
                    <a href="#slide2" className="btn btn-circle">❯</a>
                </div>
            </div>
            <div id="slide2" className="carousel-item relative w-full">
                <div
                    className="hero h-full"
                    style={{
                        backgroundImage:
                            "url(https://media.istockphoto.com/id/2198907844/photo/people-students-and-applause-at-university-for-graduation-peer-support-and-happy-for.jpg?s=612x612&w=0&k=20&c=p9fAlV2wwvzZy5-Y7WObxtcrlu3VabtdxY9P8CDxiCU=)",
                    }}
                >
                    <div className="hero-overlay"></div>
                    <div className="hero-content text-neutral-content text-center">
                        <div className="max-w-md">
                            <h1 className="mb-5 text-2xl md:text-3xl lg:text-5xl font-bold">Empowering Scholars, Shaping Futures</h1>
                            <p className="mb-5 text-xs px-12 md:px-0 md:text-sm lg:px-0 lg:text-lg">
                                Find scholarships that match your goals, track your applications, and get the support you need to succeed academically.
                            </p>
                            <button className="btn btn-primary bg-green-950">Explore More</button>
                        </div>
                    </div>
                </div>
                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide1" className="btn btn-circle">❮</a>
                    <a href="#slide3" className="btn btn-circle">❯</a>
                </div>
            </div>
            <div id="slide3" className="carousel-item relative w-full">
                <div
                    className="hero h-full"
                    style={{
                        backgroundImage:
                            "url(https://media.istockphoto.com/id/1461259206/photo/university-of-istanbul-turkey.jpg?s=612x612&w=0&k=20&c=iwhfsa4Rfygf7pM1mUmJtj53TIYucS5EDJ8U5yVKjlY=)",
                    }}
                >
                    <div className="hero-overlay"></div>
                    <div className="hero-content text-neutral-content text-center">
                        <div className="max-w-md">
                            <h1 className="mb-5 text-2xl md:text-3xl lg:text-5xl font-bold">Your Gateway to Higher Education</h1>
                            <p className="mb-5 text-xs px-12 md:px-0 md:text-sm lg:px-0 lg:text-lg">
                                Explore funding opportunities, connect with universities, and make your education dreams a reality with our platform.
                            </p>
                            <button className="btn btn-primary bg-green-950">Explore More</button>
                        </div>
                    </div>
                </div>
                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide2" className="btn btn-circle">❮</a>
                    <a href="#slide1" className="btn btn-circle">❯</a>
                </div>
            </div>
        </div>
    );
};

export default Banner;