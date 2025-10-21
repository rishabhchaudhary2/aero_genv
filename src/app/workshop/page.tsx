'use client';

import { useEffect, useRef, useState } from 'react';

const workshopsData = [
  {
    title: 'Aero Vicks',
    description:
      'Learn the principles of aerodynamics and build your own glider from scratch. This workshop covers everything from airfoil design to construction techniques using balsa wood and foam.',
    images: [
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23d4d4cc" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="20" fill="%23111"%3EAero Vicks 1%3C/text%3E%3C/svg%3E',
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23c9c9c1" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="20" fill="%23111"%3EAero Vicks 2%3C/text%3E%3C/svg%3E',
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23bebeb6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="20" fill="%23111"%3EAero Vicks 3%3C/text%3E%3C/svg%3E'
    ],
  },
  {
    title: 'Skyforge 1.0',
    description:
      'Dive into the fast-paced world of FPV (First-Person View) drone racing. Assemble your own racing drone, learn to fly, and compete against fellow enthusiasts on a custom-designed track.',
    images: [
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23d4d4cc" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="20" fill="%23111"%3ESkyforge 1.0 A%3C/text%3E%3C/svg%3E',
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23c9c9c1" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="20" fill="%23111"%3ESkyforge 1.0 B%3C/text%3E%3C/svg%3E',
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23bebeb6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="20" fill="%23111"%3ESkyforge 1.0 C%3C/text%3E%3C/svg%3E'
    ],
  },
  {
    title: 'Skyforge 2.0',
    description:
      'Explore the electronics that power modern aircraft. This workshop focuses on programming flight controllers, setting up GPS modules, and implementing autonomous flight missions.',
    images: [
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23d4d4cc" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="20" fill="%23111"%3ESkyforge 2.0 A%3C/text%3E%3C/svg%3E',
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23c9c9c1" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="20" fill="%23111"%3ESkyforge 2.0 B%3C/text%3E%3C/svg%3E',
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23bebeb6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="20" fill="%23111"%3ESkyforge 2.0 C%3C/text%3E%3C/svg%3E'
    ],
  }
];

const Workshops = () => {
  const [currentPanel, setCurrentPanel] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null); // Specify type for the DOM element
  const scrollingRef = useRef<boolean>(false); // Specify type for the boolean flag
  const touchStartY = useRef<number | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref to store timeout ID

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => { // Explicitly type the event
      if (scrollingRef.current) return;
      
      const delta = e.deltaY;
      if (Math.abs(delta) > 10) {
        scrollingRef.current = true;
        
        // Clear any existing timeout before setting a new one
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        if (delta > 0) {
          setCurrentPanel(prev => Math.min(prev + 1, workshopsData.length));
        } else if (delta < 0) {
          setCurrentPanel(prev => Math.max(prev - 1, 0));
        }
        
        scrollTimeoutRef.current = setTimeout(() => {
          scrollingRef.current = false;
          scrollTimeoutRef.current = null; // Reset ref after timeout fires
        }, 800);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (scrollingRef.current) return;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (scrollingRef.current || touchStartY.current === null) return;

      const currentY = e.touches[0].clientY;
      const delta = touchStartY.current - currentY;
      const swipeThreshold = 50; // Minimum distance for a swipe

      if (Math.abs(delta) > swipeThreshold) {
        scrollingRef.current = true;

        if (delta > 0) {
          setCurrentPanel(prev => Math.min(prev + 1, workshopsData.length));
        } else if (delta < 0) {
          setCurrentPanel(prev => Math.max(prev - 1, 0));
        }

        touchStartY.current = null; // Reset after swipe

        setTimeout(() => {
          scrollingRef.current = false;
        }, 800);
      }
    };

    const container = containerRef.current;
    container?.addEventListener('wheel', handleScroll, { passive: true });
    container?.addEventListener('touchstart', handleTouchStart, { passive: true });
    container?.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    return () => {
      container?.removeEventListener('wheel', handleScroll);
      container?.removeEventListener('touchstart', handleTouchStart);
      container?.removeEventListener('touchmove', handleTouchMove);
      // Clear timeout on component unmount or re-run of effect
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="bg-[#e5e5dd] text-[#111] relative overflow-hidden h-screen">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#111] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#111] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Progress indicator */}
      <div className="fixed top-8 right-8 flex flex-col gap-3 z-50">
        {[0, ...workshopsData.map((_, i) => i + 1)].map((index) => (
          <button
            key={index}
            onClick={() => setCurrentPanel(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentPanel === index ? 'bg-[#111] scale-150' : 'bg-[#111] opacity-30'
            }`}
          />
        ))}
      </div>

      {/* Panels container */}
      <div 
        className="relative h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateY(-${currentPanel * 100}vh)` }}
      >
        {/* Intro Panel */}
        <section className="h-screen flex flex-col justify-center items-center text-center p-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#111] to-transparent opacity-5"></div>
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-wider relative z-10 mb-6">
            Workshops
          </h1>
          <div className="w-24 h-1 bg-[#111] mb-6"></div>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto relative z-10 leading-relaxed">
            From foundational principles to advanced applications, our workshops are designed to
            equip you with the skills and knowledge to excel in the world of aerospace.
          </p>
          <div className="mt-12 animate-bounce">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* Workshop Panels */}
        {workshopsData.map((workshop, index) => (
          <section
            key={index}
            className="h-screen w-screen flex items-center justify-center p-8 relative"
          >
            {/* Decorative corner elements */}
            <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-[#111] opacity-20"></div>
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-[#111] opacity-20"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full max-w-7xl relative z-10">
              {/* Text content */}
              <div className={`flex flex-col justify-center ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="mb-4 flex items-center gap-4">
                  <span className="text-6xl font-bold opacity-10">0{index + 1}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 uppercase relative inline-block">
                  {workshop.title}
                  <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-[#111]"></span>
                </h2>
                <p className="text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
                  {workshop.description}
                </p>
                <button className="self-start px-8 py-3 border-2 border-[#111] hover:bg-[#111] hover:text-[#e5e5dd] transition-all duration-300 font-semibold uppercase tracking-wider group">
                  Learn More
                  <span className="inline-block ml-2 transition-transform group-hover:translate-x-2">→</span>
                </button>
              </div>

              {/* Image gallery */}
              <div className={`relative grid grid-cols-2 grid-rows-2 gap-4 h-96 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="relative col-span-1 row-span-2 group overflow-hidden rounded-lg">
                  <img
                    src={workshop.images[0]}
                    alt={`${workshop.title} image 1`}
                    className="w-full h-full object-cover shadow-2xl transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#111] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </div>
                <div className="relative col-span-1 row-span-1 group overflow-hidden rounded-lg">
                  <img
                    src={workshop.images[1]}
                    alt={`${workshop.title} image 2`}
                    className="w-full h-full object-cover shadow-2xl transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#111] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </div>
                <div className="relative col-span-1 row-span-1 group overflow-hidden rounded-lg">
                  <img
                    src={workshop.images[2]}
                    alt={`${workshop.title} image 3`}
                    className="w-full h-full object-cover shadow-2xl transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#111] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Workshops;