'use client';

import Nav from '../../components/Nav';

const events = [
    {
        name: "CodeSprint",
        images: [
            "/galleryimages/techspardha/codesprint1.jpg",
            "/galleryimages/techspardha/codesprint2.jpg",
        ],
        description:
            "A fast-paced coding competition where participants solve challenging problems under time pressure. Test your algorithmic skills and compete with the best minds.",
    },
    {
        name: "RoboWars",
        images: [
            // "/galleryimages/techspardha/robowars1.jpg",
            // "/galleryimages/techspardha/robowars2.jpg",
        ],
        description:
            "Witness the ultimate battle of bots! Teams design, build, and pit their robots against each other in a thrilling arena showdown.",
    },
    {
        name: "TechQuiz",
        images: [
            // "/galleryimages/techspardha/techquiz1.jpg",
            // "/galleryimages/techspardha/techquiz2.jpg",
        ],
        description:
            "A quiz event to challenge your knowledge of technology, science, and innovation. Form a team and prove your mettle in this brainy battle.",
    },
    {
        name: "InnovateX",
        images: [
            // "/galleryimages/techspardha/innovatex1.jpg",
            // "/galleryimages/techspardha/innovatex2.jpg",
        ],
        description:
            "Showcase your innovative projects and ideas. Present to a panel of judges and get recognized for your creativity and problem-solving skills.",
    },
];

const Techspardha = () => {
    return (
        <div className="min-h-screen w-full bg-[#e5e5dd] text-black font-sans relative flex flex-col items-center overflow-hidden">
            {/* Cover Photo Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url('/galleryimages/cover/techspardha.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.18,
                }}
            />
            <Nav />
            <div className="flex flex-col items-center justify-center w-full pt-24 pb-12 relative z-10">
                {/* Title */}
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-center font-final">
                    Techspardha
                </h1>
                {/* About */}
                <p className="max-w-2xl text-center text-lg md:text-xl text-[#444] mb-12 font-santoshi">
                    Techspardha is the annual technical festival that brings together the brightest minds to celebrate innovation, creativity, and technology. 
                    From coding marathons to robotics battles, the fest offers a platform for students to showcase their talents and compete in a variety of events. 
                    With workshops, quizzes, and project exhibitions, Techspardha fosters learning and collaboration. 
                    Join us for an unforgettable experience filled with excitement, challenges, and opportunities to grow. 
                    Whether you are a tech enthusiast or a curious learner, Techspardha has something for everyone. 
                    Be a part of the future—be a part of Techspardha!
                </p>
                {/* Events */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
                    {events.map((event, idx) => (
                        <div
                            key={event.name}
                            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center"
                        >
                            <h2 className="text-2xl font-bold mb-4 text-[#222] font-final">{event.name}</h2>
                            <div className="flex gap-4 mb-4">
                                {event.images.map((img, i) => (
                                    <img
                                        key={i}
                                        src={img}
                                        alt={event.name + " gallery " + (i + 1)}
                                        className="w-32 h-24 object-cover rounded-lg border border-[#e5e5dd] shadow"
                                    />
                                ))}
                            </div>
                            <p className="text-[#444] text-center font-santoshi">{event.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Techspardha;