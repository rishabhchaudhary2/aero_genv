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
        ],
        description:
            "An exciting competition focused on designing, building, and showcasing drone prototypes. Participants demonstrate their drones' stable flight capabilities and tackle various performance challenges to prove their engineering prowess.",
    },
    {
        name: "High Sky",
        images: [
            "/galleryimages/techspardha/highsky1.jpg",
            "/galleryimages/techspardha/highsky2.jpg",
        ],
        description:
            "A thrilling aerial event spotlighting RC (radio-controlled) planes with perfect mid-air maneuvers and precision control. Watch skilled pilots showcase their abilities as they navigate through challenging flight patterns and aerial stunts.",
    },
    {
        name: "Drone Racing League",
        images: [
            "/galleryimages/techspardha/droneracing1.jpg",
            "/galleryimages/techspardha/droneracing2.jpg",
        ],
        description:
            "Experience high-octane competitive drone racing emphasizing speed, agility, and obstacle navigation. Pilots push their drones to the limit as they race through complex courses, testing reflexes and flying skills in an adrenaline-pumping competition.",
    },
    {
        name: "SimSky",
        images: [
            "/galleryimages/techspardha/simsky1.jpg",
            "/galleryimages/techspardha/simsky2.jpg",
        ],
        description:
            "Enter the world of virtual drone-racing simulation for strategic and precision-based competitions. Perfect your flying techniques in a digital environment where strategy, timing, and control determine victory without the constraints of physical flight.",
    },
];

const Techspardha = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
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
                
                {/* Grid pattern overlay */}
                <div 
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, #222 1px, transparent 1px),
                            linear-gradient(to bottom, #222 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px',
                        transform: `translateY(${scrollY * 0.5}px)`
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
            <div className="flex flex-col items-center justify-center w-full pt-24 pb-12 relative z-10">
                {/* Elegant Title */}
                <div className="mb-12 relative">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-center font-final relative">
                        <span className="inline-block">Techspardha</span>
                        <span className="block text-3xl md:text-4xl mt-4 text-[#222] font-normal">
                            2025
                        </span>
                    </h1>
                </div>

                {/* Subtitle */}
                <p className="max-w-3xl text-center text-lg md:text-xl mb-16 font-santoshi text-[#444] px-4">
                    Experience the ultimate drone and aeromodelling competition
                </p>
                {/* Events - Clean Modern Design */}
                <div className="w-full max-w-7xl px-4 mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {events.map((event, index) => {
                        const isHovered = hoveredCard === index;
                        const accentColors = ['#8B5CF6', '#3B82F6', '#F59E0B', '#10B981'];
                        
                        return (
                            <div
                                key={event.name}
                                onMouseEnter={() => setHoveredCard(index)}
                                onMouseLeave={() => setHoveredCard(null)}
                                className="group relative"
                            >
                                <div className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2">
                                    {/* Clean number badge */}
                                    <div 
                                        className="absolute top-4 left-4 z-20 w-12 h-12 bg-[#222] text-white rounded-full flex items-center justify-center font-bold text-xl font-final shadow-lg transition-all duration-300"
                                        style={{
                                            backgroundColor: isHovered ? accentColors[index] : '#222'
                                        }}
                                    >
                                        {index + 1}
                                    </div>
                                    
                                    {/* Main image with subtle effects */}
                                    <div className="relative h-64 overflow-hidden">
                                        <Image
                                            src={event.images[0]}
                                            alt={event.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div 
                                            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                                            style={{ backgroundColor: accentColors[index] }}
                                        ></div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 relative">
                                        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-[#222] font-final">
                                            {event.name}
                                        </h2>

                                        {/* Accent line */}
                                        <div 
                                            className="w-16 h-1 mb-4 transition-all duration-500"
                                            style={{ 
                                                backgroundColor: accentColors[index],
                                                width: isHovered ? '100%' : '64px'
                                            }}
                                        ></div>

                                        {/* Secondary image */}
                                        <div className="relative h-28 mb-4 rounded-xl overflow-hidden border-2 border-[#e5e5dd] shadow-md">
                                            <Image
                                                src={event.images[1]}
                                                alt={event.name}
                                                fill
                                                sizes="400px"
                                                className="object-cover"
                                            />
                                        </div>

                                        <p className="text-[#444] font-santoshi leading-relaxed mb-6 text-sm">
                                            {event.description}
                                        </p>

                                        {/* Clean buttons */}
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button 
                                                className="flex-1 text-white px-6 py-3 rounded-full font-bold font-final hover:scale-105 hover:brightness-110 transition-all duration-300 shadow-md hover:shadow-lg"
                                                style={{ backgroundColor: '#deb887' }}
                                            >
                                                Register
                                            </button>
                                            <button className="flex-1 bg-white text-[#222] border-2 px-6 py-3 rounded-full font-bold font-final hover:brightness-110 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg" style={{ borderColor: '#deb887' }}>
                                                Leaderboard
                                            </button>
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