'use client';

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
gsap.registerPlugin(ScrollTrigger);

type CardType = {
    src: string;
    text: string;
};

export default function BestGlasses() {
    const stickySection = useRef<HTMLDivElement | null>(null);
    const countContainer = useRef<HTMLDivElement | null>(null);
    const cards = useRef<(HTMLDivElement | null)[]>([]);
    const introRef = useRef<HTMLElement | null>(null);

    // Array of objects with image src and paragraph text
    const items: CardType[] = [
        {
            src: "https://res.cloudinary.com/djczgyd7j/image/upload/v1753444482/img1_nqnb3y.jpg",
            text: "Classic full-rim frames that blend timeless style with modern durability.",
        },
        {
            src: "https://res.cloudinary.com/djczgyd7j/image/upload/v1753444484/img2_b6czzy.jpg",
            text: "Lightweight metal frames offering a sleek and professional look.",
        },
        {
            src: "https://res.cloudinary.com/djczgyd7j/image/upload/v1753444486/img3_okzr6g.jpg",
            text: "Bold and trendy acetate frames perfect for making a statement.",
        },
        {
            src: "https://res.cloudinary.com/djczgyd7j/image/upload/v1753444485/img4_n5o7bx.webp",
            text: "Minimalist frameless design for a clean, barely-there aesthetic.",
        },
        {
            src: "https://res.cloudinary.com/djczgyd7j/image/upload/v1753444486/img5_rkncc2.webp",
            text: "Discover our stylish and affordable eyewear crafted for everyday comfort.",
        }
    ];

    useEffect(() => {
        if (introRef.current) {
            gsap.fromTo(
                introRef.current,
                { clipPath: "inset(0 100% 0 0)" },
                {
                    clipPath: "inset(0 0% 0 0)",
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: introRef.current,
                        start: "top 80%",
                        end: "bottom 20%",
                        scrub: true,
                    },
                }
            );
        }

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
            const totalTravel = 1 + totalCards / 7.5;
            const adjustedProgress = (progress * totalTravel - 1) * 0.75;

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

        const scrollTriggerInstance = ScrollTrigger.create({
            trigger: stickySection.current,
            start: "top top+=1",
            end: `+=${stickyHeight}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.3,
            onUpdate: (self) => {
                positionCards(self.progress);
                let index = Math.floor(self.progress * totalCards);
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

        // Handle window resize
        function handleResize() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                positionCards(0);
                ScrollTrigger.refresh();
            }, 150);
        }

        // Handle initial page load
        function handleLoaded() {
            clearTimeout(loadTimeout);
            loadTimeout = setTimeout(() => {
                positionCards(0);
                ScrollTrigger.refresh();
            }, 100);
        }

        // Attach listeners
        window.addEventListener("resize", handleResize);

        if (document.readyState === "complete") {
            handleLoaded();
        } else {
            window.addEventListener("load", handleLoaded);
        }

        // Cleanup
        return () => {
            scrollTriggerInstance.kill();
            clearTimeout(resizeTimeout);
            clearTimeout(loadTimeout);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("load", handleLoaded);
        };

    }, []);

    return (
        <div className="relative bg-[#e5e5dd] text-[#111] w-screen min-h-[900vh]">
            {/* Intro */}
            <Link href="/products">
                <section
                    ref={introRef}
                    className="h-screen w-screen bg-center bg-no-repeat bg-cover cursor-pointer"
                    style={{ backgroundImage: `url(https://res.cloudinary.com/djczgyd7j/image/upload/v1753444281/6_szkx0i.jpg)` }}
                    title="Go to Products"
                ></section>
            </Link>

            {/* Steps */}
            <section ref={stickySection} className="relative h-screen w-screen overflow-hidden">
                <div className="absolute flex flex-col m-4 md:m-8 select-none z-9 font-final">
                    <div className="relative w-[1200px] h-[150px] overflow-hidden clip-path-polygon">
                        <h1 className="uppercase font-black text-[2rem] sm:text-[4rem] md:text-[6rem] xl:text-[8rem] leading-none tracking-tight whitespace-nowrap">
                            Best Frames
                        </h1>
                    </div>
                    <div className="relative w-[1200px] h-[120px]   -top-2 overflow-hidden clip-path-polygon">
                        <div
                            ref={countContainer}
                            className="relative flex flex-col will-change-transform"
                            style={{
                                transformOrigin: "center",
                                transform: "translateX(120px)",
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
                                    className="card empty w-[500px] h-[550px] opacity-0"
                                    ref={(el) => (cards.current[idx] = el)}
                                ></div>
                            );
                        }
                        return (
                            <div
                                key={idx}
                                className="card w-[500px] h-[550px] flex flex-col gap-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                ref={(el) => (cards.current[idx] = el)}
                            >
                                <div className="card-img rounded-lg overflow-hidden flex-1">
                                    <img
                                        src={item.src}
                                        alt={`Step ${idx + 1}`}
                                        className="w-[80%] h-[80%] object-cover"
                                        loading="eager"
                                    />
                                </div>
                                <div className="card-content">
                                    <p className="text-[#111] text-[1.1rem] font-santoshi  font-medium leading-snug text-left">
                                        {item.text}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Styles */}
            <style>{`
        .card {
        position: absolute;
        width: 500px;
        height: 550px;
        top: 50%;
        left: 50%;
        transform-origin: center center;
        margin-left: -250px;
        display: flex;
        flex-direction: column;
        gap: 1em;
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
            width: 350px;
            height: 400px;
            margin-left: -175px;
          }
          .relative.w-[1200px] {
            width: 90vw !important;
          }
          .text-[150px] {
            font-size: 5rem !important;
            line-height: 1;
          }
        }
        @media (max-width: 600px) {
          .card {
            width: 280px;
            height: 350px;
            margin-left: -140px;
          }
          .text-[150px] {
            font-size: 4rem !important;
            line-height: 1;
          }
        }
      `}</style>
        </div>
    );
}