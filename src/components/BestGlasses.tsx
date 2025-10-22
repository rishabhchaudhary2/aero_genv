'use client';

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";


gsap.registerPlugin(ScrollTrigger);

type CardType = {
  src: string;
  text: string;
  link: string;
};

export default function BestGlasses() {
  const stickySection = useRef<HTMLDivElement>(null);
  const countContainer = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLDivElement[]>([]);

  const items: CardType[] = [
    {
      src: "/planeimages/pixhawk.jpg",
      text: "Innovative projects bringing ideas to life — from ornithopters and VTOL aircraft to Pixhawk-powered autonomous planes. Explore our cutting-edge creations.",
      link: "/workshop",
    },
    {
      src: "/galleryimages/techspardha/dronewebfiesta2.jpg",
      text: "At Techspardha, the Aero Club of NIT Kurukshetra inspired students to build drones and RC planes, ending with a thrilling competition of skill and flight.",
      link: "/techspardha",
    },
    {
      src: "/galleryimages/workshop1.jpg",
      text: "Skyforge, where freshers explored the fascinating world of drones and discovered how innovation truly takes flight with the Aero Club.",
      link: "/workshop",
    },
    {
      src: "/galleryimages/techspardha/theme-launch-1.jpg",
      text: "Aero Club soaring beyond boundaries, showcasing cutting-edge drone and RC plane innovations while excelling in national competitions against the best.",
      link: "/techspardha",
    },
  ];

  useEffect(() => {
    const stickyHeight = window.innerHeight * 7;
    const totalCards = cards.current.length;

    function getRadius() {
      if (window.innerWidth < 480) return window.innerWidth * 3.5;
      if (window.innerWidth < 768) return window.innerWidth * 4;
      if (window.innerWidth < 1024) return window.innerWidth * 3;
      if (window.innerWidth < 1440) return window.innerWidth * 2.2;
      return window.innerWidth * 2;
    }

    function getArcAngle() {
      if (window.innerWidth < 480) return Math.PI * 0.8;
      if (window.innerWidth < 768) return Math.PI * 0.75;
      if (window.innerWidth < 1024) return Math.PI * 0.6;
      return Math.PI * 0.5;
    }

    function positionCards(progress = 0) {
      const radius = getRadius();
      const arcAngle = getArcAngle();
      const startAngle = Math.PI / 2 - arcAngle / 2;
      const totalTravel = 1 + totalCards / 6.1;
      const adjustedProgress = (progress * totalTravel - 1) * 0.7;

      cards.current.forEach((card, i) => {
        if (!card) return;
        const normalizedProgress = (totalCards - 1 - i) / totalCards;
        const cardProgress = normalizedProgress + adjustedProgress;
        const clampedProgress = Math.min(Math.max(cardProgress, 0), 1);
        const angle = startAngle + arcAngle * clampedProgress;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const rotation = (angle - Math.PI / 2) * (180 / Math.PI);

        // Add scale based on position for depth effect
        const scale = 0.85 + (clampedProgress * 0.15);
        const zIndex = Math.floor(clampedProgress * 100);

        gsap.set(card, {
          x,
          y: -y + radius,
          rotation: -rotation,
          scale: scale,
          zIndex: zIndex,
          transformOrigin: "center center",
        });
      });
    }

    positionCards(0);

    if (countContainer.current) {
      gsap.set(countContainer.current, { y: 150 });
    }

    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: stickySection.current,
      start: "top top+=1",
      end: `+=${stickyHeight}`,
      pin: true,
      pinSpacing: true,
      scrub: 0.3,
      onUpdate: (self) => {
        positionCards(self.progress);
        const adjustedProgressForIndex = Math.max(0, self.progress * 1.3);
        let index = Math.floor(adjustedProgressForIndex * totalCards);
        if (index >= totalCards) index = totalCards - 1;
        const targetY = 150 - index * 150;
        gsap.to(countContainer.current, {
          y: targetY,
          duration: 0.3,
          ease: "power1.out",
          overwrite: true,
        });
      },
    });

    let resizeTimeout: NodeJS.Timeout;
    let loadTimeout: NodeJS.Timeout;

    function handleResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        positionCards(0);
        ScrollTrigger.refresh();
      }, 150);
    }

    function handleLoaded() {
      clearTimeout(loadTimeout);
      loadTimeout = setTimeout(() => {
        positionCards(0);
        ScrollTrigger.refresh();
      }, 100);
    }

    window.addEventListener("resize", handleResize);

    if (document.readyState === "complete") {
      handleLoaded();
    } else {
      window.addEventListener("load", handleLoaded);
    }

    return () => {
      scrollTriggerInstance.kill();
      clearTimeout(resizeTimeout);
      clearTimeout(loadTimeout);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleLoaded);
    };
  }, []);

  return (
    <div className="relative bg-gradient-to-b from-[#ffffff] via-[#f8f9fa] to-[#e5e5dd] text-[#111] w-screen min-h-[900vh]">
      <section
        ref={stickySection}
        className="relative h-screen w-screen overflow-hidden"
      >
        {/* Decorative Background Elements - Made Subtler */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-10 left-5 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-5 w-80 h-80 bg-green-200/30 rounded-full blur-3xl"></div>
        </div>

        {/* Header Section */}
        <div className="absolute flex flex-col m-3 sm:m-4 md:m-6 lg:m-8 xl:m-12 select-none z-20 font-final">
          <div className="relative overflow-hidden">
            <h1 className="uppercase font-bold text-[1.5rem] xs:text-[2rem] sm:text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] xl:text-[5.5rem] leading-none tracking-tight whitespace-nowrap text-[#111]">
              What We Do
            </h1>
            <div className="mt-1 sm:mt-2 md:mt-3">
              <p className="text-[0.65rem] xs:text-xs sm:text-sm md:text-base text-[#555] font-final max-w-xs sm:max-w-md md:max-w-lg leading-relaxed">
                Discover our passion for aviation through innovative projects and exciting events
              </p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div
          className="absolute top-[20%] sm:top-[22%] md:top-[25%] left-1/2 w-[150vw] h-[400px] sm:h-[500px] md:h-[600px] -translate-x-1/2 will-change-transform z-10"
          aria-label="Cards Container"
        >
          {[...items, null, null].map((item, idx) => {
            if (!item) {
              return (
                <div
                  key={"empty" + idx}
                  className="card empty opacity-0"
                  ref={(el) => {
                    if (el && cards.current) cards.current[idx] = el;
                  }}
                ></div>
              );
            }
            return (
              <div
                key={idx}
                className="card flex flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group"
                ref={(el) => {
                  if (el && cards.current) cards.current[idx] = el;
                }}
              >
                <Link href={item.link} className="block w-full h-full relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl bg-white transform transition-all duration-500 hover:scale-105 active:scale-95">
                  {/* Image Container with Overlay */}
                  <div className="relative w-full h-[60%] sm:h-[62%] md:h-[65%] overflow-hidden">
                    <Image
                      src={item.src}
                      alt={`Step ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      width={450}
                      height={350}
                      priority
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="card-content p-3 sm:p-4 md:p-5 lg:p-6 h-[40%] sm:h-[38%] md:h-[35%] flex flex-col justify-between bg-white">
                    <p className="text-[#111] text-[0.75rem] xs:text-xs sm:text-sm md:text-base lg:text-[1rem] font-final leading-tight sm:leading-snug md:leading-relaxed text-left line-clamp-3 sm:line-clamp-4 md:line-clamp-5 group-hover:text-[#195E39] transition-colors duration-300">
                      {item.text}
                    </p>
                    
                    {/* Hover Arrow Indicator */}
                    <div className="mt-2 sm:mt-3 flex items-center gap-1 sm:gap-2 text-[#195E39] opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                      <span className="text-[0.6rem] xs:text-[0.65rem] sm:text-xs md:text-sm font-semibold uppercase tracking-wider">Explore</span>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Border Accent */}
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-transparent sm:border-2 group-hover:border-[#195E39]/30 transition-all duration-500"></div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <style>{`
        .card {
          position: absolute;
          width: 360px;
          height: 450px;
          top: 50%;
          left: 50%;
          transform-origin: center center;
          display: flex;
          flex-direction: column;
          will-change: transform;
          filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.15));
          transition: filter 0.3s ease;
        }

        .card:hover {
          filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.25));
        }

        .empty {
          opacity: 0 !important;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-5 {
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Extra Small Devices */
        @media (max-width: 479px) {
          .card {
            width: 220px;
            height: 300px;
            filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.15));
          }
          .card:hover {
            filter: drop-shadow(0 12px 30px rgba(0, 0, 0, 0.22));
          }
        }

        /* Small Devices (Phones) */
        @media (min-width: 480px) and (max-width: 639px) {
          .card {
            width: 250px;
            height: 340px;
            filter: drop-shadow(0 8px 22px rgba(0, 0, 0, 0.15));
          }
          .card:hover {
            filter: drop-shadow(0 14px 32px rgba(0, 0, 0, 0.23));
          }
        }

        /* Small to Medium Devices */
        @media (min-width: 640px) and (max-width: 767px) {
          .card {
            width: 280px;
            height: 370px;
            filter: drop-shadow(0 9px 24px rgba(0, 0, 0, 0.15));
          }
          .card:hover {
            filter: drop-shadow(0 16px 34px rgba(0, 0, 0, 0.24));
          }
        }

        /* Medium Devices (Tablets) */
        @media (min-width: 768px) and (max-width: 1023px) {
          .card {
            width: 320px;
            height: 410px;
            filter: drop-shadow(0 10px 26px rgba(0, 0, 0, 0.16));
          }
          .card:hover {
            filter: drop-shadow(0 18px 36px rgba(0, 0, 0, 0.25));
          }
        }

        /* Large Devices (Small Laptops) */
        @media (min-width: 1024px) and (max-width: 1279px) {
          .card {
            width: 340px;
            height: 430px;
            filter: drop-shadow(0 10px 28px rgba(0, 0, 0, 0.16));
          }
          .card:hover {
            filter: drop-shadow(0 20px 38px rgba(0, 0, 0, 0.26));
          }
        }

        /* Extra Large Devices (Large Laptops and Desktops) */
        @media (min-width: 1280px) and (max-width: 1535px) {
          .card {
            width: 360px;
            height: 450px;
          }
        }

        /* 2XL Devices (Large Desktops) */
        @media (min-width: 1536px) {
          .card {
            width: 380px;
            height: 480px;
          }
        }
      `}</style>
    </div>
  );
}
