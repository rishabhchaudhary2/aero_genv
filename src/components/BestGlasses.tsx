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
      src: "/planeimages/rc_bg2.jpg",
      text: "RC planes gliding through the skies, reflecting innovation, control, and the passion for aerodynamics that drives the spirit of modern engineering.",
      link: "/rcplanes",
    },
    {
      src: "/galleryimages/drone.jpg",
      text: "Drones soaring high, embodying innovation, precision, and the spirit of modern engineering, showcasing how creativity and technology come together to redefine the future of flight.",
      link: "/drones",
    },
    {
      src: "/galleryimages/techspardha.jpg",
      text: "At Techspardha, the Aero Club of NIT Kurukshetra inspired students to build drones and RC planes, ending with a thrilling competition of skill and flight.",
      link: "/techspardha",
    },
    {
      src: "/galleryimages/workshop1.jpg",
      text: "Skyforge, where freshers explored the fascinating world of drones and discovered how innovation truly takes flight with the Aero Club.",
      link: "/workshop",
    },
    {
      src: "/galleryimages/5.jpg",
      text: "Aero Club soaring beyond boundaries, showcasing cutting-edge drone and RC plane innovations while excelling in national competitions against the best.",
      link: "/external_events",
    },
  ];

  useEffect(() => {
    const stickyHeight = window.innerHeight * 7;
    const totalCards = cards.current.length;

    function getRadius() {
      if (window.innerWidth < 600) return window.innerWidth * 5;
      if (window.innerWidth < 900) return window.innerWidth * 6;
      return window.innerWidth * 2.5;
    }

    function getArcAngle() {
      return window.innerWidth < 600 ? Math.PI * 0.6 : Math.PI * 0.4;
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

        gsap.set(card, {
          x,
          y: -y + radius,
          rotation: -rotation,
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
    <div className="relative bg-[#ffffff] text-[#111] w-screen min-h-[900vh]">
      <section
        ref={stickySection}
        className="relative h-screen w-screen overflow-hidden"
      >
        <div className="absolute flex flex-col m-4 md:m-8 select-none z-9 font-final">
          <div className="relative w-[1200px] h-[150px] overflow-hidden clip-path-polygon">
            <h1 className="uppercase font-black text-[2rem] sm:text-[4rem] md:text-[6rem] xl:text-[8rem] leading-none tracking-tight whitespace-nowrap">
              What We Do!
            </h1>
          </div>
          <div className="relative w-[1200px] h-[120px] -top-2 overflow-hidden clip-path-polygon">
            <div
              ref={countContainer}
              className="relative flex flex-col will-change-transform"
              style={{
                transformOrigin: "center",
                transform: "translate(120px, 150px)",
              }}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <h1
                  key={num}
                  className="uppercase font-bold text-[9rem] leading-none tracking-tight whitespace-nowrap"
                >
                  {num.toString().padStart(2, "0")}
                </h1>
              ))}
            </div>
          </div>
        </div>

        {/* Cards */}
        <div
          className="absolute top-[25%] left-1/2 w-[150vw] h-[600px] -translate-x-1/2 will-change-transform z-10"
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
                className="card flex flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                ref={(el) => {
                  if (el && cards.current) cards.current[idx] = el;
                }}
              >
                <Link href={item.link} className="block w-[90%] h-[75%] mx-auto mt-2">
                  <Image
                    src={item.src}
                    alt={`Step ${idx + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                    width={360} // reduced size slightly
                    height={320}
                    priority
                  />
                </Link>
                <div className="card-content mt-1">
                  <p className="text-[#111] text-[1.1rem] font-santoshi font-medium leading-snug text-left">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <style>{`
        .card {
          position: absolute;
          width: 400px; /* slightly reduced */
          height: 480px; /* slightly reduced */
          top: 50%;
          left: 50%;
          transform-origin: center center;
          display: flex;
          flex-direction: column;
          will-change: transform;
        }

        .empty {
          opacity: 0 !important;
        }
        .clip-path-polygon {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
        }
        @media (max-width: 900px) {
          .card {
            width: 300px;
            height: 380px;
          }
        }
        @media (max-width: 600px) {
          .card {
            width: 240px;
            height: 320px;
          }
        }
      `}</style>
    </div>
  );
}
