'use client';

import { useState, useRef, useEffect } from 'react';
import Nav from '../../components/Nav';
import { motion } from 'framer-motion';
import ContactMini from '../../components/ContactMini';
import Image from 'next/image';

const DronePage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  
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
      
      // Progress indicator update interval (updates every 50ms)
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
  
  // Handle manual wheel events and pause auto-scrolling temporarily
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setIsPaused(true); // Pause auto-scrolling
      container.scrollLeft += e.deltaY;
      
      // Update active section based on scroll position
      const scrollPosition = container.scrollLeft;
      const totalWidth = container.scrollWidth;
      const sectionWidth = totalWidth / 4;
      const newActiveSection = Math.floor((scrollPosition + sectionWidth/2) / sectionWidth);
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
  
  // Handle manual section clicks
  const goToSection = (index: number) => {
    const container = scrollContainerRef.current;
    if (container) {
      setIsPaused(true); // Pause auto-scrolling
      const sectionPosition = (container.scrollWidth / 4) * index;
      container.scrollTo({ left: sectionPosition, behavior: 'smooth' });
      setActiveSection(index);
      setProgress(0);
      
      // Resume auto-scrolling after 5 seconds
      setTimeout(() => {
        setIsPaused(false);
      }, 5000);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const droneProjects = [
    {
      title: "Object Tracking Drone",
      description: "Advanced drone with real-time object tracking capabilities using computer vision algorithms.",
      image: "/droneimages/project1.jpg",
      rotation: "-rotate-3"
    },
    {
      title: "Arduino Mini Drone",
      description: "DIY drone kit perfect for beginners, built with Arduino technology for easy customization.",
      image: "/droneimages/project2.jpg",
      rotation: "rotate-2"
    },
    {
      title: "FPV Racing Drone",
      description: "High-speed racing drone with first-person view capabilities for immersive flight experience.",
      image: "/droneimages/project3.jpg",
      rotation: "-rotate-1"
    }
  ];

  const faqs = [
    {
      question: "What types of drones are there?",
      answer: "There are several types including quadcopters, hexacopters, fixed-wing drones, and hybrid VTOL models. Each has unique advantages depending on your application needs."
    },
    {
      question: "What are the legal requirements for flying drones?",
      answer: "Requirements typically include registration, maintaining line-of-sight, avoiding no-fly zones, and possibly obtaining a license depending on your location and purpose (recreational vs. commercial)."
    },
    {
      question: "How long can drones fly on a single charge?",
      answer: "Flight time varies significantly by model, from 5-10 minutes for mini drones to 20-30 minutes for consumer models, and up to 40+ minutes for professional-grade drones."
    },
    {
      question: "What features should I look for when buying a drone?",
      answer: "Consider camera quality, flight time, range, GPS capabilities, obstacle avoidance, flight modes, size/portability, and whether it has a 'return to home' feature."
    },
    {
      question: "How do I maintain my drone?",
      answer: "Regular maintenance includes checking propellers for damage, cleaning motors and sensors, battery care, firmware updates, and calibration before flights."
    }
  ];

  return (
    <div className="min-h-screen bg-[#e5e5dd] text-black overflow-hidden">
      <Nav />
      
      {/* Small Logo */}
      <div className="fixed bottom-8 left-8 z-40 w-10 h-10 rounded-full bg-[#e5e5dd] border border-black flex items-center justify-center">
        <span className="font-bold">N</span>
      </div>
      
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
              <path d="M8 5v14l11-7z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
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
          <div className="absolute top-12 left-12 text-[8rem] font-bold opacity-10">01</div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-5xl"
          >
            <h1 className="text-[4rem] md:text-[8rem] font-bold leading-none tracking-wider uppercase mb-6">
              Drones
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl font-light tracking-wide">
              The future of aerial technology and innovation
            </p>
          </motion.div>
          
          {/* Background Video with Reduced Opacity */}
          <div className="absolute right-0 bottom-0 w-1/2 h-1/2 opacity-20 overflow-hidden">
            <video
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
              src="/droneimages/drone-video.mp4"
            />
          </div>
        </section>
        
        {/* Introduction Section - 02 */}
        <section className="min-w-full h-screen flex items-center snap-start relative px-12 md:px-20">
          <div className="absolute top-12 left-12 text-[8rem] font-bold opacity-10">02</div>
          <div className="flex flex-col md:flex-row gap-12 items-start max-w-6xl">
            <motion.div 
              className="md:w-2/3"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold uppercase mb-8 tracking-wider">Unmanned Aerial Vehicles</h2>
              <p className="text-lg mb-6 font-light">
                Drones, or Unmanned Aerial Vehicles (UAVs), are aircraft that can be navigated without a human pilot onboard. 
                They can be remotely controlled or fly autonomously through software-controlled flight plans.
              </p>
              <p className="text-lg mb-6 font-light">
                The AeroModelling Club provides a platform for students to explore drone technology 
                through design, building, and flying. Our members gain practical engineering experience while working on 
                cutting-edge aerial technology projects.
              </p>
            </motion.div>
            
            <motion.div 
              className="md:w-1/3 border border-black p-8"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold mb-6 tracking-wider">Drone Pilot's Checklist</h3>
              <ul className="space-y-3">
                {["Double tape, cello tape", "ESCs, battery", "Screw driver, L-keys", 
                  "Motor, motor screw box", "Propellers", 
                  "Transmitter, receiver"].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 font-bold">—</span>
                    <span className="font-light">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>
        
        {/* Projects Section - 03 */}
        <section className="min-w-full h-screen flex items-center snap-start relative px-12 md:px-20">
          <div className="absolute top-12 left-12 text-[8rem] font-bold opacity-10">03</div>
          <div className="w-full max-w-6xl">
            <motion.h2 
              className="text-3xl md:text-5xl font-bold uppercase mb-12 tracking-wider"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Latest Projects
            </motion.h2>
            
            <div className="relative h-[500px]">
              {droneProjects.map((project, index) => (
                <motion.div 
                  key={index}
                  className={`absolute ${project.rotation} shadow-lg`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03, zIndex: 10 }}
                  style={{
                    left: `${index * 15 + 5}%`, 
                    top: `${index % 2 === 0 ? 10 : 20}%`,
                    zIndex: index
                  }}
                >
                  <div className="w-[350px] h-[250px] relative overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="bg-[#e5e5dd] p-6 border-t border-black">
                    <h3 className="text-xl font-bold mb-2 tracking-wide">{project.title}</h3>
                    <p className="text-sm font-light">{project.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQs Section - 04 */}
        <section className="min-w-full h-screen flex items-center snap-start relative px-12 md:px-20">
          <div className="absolute top-12 left-12 text-[8rem] font-bold opacity-10">04</div>
          <div className="w-full max-w-4xl mx-auto">
            <motion.h2 
              className="text-3xl md:text-5xl font-bold uppercase mb-12 tracking-wider"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              FAQ
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqs.slice(0, 4).map((faq, index) => (
                <motion.div 
                  key={index}
                  className="border-t border-black pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <button
                    className="w-full text-left flex justify-between items-center mb-2"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-bold text-lg tracking-wide">{faq.question}</span>
                    <span className="text-2xl">{openFaq === index ? '−' : '+'}</span>
                  </button>
                  
                  <motion.div 
                    className="overflow-hidden"
                    initial={{ height: 0 }}
                    animate={{ height: openFaq === index ? 'auto' : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="pb-4 font-light">
                      {faq.answer}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
            
            {/* Contact/Join Section */}
            <motion.div
              className="mt-20 border-t border-black pt-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-xl font-light mb-6">
                Interested in drones? Join our club to learn, build, and fly together.
              </p>
              <button className="border border-black px-10 py-3 text-lg font-bold tracking-wider hover:bg-black hover:text-[#e5e5dd] transition-colors">
                Contact Us
              </button>
            </motion.div>
          </div>
        </section>
      </div>
      
      {/* Custom Styles */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        body {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default DronePage;
