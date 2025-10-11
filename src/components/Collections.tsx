'use client';

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

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
    speed: 0.3,
    arcRadius: 500,
};

const Spotlight: React.FC = () => {
    const titlesContainerRef = useRef<HTMLDivElement | null>(null);
    const imagesContainerRef = useRef<HTMLDivElement | null>(null);
    const spotlightHeaderRef = useRef<HTMLDivElement | null>(null);
    const titlesContainerElementRef = useRef<HTMLDivElement | null>(null);
    const introTextElementsRef = useRef<Array<HTMLDivElement | null>>([]);
    const spotlightBgImgRef = useRef<HTMLDivElement | null>(null);
    const spotlightBgImgInnerRef = useRef<HTMLImageElement | null>(null);

    const imageElements = useRef<HTMLDivElement[]>([]);
    const titleElements = useRef<NodeListOf<HTMLHeadingElement>>();

    useEffect(() => {
        const lenis = new Lenis();
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        if (!titlesContainerRef.current || !imagesContainerRef.current) return;

        titlesContainerRef.current.innerHTML = "";
        imagesContainerRef.current.innerHTML = "";
        imageElements.current = [];

        spotlightItems.forEach((item, index) => {
            const titleElement = document.createElement("h1");
            titleElement.textContent = item.name;
            if (index === 0) titleElement.style.opacity = "1";
            titlesContainerRef.current!.appendChild(titleElement);

            const imgWrapper = document.createElement("div");
            imgWrapper.className = "spotlight-img absolute md:right-[-10%] w-[200px] h-[150px] will-change-transform";
            const imgElement = document.createElement("img");
            imgElement.src = item.img;
            imgElement.alt = "";
            imgWrapper.appendChild(imgElement);
            imagesContainerRef.current!.appendChild(imgWrapper);

            imageElements.current.push(imgWrapper);
        });

        titleElements.current = titlesContainerRef.current.querySelectorAll("h1");

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

        imageElements.current.forEach((img) => gsap.set(img, { opacity: 0 }));

        ScrollTrigger.create({
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

                    if (spotlightBgImgInnerRef.current)
                        gsap.set(spotlightBgImgInnerRef.current, {
                            scale: 1.5 - animationProgress * 0.5,
                        });

                    imageElements.current.forEach((img) => gsap.set(img, { opacity: 0 }));

                    if (spotlightHeaderRef.current) spotlightHeaderRef.current.style.opacity = "0";

                    if (titlesContainerElementRef.current) {
                        titlesContainerElementRef.current.style.setProperty("--before-opacity", "0");
                        titlesContainerElementRef.current.style.setProperty("--after-opacity", "0");
                    }
                } else if (progress > 0.2 && progress <= 0.25) {
                    if (spotlightBgImgRef.current) gsap.set(spotlightBgImgRef.current, { scale: 1 });
                    if (spotlightBgImgInnerRef.current) gsap.set(spotlightBgImgInnerRef.current, { scale: 1 });

                    if (introTextElementsRef.current[0]) gsap.set(introTextElementsRef.current[0], { opacity: 0 });
                    if (introTextElementsRef.current[1]) gsap.set(introTextElementsRef.current[1], { opacity: 0 });

                    imageElements.current.forEach((img) => gsap.set(img, { opacity: 0 }));

                    if (spotlightHeaderRef.current) spotlightHeaderRef.current.style.opacity = "1";

                    if (titlesContainerElementRef.current) {
                        titlesContainerElementRef.current.style.setProperty("--before-opacity", "1");
                        titlesContainerElementRef.current.style.setProperty("--after-opacity", "1");
                    }
                } else if (progress > 0.25 && progress <= 0.95) {
                    if (spotlightBgImgRef.current) gsap.set(spotlightBgImgRef.current, { scale: 1 });
                    if (spotlightBgImgInnerRef.current) gsap.set(spotlightBgImgInnerRef.current, { scale: 1 });

                    if (introTextElementsRef.current[0]) gsap.set(introTextElementsRef.current[0], { opacity: 0 });
                    if (introTextElementsRef.current[1]) gsap.set(introTextElementsRef.current[1], { opacity: 0 });

                    if (spotlightHeaderRef.current) spotlightHeaderRef.current.style.opacity = "1";

                    if (titlesContainerElementRef.current) {
                        titlesContainerElementRef.current.style.setProperty("--before-opacity", "1");
                        titlesContainerElementRef.current.style.setProperty("--after-opacity", "1");
                    }

                    const switchProgress = (progress - 0.25) / 0.7;
                    const viewportHeight = window.innerHeight;
                    const titlesContainerHeight = titlesContainerRef.current!.scrollHeight;
                    const startPosition = viewportHeight;
                    const targetPosition = -titlesContainerHeight;
                    const totalDistance = startPosition - targetPosition;
                    const currentY = startPosition - switchProgress * totalDistance;

                    gsap.set(titlesContainerRef.current, {
                        y: currentY,
                    });

                    imageElements.current.forEach((img, index) => {
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

                    titleElements.current!.forEach((title, index) => {
                        const titleRect = title.getBoundingClientRect();
                        const titleCenter = titleRect.top + titleRect.height / 2;
                        const distanceFromCenter = Math.abs(titleCenter - viewportMiddle);
                        if (distanceFromCenter < closestDistance) {
                            closestDistance = distanceFromCenter;
                            closestIndex = index;
                        }
                    });

                    if (closestIndex !== currentActiveIndex) {
                        if (titleElements.current![currentActiveIndex])
                            titleElements.current![currentActiveIndex].style.opacity = "0.25";

                        if (titleElements.current![closestIndex]) titleElements.current![closestIndex].style.opacity = "1";

                        if (spotlightBgImgInnerRef.current)
                            spotlightBgImgInnerRef.current.src = spotlightItems[closestIndex].img;

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
            ScrollTrigger.getAll().forEach((st) => st.kill());
            gsap.ticker.remove(() => lenis.raf);
        };
    }, []);

    const setIntroTextRef = (el: HTMLDivElement | null, i: number) => {
        introTextElementsRef.current[i] = el;
    };

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
                    <img
                        src="/collections/1.jpg"
                        alt=""
                        className="w-full h-full object-cover scale-[1.5] will-change-transform"
                        ref={spotlightBgImgInnerRef}
                    />
                </div>

                {/* Titles Container */}
                <div
                    className="spotlight-titles-container uppercase  text-[#e5e5dd] font-bold text-[4rem] absolute top-0 left-[15vw] w-full h-full overflow-hidden"
                    ref={titlesContainerElementRef}
                    style={{
                        clipPath:
                            "polygon(50svh 0px, 0px 50%, 50svh 100%, 100% calc(100% + 100svh), 100% -100svh)",
                        // @ts-ignore
                        "--before-opacity": 0,
                        "--after-opacity": 0,
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

                    {/* Titles will be dynamically appended here */}
                    <div
                        className="spotlight-titles relative left-[15%] w-[75%] h-full flex flex-col gap-20 translate-y-full z-20"
                        ref={titlesContainerRef}
                    />
                </div>

                {/* Spotlight Images */}
                <div
                    className="spotlight-images absolute top-0 left-0 w-1/2 min-w-[300px] h-full pointer-events-none z-10"
                    ref={imagesContainerRef}
                ></div>

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