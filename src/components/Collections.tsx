'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const spotlightItems = [
    { name: "Crystal Acetate", img: "/galleryimages/1.jpg" },
    { name: "Amit Aggarwal", img: "/galleryimages/2.jpg" },
    { name: "Batman", img: "/galleryimages/3.jpg" },
    { name: "Indoor", img: "/galleryimages/4.jpg" },
    { name: "Driving", img: "/galleryimages/5.jpg" },
    { name: "Hiphop", img: "/galleryimages/6.jpg" },
    { name: "Casual", img: "/galleryimages/7.jpg" },
    { name: "Phonic", img: "/galleryimages/8.jpg" },
    { name: "Harry Potter", img: "/galleryimages/9.jpg" },
    { name: "Superman", img: "/galleryimages/10.jpg" },
];

const config = {
    gap: 0.08,
    speed: 0.31,
    arcRadius: 500,
};

const Spotlight: React.FC = () => {
    const [mounted, setMounted] = useState(false);
    const titlesContainerRef = useRef<HTMLDivElement | null>(null);
    const imagesContainerRef = useRef<HTMLDivElement | null>(null);
    const spotlightHeaderRef = useRef<HTMLDivElement | null>(null);
    const titlesContainerElementRef = useRef<HTMLDivElement | null>(null);
    const introTextElementsRef = useRef<Array<HTMLDivElement | null>>([]);
    const spotlightBgImgRef = useRef<HTMLDivElement | null>(null);
    const [bgImgSrc, setBgImgSrc] = useState<string>(spotlightItems[0].img);

    const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
    const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useLayoutEffect(() => {
        if (!mounted) return;

        const lenis = new Lenis();
        lenisRef.current = lenis;

        const rafCallback = (time: number) => {
            lenis.raf(time * 1000);
        };

        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(rafCallback);
        gsap.ticker.lagSmoothing(0);

        if (!titlesContainerRef.current || !imagesContainerRef.current) return;

        let currentActiveIndex = 0;

        const containerWidth = window.innerWidth * 0.3;
        const containerHeight = window.innerHeight;

        const arcStartX = containerWidth - 220;
        const arcStartY = -200;
        const arcEndY = containerHeight + 200;
        const arcControlPointX = arcStartX + config.arcRadius;
        const arcControlPointY = containerHeight / 2;

        function getBezierPosition(t: number) {
            const x =
                (1 - t) * (1 - t) * arcStartX +
                2 * (1 - t) * t * arcControlPointX +
                t * t * arcStartX;
            const y =
                (1 - t) * (1 - t) * arcStartY +
                2 * (1 - t) * t * arcControlPointY +
                t * t * arcEndY;
            return { x, y };
        }

        function getImgProgressState(index: number, overallProgress: number) {
            const startTime = index * config.gap;
            const endTime = startTime + config.speed;

            if (overallProgress < startTime) return -1;
            if (overallProgress > endTime) return 2;

            return (overallProgress - startTime) / config.speed;
        }

        // Set initial states
        imageRefs.current.forEach((img) => {
            if (img) gsap.set(img, { opacity: 0 });
        });

        scrollTriggerRef.current = ScrollTrigger.create({
            trigger: ".spotlight",
            start: "top top",
            end: `+=${window.innerHeight * 10}px`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;

                if (progress <= 0.2) {
                    const animationProgress = progress / 0.2;
                    const moveDistance = window.innerWidth * 0.6;

                    if (introTextElementsRef.current[0])
                        gsap.set(introTextElementsRef.current[0], {
                            x: -animationProgress * moveDistance,
                            opacity: 1,
                        });

                    if (introTextElementsRef.current[1])
                        gsap.set(introTextElementsRef.current[1], {
                            x: animationProgress * moveDistance,
                            opacity: 1,
                        });

                    if (spotlightBgImgRef.current)
                        gsap.set(spotlightBgImgRef.current, { scale: animationProgress });



                    imageRefs.current.forEach((img) => {
                        if (img) gsap.set(img, { opacity: 0 });
                    });

                    if (spotlightHeaderRef.current) spotlightHeaderRef.current.style.opacity = "0";

                    if (titlesContainerElementRef.current) {
                        titlesContainerElementRef.current.style.setProperty("--before-opacity", "0");
                        titlesContainerElementRef.current.style.setProperty("--after-opacity", "0");
                    }
                } else if (progress > 0.2 && progress <= 0.25) {
                    if (spotlightBgImgRef.current) gsap.set(spotlightBgImgRef.current, { scale: 1 });


                    if (introTextElementsRef.current[0]) gsap.set(introTextElementsRef.current[0], { opacity: 0 });
                    if (introTextElementsRef.current[1]) gsap.set(introTextElementsRef.current[1], { opacity: 0 });

                    imageRefs.current.forEach((img) => {
                        if (img) gsap.set(img, { opacity: 0 });
                    });

                    if (spotlightHeaderRef.current) spotlightHeaderRef.current.style.opacity = "1";

                    if (titlesContainerElementRef.current) {
                        titlesContainerElementRef.current.style.setProperty("--before-opacity", "1");
                        titlesContainerElementRef.current.style.setProperty("--after-opacity", "1");
                    }
                } else if (progress > 0.25 && progress <= 0.95) {
                    if (spotlightBgImgRef.current) gsap.set(spotlightBgImgRef.current, { scale: 1 });


                    if (introTextElementsRef.current[0]) gsap.set(introTextElementsRef.current[0], { opacity: 0 });
                    if (introTextElementsRef.current[1]) gsap.set(introTextElementsRef.current[1], { opacity: 0 });

                    if (spotlightHeaderRef.current) spotlightHeaderRef.current.style.opacity = "1";

                    if (titlesContainerElementRef.current) {
                        titlesContainerElementRef.current.style.setProperty("--before-opacity", "1");
                        titlesContainerElementRef.current.style.setProperty("--after-opacity", "1");
                    }

                    const switchProgress = (progress - 0.25) / 0.7;
                    const viewportHeight = window.innerHeight;
                    const titlesContainerHeight = titlesContainerRef.current?.scrollHeight || 0;
                    const startPosition = viewportHeight;
                    const targetPosition = -titlesContainerHeight;
                    const totalDistance = startPosition - targetPosition;
                    const currentY = startPosition - switchProgress * totalDistance;

                    if (titlesContainerRef.current) {
                        gsap.set(titlesContainerRef.current, {
                            y: currentY,
                        });
                    }

                    imageRefs.current.forEach((img, index) => {
                        if (!img) return;
                        const imageProgress = getImgProgressState(index, switchProgress);
                        if (imageProgress < 0 || imageProgress > 1) {
                            gsap.set(img, { opacity: 0 });
                        } else {
                            const pos = getBezierPosition(imageProgress);
                            gsap.set(img, {
                                x: pos.x - 100,
                                y: pos.y - 75,
                                opacity: 1,
                            });
                        }
                    });

                    const viewportMiddle = viewportHeight / 2;
                    let closestIndex = 0;
                    let closestDistance = Infinity;

                    titleRefs.current.forEach((title, index) => {
                        if (!title) return;
                        const titleRect = title.getBoundingClientRect();
                        const titleCenter = titleRect.top + titleRect.height / 2;
                        const distanceFromCenter = Math.abs(titleCenter - viewportMiddle);
                        if (distanceFromCenter < closestDistance) {
                            closestDistance = distanceFromCenter;
                            closestIndex = index;
                        }
                    });

                    if (closestIndex !== currentActiveIndex) {
                        if (titleRefs.current[currentActiveIndex])
                            titleRefs.current[currentActiveIndex]!.style.opacity = "0.25";

                        if (titleRefs.current[closestIndex]) 
                            titleRefs.current[closestIndex]!.style.opacity = "1";


                        // Preload the new image, then update state to trigger rerender
                        const newImage = new window.Image();
                        newImage.src = spotlightItems[closestIndex].img;
                        newImage.onload = () => {
                            setBgImgSrc(spotlightItems[closestIndex].img);
                        };

                        currentActiveIndex = closestIndex;
                    }
                } else if (progress > 0.95) {
                    if (spotlightHeaderRef.current) spotlightHeaderRef.current.style.opacity = "0";
                    if (titlesContainerElementRef.current) {
                        titlesContainerElementRef.current.style.setProperty("--before-opacity", "0");
                        titlesContainerElementRef.current.style.setProperty("--after-opacity", "0");
                    }
                }
            },
        });

        return () => {
            // Kill all GSAP animations
            gsap.killTweensOf("*");
            
            // Clean up ScrollTrigger instances
            if (scrollTriggerRef.current) {
                scrollTriggerRef.current.kill();
                scrollTriggerRef.current = null;
            }
            ScrollTrigger.getAll().forEach((st) => st.kill());
            
            // Clean up Lenis
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
            }
            
            // Remove RAF callback
            gsap.ticker.remove(rafCallback);
            
            // Clean up refs
            imageRefs.current = [];
            titleRefs.current = [];

        };
    }, [mounted]);

    const setIntroTextRef = (el: HTMLDivElement | null, i: number) => {
        introTextElementsRef.current[i] = el;
    };

    if (!mounted) return null;

    return (
        <>
            <section
                className="spotlight relative w-screen h-[100svh] overflow-hidden font-santoshi"
                style={{ height: "100svh" }}
            >
                {/* Intro Text Wrapper */}
                <div className="spotlight-intro-text-wrapper absolute w-full top-1/2 -translate-y-1/2 flex gap-2">
                    <div
                        className="spotlight-intro-text flex-1 relative will-change-transform flex justify-end"
                        ref={(el) => setIntroTextRef(el, 0)}
                    >
                        <p className="text-[1.5rem] font-medium leading-none">Lenskart</p>
                    </div>
                    <div
                        className="spotlight-intro-text flex-1 relative will-change-transform"
                        ref={(el) => setIntroTextRef(el, 1)}
                    >
                        <p className="text-[1.5rem] font-medium leading-none">Collections</p>
                    </div>
                </div>

                {/* Background Image */}
                <div
                    className="spotlight-bg-img absolute w-full h-full overflow-hidden scale-0 will-change-transform"
                    ref={spotlightBgImgRef}
                >
                    <Image
                        src={bgImgSrc}
                        alt="Collection background"
                        fill
                        priority
                        sizes="100vw"
                        className="w-full h-full object-cover scale-[1.5] will-change-transform"
                    />
                </div>

                {/* Titles Container */}
                <div
                    className="spotlight-titles-container uppercase text-[#e5e5dd] font-bold text-[4rem] absolute top-0 left-[15vw] w-full h-full overflow-hidden"
                    ref={titlesContainerElementRef}
                    style={{
                        clipPath:
                            "polygon(50svh 0px, 0px 50%, 50svh 100%, 100% calc(100% + 100svh), 100% -100svh)",
                        ["--before-opacity" as string]: 0,
                        ["--after-opacity" as string]: 0,
                        position: "absolute",
                    }}
                >
                    <style>{`
            .spotlight-titles-container::before,
            .spotlight-titles-container::after {
              content: "";
              position: absolute;
              width: 100svh;
              height: 2.5px;
              background: #fff;
              pointer-events: none;
              transition: opacity 0.3s ease;
              z-index: 10;
            }
            .spotlight-titles-container::before {
              top: 0;
              left: 0;
              transform: rotate(-45deg) translate(-7rem);
              opacity: var(--before-opacity);
            }
            .spotlight-titles-container::after {
              bottom: 0;
              left: 0;
              transform: rotate(45deg) translate(-7rem);
              opacity: var(--after-opacity);
            }
          `}</style>

                    <div
                        className="spotlight-titles relative left-[15%] w-[75%] h-full flex flex-col gap-20 translate-y-full z-20"
                        ref={titlesContainerRef}
                    >
                        {spotlightItems.map((item, index) => (
                            <h1
                                key={index}
                                ref={(el) => { titleRefs.current[index] = el; }}
                                style={{ opacity: index === 0 ? 1 : 0.25 }}
                            >
                                {item.name}
                            </h1>
                        ))}
                    </div>
                </div>

                {/* Spotlight Images */}
                <div
                    className="spotlight-images absolute top-0 left-0 w-1/2 min-w-[300px] h-full pointer-events-none z-10"
                    ref={imagesContainerRef}
                >
                    {spotlightItems.map((item, index) => (
                        <div
                            key={index}
                            className="spotlight-img absolute md:right-[-10%] w-[200px] h-[150px] will-change-transform"
                            ref={(el) => { imageRefs.current[index] = el; }}
                            style={{ opacity: 0 }}
                        >
                            <Image 
                                src={item.img} 
                                alt={item.name} 
                                fill
                                sizes="(max-width: 768px) 100vw, 200px"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>

                {/* Spotlight Header */}
                <div
                    className="spotlight-header absolute top-1/2 left-[10%] -translate-y-1/2 text-[#e5e5dd] transition-opacity duration-300 opacity-0 z-20"
                    ref={spotlightHeaderRef}
                >
                    <p className="text-[1.5rem] font-medium leading-none">Discover</p>
                </div>
            </section>

            {/* Responsive styles as per media queries */}
            <style>{`
        @media (max-width: 768px) {
          .spotlight-titles-container {
            clip-path: none !important;
          }
          .spotlight-titles-container::before,
          .spotlight-titles-container::after {
            display: none !important;
          }
          .spotlight-titles {
            left: 0 !important;
          }
          .spotlight-header {
            display: none !important;
          }
        }
      `}</style>
        </>
    );
};

export default Spotlight;