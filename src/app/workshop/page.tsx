'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Nav from '@/components/Nav';

const workshopsData = [
  {
    title: 'Aero Vicks',
    description:
      'In 2023, the Aeromodelling Club of NIT Kurukshetra organized its first-ever aircraft-building workshop named Aerovics. The workshop focused on teaching the fundamentals of aerodynamics, aircraft components, and the basic principles behind fixed-wing flight. Participants got hands-on experience in designing and fabricating their own RC planes, followed by an exciting flying session where they tested their creations. Aerovics provided students with a complete introduction to the world of RC planes, combining theory with practical application to deepen their understanding of aircraft design and flight mechanics.',
    images: [
      '/planeimages/av.jpg',
      '/planeimages/rc_bg.jpg',
      '/planeimages/rc_bg2.jpg',
    ],
  },
  {
    title: 'Skyforge 1.0',
    description:
      'In 2024, Aeromodelling Club successfully organized a three-day drone workshop named SkyForge, designed to introduce participants to the world of drones from scratch. The workshop covered essential theoretical concepts. Alongside theory, participants engaged in hands-on sessions that included drone fabrication, assembly, calibration and a live flying session, giving them a complete end-to-end experience of building and flying a drone. SkyForge was a perfect blend of learning and practical exposure, aimed at nurturing interest and skill in drone technology among students.',
    images: [
      '/skyforge1/sk1.jpg',
      '/skyforge1/sk5.JPG',
      '/skyforge1/sk3.jpg',
    ],
  },
  {
    title: 'Skyforge 2.0',
    description:
      'In 2024, Aeromodelling Club successfully organized a three-day drone workshop named SkyForge, designed to introduce participants to the world of drones from scratch. The workshop covered essential theoretical concepts. Alongside theory, participants engaged in hands-on sessions that included drone fabrication, assembly, calibration and a live flying session, giving them a complete end-to-end experience of building and flying a drone. SkyForge was a perfect blend of learning and practical exposure, aimed at nurturing interest and skill in drone technology among students.',
    images: [
      '/skyforge2/sk.JPG',
      '/skyforge2/skk.JPG',
      '/skyforge2/skkk.JPG',
    ],
  }
];

const Workshops = () => {
  const [currentPanel, setCurrentPanel] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const isScrollingRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      // For mobile, use Intersection Observer to track current panel
      const sections = document.querySelectorAll('section');
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = Array.from(sections).indexOf(entry.target as HTMLElement);
              setCurrentPanel(index);
            }
          });
        },
        { threshold: 0.5 }
      );

      sections.forEach((section) => observer.observe(section));

      return () => observer.disconnect();
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isScrollingRef.current) return;
      
      isScrollingRef.current = true;
      
      if (e.deltaY > 0 && currentPanel < workshopsData.length) {
        setCurrentPanel(prev => prev + 1);
      } else if (e.deltaY < 0 && currentPanel > 0) {
        setCurrentPanel(prev => prev - 1);
      }
      
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 700);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [currentPanel, isMobile]);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartYRef.current || isScrollingRef.current) return;

      const touchEndY = e.touches[0].clientY;
      const diff = touchStartYRef.current - touchEndY;

      if (Math.abs(diff) > 50) {
        isScrollingRef.current = true;
        
        if (diff > 0 && currentPanel < workshopsData.length) {
          setCurrentPanel(prev => prev + 1);
        } else if (diff < 0 && currentPanel > 0) {
          setCurrentPanel(prev => prev - 1);
        }

        touchStartYRef.current = null;
        
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 700);
      }
    };

    const handleTouchEnd = () => {
      touchStartYRef.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentPanel]);

  const maxPanels = workshopsData.length;

  if (isMobile) {
    // Mobile view with snap scrolling
    return (
      <div className="bg-[#e5e5dd] text-[#111] h-screen overflow-y-scroll snap-y snap-mandatory">
        {/* Animated background elements */}
        <Nav/>
        <div className="fixed inset-0 pointer-events-none opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#111] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#111] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Progress indicator for mobile */}
        <div className="fixed top-6 right-6 flex flex-col gap-2 z-50">
          {[...Array(maxPanels + 1)].map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                currentPanel === index ? 'bg-[#111] scale-150' : 'bg-[#111] opacity-30'
              }`}
            />
          ))}
        </div>

        {/* Intro Section */}
        <section className="h-screen snap-start flex flex-col justify-center items-center text-center p-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#111] to-transparent opacity-5"></div>
          <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-wider relative z-10 mb-4">
            Workshops
          </h1>
          <div className="w-20 h-1 bg-[#111] mb-4"></div>
          <p className="mt-4 text-sm sm:text-base max-w-2xl mx-auto relative z-10 leading-relaxed px-4">
           Aeromodelling Club of NIT Kurukshetra has been successfully organizing workshops over the past few years, aimed at enhancing students&apos; knowledge and practical skills in areas like drone technology, aerodynamics, and emerging tech domains. These workshops offer a perfect blend of theory and hands-on experience, helping students gain deeper insights and real-world understanding beyond the classroom.
          </p>
          <div className="mt-8 animate-bounce">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* Workshop Sections */}
        {workshopsData.map((workshop, index) => (
          <section
            key={index}
            className="h-screen snap-start flex items-center justify-center p-6 relative overflow-y-auto"
          >
            <div className="flex flex-col gap-6 w-full max-w-2xl relative z-10 my-auto">
              {/* Text content */}
              <div className="flex flex-col">
                <div className="mb-2 flex items-center gap-4">
                  <span className="text-3xl font-bold opacity-10">0{index + 1}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 uppercase relative inline-block">
                  {workshop.title}
                  <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-[#111]"></span>
                </h2>
                <p className="text-sm sm:text-base leading-relaxed mb-4">
                  {workshop.description}
                </p>
                <button className="self-start px-6 py-2 border-2 border-[#111] hover:bg-[#111] hover:text-[#e5e5dd] transition-all duration-300 font-semibold uppercase tracking-wider group text-xs sm:text-sm">
                  Learn More
                  <span className="inline-block ml-2 transition-transform group-hover:translate-x-2">→</span>
                </button>
              </div>

              {/* Image gallery */}
              <div className="grid grid-cols-2 grid-rows-2 gap-3 h-64 sm:h-80">
                <div className="relative col-span-1 row-span-2 group overflow-hidden rounded-lg">
                  <Image
                    src={workshop.images[0]}
                    alt={`${workshop.title} image 1`}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover shadow-2xl"
                  />
                </div>
                <div className="relative col-span-1 row-span-1 group overflow-hidden rounded-lg">
                  <Image
                    src={workshop.images[1]}
                    alt={`${workshop.title} image 2`}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover shadow-2xl"
                  />
                </div>
                <div className="relative col-span-1 row-span-1 group overflow-hidden rounded-lg">
                  <Image
                    src={workshop.images[2]}
                    alt={`${workshop.title} image 3`}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    );
  }

  // Desktop view with snap scrolling
  return (
    <div className="bg-[#e5e5dd] text-[#111] relative overflow-hidden h-screen w-screen">
      {/* Animated background elements */}
      <Nav/>
      
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#111] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#111] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Progress indicator */}
      <div className="fixed top-8 right-8 flex flex-col gap-3 z-50">
        {[...Array(maxPanels + 1)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPanel(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentPanel === index ? 'bg-[#111] scale-150' : 'bg-[#111] opacity-30'
            }`}
            aria-label={`Go to ${index === 0 ? 'intro' : `workshop ${index}`}`}
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
          <h1 className="text-6xl lg:text-7xl font-bold uppercase tracking-wider relative z-10 mb-6">
            Workshops
          </h1>
          <div className="w-24 h-1 bg-[#111] mb-6"></div>
          <p className="mt-4 text-lg lg:text-xl max-w-3xl mx-auto relative z-10 leading-relaxed">
           Aeromodelling Club of NIT Kurukshetra has been successfully organizing workshops over the past few years, aimed at enhancing students&apos; knowledge and practical skills in areas like drone technology, aerodynamics, and emerging tech domains. These workshops offer a perfect blend of theory and hands-on experience, helping students gain deeper insights and real-world understanding beyond the classroom.
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
            className="h-screen w-screen flex items-center justify-center p-8 xl:p-12 relative"
          >
            {/* Decorative corner elements */}
            <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-[#111] opacity-20"></div>
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-[#111] opacity-20"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16 items-center w-full max-w-7xl relative z-10">
              {/* Text content */}
              <div className={`flex flex-col justify-center ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="mb-4 flex items-center gap-4">
                  <span className="text-6xl xl:text-7xl font-bold opacity-10">0{index + 1}</span>
                </div>
                <h2 className="text-4xl xl:text-5xl font-bold mb-6 uppercase relative inline-block">
                  {workshop.title}
                  <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-[#111]"></span>
                </h2>
                <p className="text-lg xl:text-xl leading-relaxed mb-8 max-w-2xl">
                  {workshop.description}
                </p>
                <button className="self-start px-8 py-3 border-2 border-[#111] hover:bg-[#111] hover:text-[#e5e5dd] transition-all duration-300 font-semibold uppercase tracking-wider group">
                  Learn More
                  <span className="inline-block ml-2 transition-transform group-hover:translate-x-2">→</span>
                </button>
              </div>

              {/* Image gallery */}
              <div className={`relative grid grid-cols-2 grid-rows-2 gap-4 h-96 xl:h-[450px] ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="relative col-span-1 row-span-2 group overflow-hidden rounded-lg">
                  <Image
                    src={workshop.images[0]}
                    alt={`${workshop.title} image 1`}
                    width={600}
                    height={450}
                    className="w-full h-full object-cover shadow-2xl transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#111] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </div>
                <div className="relative col-span-1 row-span-1 group overflow-hidden rounded-lg">
                  <Image
                    src={workshop.images[1]}
                    alt={`${workshop.title} image 2`}
                    width={600}
                    height={450}
                    className="w-full h-full object-cover shadow-2xl transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#111] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </div>
                <div className="relative col-span-1 row-span-1 group overflow-hidden rounded-lg">
                  <Image
                    src={workshop.images[2]}
                    alt={`${workshop.title} image 3`}
                    width={600}
                    height={450}
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