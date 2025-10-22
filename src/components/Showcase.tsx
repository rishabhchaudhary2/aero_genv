'use client';

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Showcase: React.FC = () => {
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const videoTitleRef = useRef<HTMLParagraphElement[]>([]);
    const outroTextRef = useRef<HTMLDivElement>(null);
    const leftTitleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (window.innerWidth < 900) return;

        const videoContainer = videoContainerRef.current;

        gsap.set(videoContainer, {
            y: "-105%",
            scale: 0.25,
        });

        const state = {
            scrollProgress: 0,
            currentTranslateY: -105,
            scale: 0.25,
            gap: 2,
            fontSize: 80,
            targetMouseX: 0,
            currentMouseX: 0,
        };

        gsap.timeline({
            scrollTrigger: {
                trigger: ".intro",
                start: "top bottom",
                end: "top 10%",
                scrub: true,
                onUpdate: (self) => {
                    const progress = self.progress;
                    state.scrollProgress = progress;

                    state.currentTranslateY = gsap.utils.interpolate(-105, 0, progress);
                    state.scale = gsap.utils.interpolate(0.25, 1, progress);
                    state.gap = gsap.utils.interpolate(2, 1, progress);

                    if (progress <= 0.4) {
                        state.fontSize = gsap.utils.interpolate(80, 40, progress / 0.4);
                    } else {
                        state.fontSize = gsap.utils.interpolate(40, 20, (progress - 0.4) / 0.6);
                    }
                },
            },
        });

        window.addEventListener("mousemove", (e) => {
            state.targetMouseX = ((e.clientX / window.innerWidth) - 0.5) * 2;
        });

        const animate = () => {
            const { currentTranslateY, scale, targetMouseX, currentMouseX, gap, fontSize } = state;
            const scaleMoveX = (1 - scale) * 700;
            const maxX = scale < 0.95 ? targetMouseX * scaleMoveX : 0;

            state.currentMouseX = gsap.utils.interpolate(currentMouseX, maxX, 0.05);

            if (videoContainer) {
                videoContainer.style.transform = `translateY(${currentTranslateY}%) translateX(${state.currentMouseX}px) scale(${scale})`;
                (videoContainer.style ).gap = `${gap}em`;
            }

            videoTitleRef.current.forEach((el) => {
                if (el) el.style.fontSize = `${fontSize}px`;
            });

            requestAnimationFrame(animate);
        };

        animate();

        if (window.innerWidth >= 768 && outroTextRef.current) {
            const outroElement = outroTextRef.current;
            if (!leftTitleRef.current) return;

            const letters = leftTitleRef.current.querySelectorAll("span");

            gsap.set(letters, {
                rotateY: 180,
                scaleX: -1,
                opacity: 0,
                transformOrigin: "center center",
            });

            gsap.to(letters, {
                scrollTrigger: {
                    trigger: leftTitleRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
                rotateY: 0,
                scaleX: 1,
                opacity: 1,
                duration: 0.6,
                ease: "power2.out",
            });

            const flickerAnimation = () => {
                const count = 3;
                const randomIndices: number[] = [];
                while (randomIndices.length < count) {
                    const rand = Math.floor(Math.random() * letters.length);
                    if (!randomIndices.includes(rand)) randomIndices.push(rand);
                }

                const tl = gsap.timeline({
                    onComplete: () => {
                        gsap.delayedCall(gsap.utils.random(1, 2.5), flickerAnimation);
                    },
                });

                randomIndices.forEach((i) => {
                    tl.to(
                        letters[i],
                        {
                            filter: "blur(4px)",
                            opacity: 0.5,
                            duration: 0.25,
                            ease: "power1.inOut",
                        },
                        0
                    ).to(
                        letters[i],
                        {
                            filter: "blur(0px)",
                            opacity: 1,
                            duration: 0.4,
                            ease: "power1.inOut",
                        },
                        0.25
                    );
                });
            };

            flickerAnimation();

            if (outroElement) {
                const paragraphs = outroElement.querySelectorAll("p, div");

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: outroElement,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                });

                tl.fromTo(
                    paragraphs,
                    {
                        opacity: 0,
                        y: 60,
                        scale: 0.95,
                        filter: "blur(8px)",
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        filter: "blur(0px)",
                        stagger: 0.15,
                        duration: 1.2,
                        ease: "expo.out",
                    }
                );
            }
        }

        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);

        const handleResize = () => {
            ScrollTrigger.refresh();
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div>
            {/* Hero */}
            <section className="w-screen h-[100svh] p-10 flex flex-col justify-between pt-20">
                <h1 className="relative uppercase font-bold text-[19vw] tracking-[-0.01em] leading-none md:-left-[0.05em] -left-[0.3em]">
                    AeroClub
                </h1>
                <div className="flex justify-between items-end">
                    <p className="text-[12px] md:text-[20px] uppercase font-medium w-full md:w-1/2">
                        Where every crash is a lesson, and every idea is a chance to fly.
                    </p>
                    <p className="text-[12px] md:text-[20px] font-medium">(Scroll)</p>
                </div>
            </section>

            {/* Intro */}
            <section className="intro w-screen p-10">
                <div
                    ref={videoContainerRef}
                    className="video-container-desktop hidden md:flex flex-col will-change-transform origin-center gap-[2em]"
                >
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-[#b9b9b3]">
                        <div className="absolute inset-0 rounded-3xl overflow-hidden">
                            <video
                                className="w-full h-full object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                                src="/videos/intro.mp4"
                            />
                        </div>
                    </div>
                    <div className="video-title">
                        {["Aero", "(Frame - 2025)"].map((text, index) => (
                            <p
                                key={index}
                                ref={(el) => {
                                    if (el) videoTitleRef.current[index] = el;
                                }}
                                className="font-medium"
                            >
                                {text}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Mobile View */}
                <div className="video-container-mobile flex md:hidden flex-col gap-4 w-full max-w-[800px] mx-auto">
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-[#b9b9b3]">
                        <div className="absolute inset-0 rounded-3xl overflow-hidden">
                            <video
                                className="w-full h-full object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                                src="/videos/intro.mp4"
                            />
                        </div>
                    </div>
                    <div className="video-title">
                        <p className="text-sm font-medium">Lenskart <span className="font-three">X</span> Superman</p>
                        <p className="text-sm font-medium">(Frame - 2025)</p>
                    </div>
                </div>
            </section>

            {/* Outro */}
            <section className="w-full md:min-h-screen font-final uppercase text-[#111] font-sans px-4 md:px-10 py-6 md:py-10 flex flex-col">
                {/* Top Line */}
                <div className="flex items-center w-full gap-4">
                    <span className="text-lg font-light">+</span>
                    <div className="flex-grow border-t border-black"></div>
                    <span className="text-lg font-light">+</span>
                </div>

                {/* Main Content */}
                <div className="flex flex-col md:flex-row w-full mt-6 md:mt-12 mb-10 flex-1">
                    {/* Left Title */}
                    <div className="md:w-1/3 w-full" ref={leftTitleRef}>
                        <p className="text-lg md:text-xl font-semibold pl-1 md:pl-2 tracking-wide">
                            {"ABOUT US".split("").map((letter, i) => (
                                <span
                                    key={i}
                                    className="inline-block opacity-0 translate-y-5  transition duration-300 hover:text-red-500 hover:scale-125"
                                >
                                    {letter === " " ? "\u00A0" : letter}
                                </span>
                            ))}
                        </p>
                    </div>

                    {/* Right Text */}
                    <div
                        ref={outroTextRef}
                        className="md:w-2/3 w-full flex flex-col justify-center gap-8 md:pl-10 transition-all"
                    >
                        <p className="uppercase text-[10px] font-semibold mt-10 md:mt-0 tracking-wider">
                           Elevating flight through passion and innovation
                        </p>

                        <div className="text-[7vw] sm:text-[6vw] md:text-[3.5vw] uppercase font-medium tracking-tight leading-[1.2]">
                            <p>Our motto:</p>
                            <p>&ldquo;If it flies,</p>
                            <p>we build it.&rdquo;</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 md:gap-10 font-mono text-[10px] sm:text-xs leading-relaxed pt-8">
                            <p className="md:w-1/2">
                              Aero Club is where creativity meets engineering. We design and build miniature aircraft with precision, transforming simple ideas into machines that soar. From balsa wood gliders to advanced RC aircraft, our members experiment, learn, and push the boundaries of what’s possible in aviation.
                            </p>
                            <p className="md:w-1/2">
                               Every project challenges us to innovate and think critically. Failures are celebrated as learning opportunities, and successes fuel our curiosity. Through collaboration, hands-on experimentation, and relentless testing, we nurture a community of aspiring engineers and pilots ready to take flight into the future.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Line */}
                <div className="flex items-center w-full gap-4 mt-10">
                    <span className="text-lg font-light">+</span>
                    <div className="flex-grow border-t border-black"></div>
                    <span className="text-lg font-light">+</span>
                </div>
            </section>
        </div>
    );
};

export default Showcase;
