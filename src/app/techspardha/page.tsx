'use client';

import Nav from '../../components/Nav';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

const events = [
    {
        name: "Drone Webfiesta",
        images: [
            "/galleryimages/techspardha/dronewebfiesta1.jpg",
            "/galleryimages/techspardha/dronewebfiesta2.jpg",
            "/galleryimages/techspardha/dronewebfiesta3.jpg",
        ],
        description:
            "Teams design, assemble, and fly drones through challenging tasks and obstacle courses. The event offers hands-on learning in drone mechanics, control, and teamwork, blending creativity with aerial performance.",
    },
    {
        name: "High Sky",
        images: [
            "/galleryimages/techspardha/highsky1.jpg",
            "/galleryimages/techspardha/highsky2.jpg",
            "/galleryimages/techspardha/highsky3.jpg",
        ],
        description:
            "Teams of four design, build, and fly RC aircraft with strong gliding ability. Participants learn flight basics, aerodynamics, and RC controls like transmitters and servo motors. The goal — craft a stable plane that flies smoothly and performs precise maneuvers.",
    },
    {
        name: "Drone Racing League",
        images: [
            "/galleryimages/techspardha/droneracing1.jpg",
            "/galleryimages/techspardha/droneracing2.jpg",
            "/galleryimages/techspardha/droneracing3.jpg",
        ],
        description:
            "A fast-paced drone race where participants fly mini drones through thrilling tracks. Success depends on speed, control, and tuning for stability — a perfect test of reflexes, design, and flying skill.",
    },
    {
        name: "SimSky",
        images: [
            "/galleryimages/techspardha/simsky1.jpg",
            "/galleryimages/techspardha/simsky2.jpg",
            "/galleryimages/techspardha/simsky3.jpg",
        ],
        description:
            "A virtual drone race using real transmitters connected to simulators. Participants fly drones in Acro mode, competing for the fastest lap times on virtual tracks. It’s a realistic blend of gaming and aeromodelling — no drone required.",
    },
];

const Techspardha = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [scrollY, setScrollY] = useState(0);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Set initial window size
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen w-full bg-gradient-to-br from-[#e5e5dd] via-[#f5f5ed] to-[#e5e5dd] text-black font-sans relative flex flex-col items-center overflow-hidden">
            {/* Enhanced Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Animated gradient orbs with parallax */}
                <div 
                    className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-blue-200/20 to-purple-300/20 blur-3xl animate-pulse"
                    style={{
                        top: `${20 - scrollY * 0.2}px`,
                        left: '10%',
                        animation: 'pulse 6s ease-in-out infinite'
                    }}
                ></div>
                <div 
                    className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-pink-200/20 to-orange-300/20 blur-3xl animate-pulse"
                    style={{
                        bottom: `${20 + scrollY * 0.15}px`,
                        right: '5%',
                        animation: 'pulse 8s ease-in-out infinite 2s'
                    }}
                ></div>
                <div 
                    className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-cyan-200/15 to-blue-300/15 blur-2xl animate-pulse"
                    style={{
                        top: '50%',
                        left: '50%',
                        transform: `translate(-50%, -50%) translateY(${scrollY * 0.1}px)`,
                        animation: 'pulse 10s ease-in-out infinite 4s'
                    }}
                ></div>
                

                
                {/* Floating geometric shapes */}
                <div 
                    className="absolute w-32 h-32 border-2 border-purple-300/20 rounded-3xl rotate-45"
                    style={{
                        top: '15%',
                        right: '15%',
                        animation: 'float 8s ease-in-out infinite',
                        transform: `rotate(45deg) translateY(${Math.sin(scrollY * 0.01) * 20}px)`
                    }}
                ></div>
                <div 
                    className="absolute w-24 h-24 border-2 border-blue-300/20 rounded-2xl -rotate-12"
                    style={{
                        bottom: '25%',
                        left: '10%',
                        animation: 'float 10s ease-in-out infinite 2s',
                        transform: `rotate(-12deg) translateY(${Math.cos(scrollY * 0.01) * 15}px)`
                    }}
                ></div>
                <div 
                    className="absolute w-20 h-20 bg-gradient-to-br from-orange-200/10 to-pink-200/10 rounded-full"
                    style={{
                        top: '60%',
                        right: '25%',
                        animation: 'float 12s ease-in-out infinite 4s',
                        transform: `translateY(${Math.sin(scrollY * 0.015) * 25}px)`
                    }}
                ></div>
                
                {/* Animated particles that follow mouse */}
                {windowSize.width > 0 && [...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full transition-all duration-1000"
                        style={{
                            left: `${(i * 7 + 10) % 90}%`,
                            top: `${(i * 11 + 15) % 85}%`,
                            background: `radial-gradient(circle, ${
                                ['#8B5CF6', '#3B82F6', '#F59E0B', '#10B981'][i % 4]
                            }40, transparent)`,
                            transform: `translate(${(mousePos.x - windowSize.width / 2) * (i * 0.002)}px, ${(mousePos.y - windowSize.height / 2) * (i * 0.002)}px)`,
                            animation: `float ${8 + i * 0.5}s ease-in-out infinite ${i * 0.3}s`
                        }}
                    ></div>
                ))}
                
                {/* Diagonal lines pattern */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="diagonal-lines" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <line x1="0" y1="0" x2="40" y2="40" stroke="#222" strokeWidth="1"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#diagonal-lines)"/>
                </svg>
            </div>
            
            {/* CSS Animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    25% { transform: translateY(-20px) translateX(10px); }
                    50% { transform: translateY(-15px) translateX(-10px); }
                    75% { transform: translateY(-25px) translateX(5px); }
                }
            `}</style>
            
            <Nav />
            <div className="flex flex-col items-center justify-center w-full pt-32 md:pt-40 pb-12 relative z-10">
                {/* Elegant Title */}
                <div className="mb-12 md:mb-16 relative px-4">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-center font-final relative leading-tight mb-4 md:mb-0">
                        <span className="inline-block">Techspardha</span>
                        
                    </h1>
                </div>

                {/* Subtitle */}
                <p className="max-w-3xl text-center text-xl md:text-2xl font-medium mb-10 md:mb-12 font-santoshi text-[#333] px-6 leading-relaxed">
                    Experience the ultimate drone and aeromodelling competition
                </p>

                {/* About Techspardha */}
                <div className="max-w-4xl text-center mb-20 px-6">
                    <p className="text-lg md:text-xl font-normal font-santoshi leading-loose text-[#444] tracking-wide">
                        Techspardha is NIT Kurukshetra&apos;s national-level techno-managerial fest, celebrating innovation, technology, and engineering excellence. It brings together some of the brightest minds from across the country to showcase their creativity, technical skills, and problem-solving abilities through a wide range of competitions, workshops, and exhibitions.
                    </p>
                </div>

                {/* Theme Launch Section - images left, heading right */}
                <div className="w-full max-w-7xl mb-24 px-4">
                    <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-white/60 shadow-xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            {/* Images - left column */}
                            <div className="order-1 lg:order-1">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="relative h-[260px] md:h-[300px] overflow-hidden rounded-2xl shadow-lg group">
                                        <Image
                                            src="/galleryimages/techspardha/theme-launch-1.jpg"
                                            alt="Theme Launch Main"
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative h-[140px] overflow-hidden rounded-2xl shadow-lg group">
                                            <Image
                                                src="/galleryimages/techspardha/theme-launch-2.jpg"
                                                alt="Theme Launch Crowd"
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                        <div className="relative h-[140px] overflow-hidden rounded-2xl shadow-lg group">
                                            <Image
                                                src="/galleryimages/techspardha/theme-launch-3.jpg"
                                                alt="Theme Launch Stage"
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Heading & Description - right column */}
                            <div className="order-2 lg:order-2 text-center lg:text-right">
                                <div className="inline-block mb-4 px-4 py-1 bg-[#111] text-white rounded-full">
                                    <span className="text-xs md:text-sm font-santoshi font-semibold tracking-wider">
                                        HIGHLIGHT EVENT
                                    </span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold font-final uppercase tracking-wide text-[#111] mb-6">
                                    Theme Launch
                                </h2>
                                <p className="text-lg md:text-xl font-santoshi leading-relaxed text-[#111] max-w-2xl mx-auto lg:mx-0">
                                    The Theme Launch event marks the grand opening of Techspardha, where we unveil the central theme that will inspire all competitions and activities throughout the festival. This spectacular event brings together students, faculty, and aviation enthusiasts to kick off an unforgettable journey.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Events Section Header */}
                <div className="w-full max-w-7xl mb-12 px-4 text-center">

                    <h2 className="text-5xl md:text-6xl font-bold font-final uppercase tracking-wide mb-6 text-[#111]">
                        Events
                    </h2>
                    <p className="text-lg md:text-xl font-santoshi text-[#555] max-w-3xl mx-auto leading-relaxed">
                        Compete in cutting-edge drone and aeromodelling competitions that test your skills, creativity, and technical expertise
                    </p>
                    <div className="mt-8 w-24 h-1 bg-gradient-to-r from-transparent via-[#222] to-transparent mx-auto"></div>
                </div>

                {/* Events - Clean Modern Design */}
                <div className="w-full max-w-7xl px-4 mb-16">
                    <div className="flex flex-col gap-8">
                    {events.map((event, index) => {
                        const isEven = index % 2 === 0;
                        
                        return (
                            <div
                                key={event.name}
                                className="group relative"
                            >
                                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:grid-flow-dense' : ''}`}>
                                    {/* Text Content */}
                                    <div className={isEven ? '' : 'lg:col-start-2'}>
                                        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-final uppercase tracking-wide text-[#111]">
                                            {event.name}
                                        </h2>
                                        <p className="text-lg md:text-xl font-santoshi leading-relaxed text-[#111] mb-8">
                                            {event.description}
                                        </p>
                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-4">
                                            <button className="px-8 py-3 bg-[#111] text-white font-santoshi font-semibold rounded-full hover:bg-[#333] transition-colors duration-300">
                                                Register
                                            </button>
                                            <button className="px-8 py-3 border-2 border-[#111] text-[#111] font-santoshi font-semibold rounded-full hover:bg-[#111] hover:text-white transition-all duration-300">
                                                Leaderboard
                                            </button>
                                        </div>
                                    </div>

                                    {/* Image Grid - 2x2 with 3 images */}
                                    <div className={`relative grid grid-cols-2 grid-rows-2 gap-4 h-[350px] ${!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                                        {/* Large image - takes full left column */}
                                        <div className="relative row-span-2 rounded-lg overflow-hidden shadow-lg">
                                            <Image
                                                src={event.images[0]}
                                                alt={`${event.name} - Main`}
                                                fill
                                                sizes="(max-width: 768px) 50vw, 25vw"
                                                className="object-cover"
                                            />
                                        </div>
                                        
                                        {/* Top right image */}
                                        <div className="relative rounded-lg overflow-hidden shadow-lg">
                                            <Image
                                                src={event.images[1]}
                                                alt={`${event.name} - Detail 1`}
                                                fill
                                                sizes="(max-width: 768px) 50vw, 25vw"
                                                className="object-cover"
                                            />
                                        </div>
                                        
                                        {/* Bottom right image */}
                                        <div className="relative rounded-lg overflow-hidden shadow-lg">
                                            <Image
                                                src={event.images[2]}
                                                alt={`${event.name} - Detail 2`}
                                                fill
                                                sizes="(max-width: 768px) 50vw, 25vw"
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Techspardha;