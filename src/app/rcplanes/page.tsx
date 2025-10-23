'use client';

import { useState, useRef, useEffect } from 'react';
import Nav from '../../components/Nav';
import { motion } from 'framer-motion';

import Image from 'next/image';

interface TeamMember {
  name: string;
  role: string;
  email: string;
  rollNo: string;
  batch: string;
  branch: string;
  image: string;
  subDomain?: string;
  timestamp?: string;
}

const RCPlanesPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  // Time in milliseconds to stay on each section
  const sectionDuration = 6000;

  // Auto-scroll between sections
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let interval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;
    let progressValue = 0;

    if (!isPaused) {
      // Main interval for changing sections
      interval = setInterval(() => {
        const nextSection = (activeSection + 1) % 4;
        const sectionPosition = (container.scrollWidth / 4) * nextSection;

        container.scrollTo({
          left: sectionPosition,
          behavior: 'smooth'
        });

        setActiveSection(nextSection);
        progressValue = 0;
      }, sectionDuration);

      // Progress indicator update interval
      progressInterval = setInterval(() => {
        progressValue += (50 / sectionDuration) * 100;
        setProgress(Math.min(progressValue, 100));
      }, 50);
    }

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [activeSection, isPaused]);

  // Handle manual wheel events
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setIsPaused(true);
      container.scrollLeft += e.deltaY;

      // Update active section based on scroll position
      const scrollPosition = container.scrollLeft;
      const totalWidth = container.scrollWidth;
      const sectionWidth = totalWidth / 4;
      const newActiveSection = Math.floor((scrollPosition + sectionWidth / 2) / sectionWidth);
      setActiveSection(newActiveSection);

      // Resume auto-scrolling after 5 seconds of inactivity
      const resumeTimer = setTimeout(() => {
        setIsPaused(false);
      }, 5000);

      return () => clearTimeout(resumeTimer);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleProjectWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const container = e.currentTarget;
    const scrollAmount = e.deltaY;

    // Smooth scroll animation
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  const goToSection = (index: number) => {
    const container = scrollContainerRef.current;
    if (container) {
      setIsPaused(true);
      const sectionPosition = (container.scrollWidth / 4) * index;
      container.scrollTo({ left: sectionPosition, behavior: 'smooth' });
      setActiveSection(index);
      setProgress(0);

      setTimeout(() => {
        setIsPaused(false);
      }, 5000);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const planeProjects = [
    {
      title: "Ornithopter",
      description: "A bio-inspired RC plane that mimics the flight of birds using flapping wings.",
      image: "/planeimages/ornithopter.jpg",
      rotation: "-rotate-3"
    },
    {
      title: "Pixhawk-Based Automatic Plane",
      description: "An advanced RC plane equipped with a Pixhawk flight controller for autonomous flight capabilities.",
      image: "/planeimages/pixhawk.jpg",
      rotation: "rotate-2"
    },
    {
      title: "VTOL Aircraft",
      description: "Aircraft capable of taking off and landing vertically, combining agility and versatility for diverse missions.",
      image: "/planeimages/vtol.jpg",
      rotation: "-rotate-1"
    }
  ];

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Fetch RC Planes team members from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoadingMembers(true);
        const response = await fetch(API_URL + '/api/members?team=rc');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTeamMembers(data);
      } catch (err) {
        console.error('Error fetching RC team members:', err);
        // Set empty array on error
        setTeamMembers([]);
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchMembers();
  }, []);

  // Group members by year of graduation (batch)
  const groupedMembers = teamMembers.reduce((groups: Record<string, TeamMember[]>, member) => {
    const year = member.batch || 'Unknown';
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(member);
    return groups;
  }, {});

  // Sort years in ascending order (earliest graduation year first)
  const sortedYears = Object.keys(groupedMembers).sort((a, b) => {
    if (a === 'Unknown') return 1;
    if (b === 'Unknown') return -1;
    return a.localeCompare(b);
  });



  return (
    <div className="min-h-screen bg-[#e5e5dd] text-black overflow-hidden">
      <Nav />





      {/* Section Indicators with Progress Bar */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex space-x-6">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-2 h-2 rounded-full cursor-pointer mb-2 ${activeSection === index ? 'bg-black' : 'bg-gray-400'}`}
              onClick={() => goToSection(index)}
            ></div>
            {activeSection === index && (
              <div className="w-10 h-0.5 bg-gray-300 relative">
                <motion.div
                  className="h-full bg-black absolute top-0 left-0"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              </div>
            )}
          </div>
        ))}

        {/* Pause/Play Button */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="ml-4 w-6 h-6 flex items-center justify-center rounded-full border border-black"
        >
          {isPaused ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          )}
        </button>
      </div>

      {/* Horizontal Scrolling Container */}
      <div
        ref={scrollContainerRef}
        className="flex w-full h-screen overflow-x-scroll snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Hero Section - 01 */}
        <section className="min-w-full h-screen flex flex-col justify-center snap-start relative px-12 md:px-20">
          <div className="absolute top-12 left-12 text-[8rem] font-bold opacity-50">01</div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-5xl z-10 relative"
          >
            <h1 className="text-[4rem] md:text-[8rem] font-bold leading-none tracking-wider uppercase mb-6">
              RC Planes in Action
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl font-light tracking-wide">
              RC planes are redefining the thrill of flight, putting precision and control directly in your hands. With advanced aerodynamics, responsive controls, and durable designs, they’re more than just hobbyist tools; they are expressions of skill, innovation, and the joy of mastering the skies.
            </p>
          </motion.div>

          {/* Background Image with Reduced Opacity */}
          <div className="absolute right-0 bottom-0 w-full h-full opacity-60 overflow-hidden">
            <Image
              src="/planeimages/rc_bg2.jpg"
              alt="RC Plane in flight"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </section>
        {/* Introduction Section - 02 (Responsive) */}
        {/* Introduction Section - 02 (Responsive & Corrected Stacking) */}
        <section className="min-w-full min-h-screen flex md:items-center snap-start relative px-6 sm:px-12 md:px-20 pt-32 pb-24 md:pt-24 md:pb-20  ">

          {/* Decorative "02" - Pushed down and placed BEHIND content */}
          <div className="absolute top-32 left-6 sm:left-12 md:left-20 text-[5rem] md:text-[7rem] font-bold opacity-50 z-20">02</div>

          {/* Content Wrapper - Placed ON TOP of "02" */}
          <div className="relative flex flex-col md:flex-row gap-8 md:gap-12 items-start max-w-6xl z-30">

            {/* Left Column: Text Content */}
            <motion.div
              className="md:w-2/3 w-full"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase mb-8 tracking-wider">Radio Controlled Aircrafts</h3>
              <p className="text-base sm:text-lg mb-6">
                RC planes are taking model aviation to new heights, blending aerodynamic design, responsive controls, and agile performance. From recreational flying to competitive events, they offer an immersive experience that brings the skies within reach.
                At the Aeromodelling Club, we create high-performance RC aircraft engineered for accuracy, reliability, and excitement. By combining innovative design with precise handling, we give enthusiasts the tools to explore, compete, and master the art of flight.
                “Airplanes are beautiful dreams. Engineers turn dreams into reality”
                ~The wind rises

              </p>
            </motion.div>

            {/* Right Column: Checklist - Changed border to be visible on dark bg */}
            <motion.div
              className="md:w-1/3 w-full border border-gray-600 p-6 md:p-8"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold mb-6 tracking-wider">Flyer&apos;s Checklist</h3>
              <ul className="space-y-3">
                {[
                  "Double Tape, Cello Tape, Cutter",
                  "ESCs, Battery",
                  "Screw Driver",
                  "Styrofoam, Balsa Wood",
                  "Motor, Motor Screw Box",
                  "Rubber Band, Propellers",
                  "Transmitter, Receiver"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 font-bold">—</span>
                    <span className="font-light">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Background Image Overlay - Placed behind everything, above bg color */}
          {/* <div className="absolute inset-0 w-full h-full opacity-30 z-10 overflow-hidden">
    <Image
      src="/planeimages/rc_bg.jpg"
      alt="RC Plane in flight"
      fill
      style={{ objectFit: 'cover' }}
    />
  </div> */}
        </section>
        {/* Projects Section - 03 */}
        <section className="min-w-full h-screen flex flex-col snap-start relative px-4 sm:px-8 md:px-12 lg:px-20">
          <div className="absolute top-12 left-12 text-[8rem] font-bold opacity-10">03</div>
          <div className="w-full max-w-6xl mx-auto pt-20 md:pt-24">
            <motion.h2
              className="text-3xl md:text-5xl font-bold uppercase mb-8 tracking-wider"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Latest RC Plane Projects
            </motion.h2>

            <div
              className="h-[calc(100vh-200px)] overflow-x-auto custom-scrollbar project-scroll"
              onWheel={handleProjectWheel}
            >
              <div className="flex space-x-6 md:space-x-8 pb-8 px-4 min-w-max">
                {planeProjects.map((project, index) => (
                  <motion.div
                    key={index}
                    className="w-[300px] md:w-[400px] flex-shrink-0 bg-white/5 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="h-[200px] md:h-[250px] relative">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 300px, 400px"
                      />
                    </div>
                    <div className="p-6 bg-[#e5e5dd]">
                      <h3 className="text-xl md:text-2xl font-bold mb-3 tracking-wide">{project.title}</h3>
                      <p className="text-sm md:text-base font-light leading-relaxed">{project.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* Team Section - 04 */}
        <section className="min-w-full h-screen flex flex-col snap-start relative px-4 sm:px-8 md:px-12 lg:px-20">
          <div className="absolute top-10 md:top-20 left-6 bottom-5 md:left-12 text-[4rem] md:text-[8rem] font-bold opacity-10"></div>
          <div className="w-full max-w-[1400px] mx-auto h-full pt-20 md:pt-24">
            <motion.h2
              className="text-2xl sm:text-3xl md:text-5xl font-bold uppercase mb-8 tracking-wider"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Our Team
            </motion.h2>

            <div
              className="h-[calc(100vh-200px)] overflow-y-auto pr-2 md:pr-4 custom-scrollbar"
              onWheel={(e) => {
                e.currentTarget.scrollTop += e.deltaY;
              }}
            >
              {loadingMembers ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading team members...</p>
                  </div>
                </div>
              ) : sortedYears.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-600">No team members found</p>
                </div>
              ) : (
                sortedYears.map((year) => (
                  <div key={year} className="mb-12">
                    {/* Year Heading */}
                    <motion.h3
                      className="text-xl sm:text-2xl md:text-3xl font-bold uppercase mb-6 tracking-wide border-b-2 border-black pb-2"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                    >
                      Batch of {year}
                    </motion.h3>

                    {/* Members Grid for this year */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                      {groupedMembers[year].map((member: TeamMember, index: number) => (
                        <motion.div
                          key={`${year}-${index}`}
                          className="relative group mx-auto w-full max-w-sm"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <div className="relative w-full aspect-3/4 overflow-hidden rounded-lg bg-gray-900 shadow-lg">
                            <Image
                              src={member.image || '/galleryimages/1.jpg'}
                              alt={member.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 sm:p-6">
                              <div className="flex justify-end space-x-3 sm:space-x-4">
                                <a href={`mailto:${member.email}`} className="text-white hover:text-gray-200">
                                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                  </svg>
                                </a>
                              </div>
                              <div className="text-white">
                                <p className="text-xs sm:text-sm">{member.branch}</p>
                                {member.subDomain && (
                                  <p className="text-xs sm:text-sm mt-1 opacity-80">{member.subDomain}</p>
                                )}
                              </div>
                            </div>
                          </div>
                          {/* Name and Role - Always visible */}
                          <div className="mt-3 sm:mt-4">
                            <h3 className="text-base sm:text-lg font-bold tracking-wide">{member.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">{member.role}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
        body {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default RCPlanesPage;
