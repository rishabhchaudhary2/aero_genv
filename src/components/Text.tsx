'use client';

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

declare global {
    interface Window {
        duplicateIcons?: HTMLElement[];
    }
}

const Text: React.FC = () => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const animatedIconsRef = useRef<HTMLDivElement | null>(null);
    const textSegmentsRef = useRef<HTMLSpanElement[]>([]);
    const placeholderIconsRef = useRef<HTMLDivElement[]>([]);
    const heroHeaderRef = useRef<HTMLDivElement | null>(null);
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 1000;

    useEffect(() => {
        const lenis = new Lenis();
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);

        const animatedIcons = animatedIconsRef.current!;
        const textSegments = textSegmentsRef.current;
        const placeholders = placeholderIconsRef.current;
        const heroHeader = heroHeaderRef.current!;
        const heroSection = sectionRef.current!;
        const iconElements = animatedIcons.querySelectorAll(".animated-icon");

        const isMobile = window.innerWidth <= 1000;
        const headerIconSize = isMobile ? 30 : 60;
        const currentIconSize = iconElements[0].getBoundingClientRect().width;
        const exactScale = headerIconSize / currentIconSize;

        const textAnimationOrder = [...textSegments].map((segment, index) => ({
            segment,
            originalIndex: index,
        }));
        for (let i = textAnimationOrder.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [textAnimationOrder[i], textAnimationOrder[j]] = [
                textAnimationOrder[j],
                textAnimationOrder[i],
            ];
        }

        ScrollTrigger.create({
            trigger: heroSection,
            start: "top top",
            end: `+=${window.innerHeight * 8}px`,
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;

                textSegments.forEach((segment) => gsap.set(segment, { opacity: 0 }));

                // PHASE 1: Move icons and fade header
                if (progress <= 0.3) {
                    const moveProgress = progress / 0.3;
                    const containerMoveY = -window.innerHeight * 0.3 * moveProgress;

                    if (progress <= 0.15) {
                        const headerProgress = progress / 0.15;
                        gsap.set(heroHeader, {
                            transform: `translate(-50%, calc(-50% + ${-50 * headerProgress}px))`,
                            opacity: 1 - headerProgress,
                        });
                    } else {
                        gsap.set(heroHeader, {
                            transform: `translate(-50%, calc(-50% + -50px))`,
                            opacity: 0,
                        });
                    }

                    if (window.duplicateIcons) {
                        window.duplicateIcons.forEach((d) => d.remove());
                        window.duplicateIcons = undefined;
                    }

                    gsap.set(animatedIcons, {
                        x: 0,
                        y: containerMoveY,
                        scale: 1,
                        opacity: 1,
                    });

                    iconElements.forEach((icon, index) => {
                        const staggerDelay = index * 0.1;
                        const iconStart = staggerDelay;
                        const iconEnd = staggerDelay + 0.5;
                        const iconProgress = gsap.utils.mapRange(
                            iconStart,
                            iconEnd,
                            0,
                            1,
                            moveProgress
                        );
                        const clamped = Math.max(0, Math.min(1, iconProgress));
                        const startOffset = -containerMoveY;
                        const individualY = startOffset * (1 - clamped);
                        gsap.set(icon, { x: 0, y: individualY });
                    });
                }

                // PHASE 2: Scale up icons
                else if (progress <= 0.6) {
                    const scaleProgress = (progress - 0.3) / 0.3;

                    gsap.set(heroHeader, {
                        transform: `translate(-50%, calc(-50% + -50px))`,
                        opacity: 0,
                    });

                    heroSection.style.backgroundColor =
                        scaleProgress >= 0.5 ? "#e3e3db" : "#141414";

                    if (window.duplicateIcons) {
                        window.duplicateIcons.forEach((d) => d.remove());
                        window.duplicateIcons = undefined;
                    }

                    const containerRect = animatedIcons.getBoundingClientRect();
                    const deltaX =
                        window.innerWidth / 2 - (containerRect.left + containerRect.width / 2);
                    const deltaY =
                        window.innerHeight / 2 - (containerRect.top + containerRect.height / 2);
                    const baseY = -window.innerHeight * 0.3;
                    const currentScale = 1 + (exactScale - 1) * scaleProgress;

                    gsap.set(animatedIcons, {
                        x: deltaX * scaleProgress,
                        y: baseY + deltaY * scaleProgress,
                        scale: currentScale,
                        opacity: 1,
                    });

                    iconElements.forEach((icon) => gsap.set(icon, { x: 0, y: 0 }));
                }

                // PHASE 3: Explode into text
                else if (progress <= 0.75) {
                    const moveProgress = (progress - 0.6) / 0.15;

                    gsap.set(heroHeader, {
                        transform: `translate(-50%, calc(-50% + -50px))`,
                        opacity: 0,
                    });

                    heroSection.style.backgroundColor = "#e3e3db";

                    const targetCenterY = window.innerHeight / 2;
                    const targetCenterX = window.innerWidth / 2;
                    const containerRect = animatedIcons.getBoundingClientRect();
                    const currentCenterX = containerRect.left + containerRect.width / 2;
                    const currentCenterY = containerRect.top + containerRect.height / 2;
                    const deltaX = targetCenterX - currentCenterX;
                    const deltaY = targetCenterY - currentCenterY;
                    const baseY = -window.innerHeight * 0.3;

                    gsap.set(animatedIcons, {
                        x: deltaX,
                        y: baseY + deltaY,
                        scale: exactScale,
                        opacity: 0,
                    });

                    iconElements.forEach((icon) => gsap.set(icon, { x: 0, y: 0 }));

                    if (!window.duplicateIcons) {
                        window.duplicateIcons = [];
                        iconElements.forEach((icon, index) => {
                            const clone = icon.cloneNode(true) as HTMLElement;
                            clone.className = "duplicate-icon fixed z-10";
                            clone.style.width = `${headerIconSize}px`;
                            clone.style.height = `${headerIconSize}px`;
                            clone.style.position = "absolute";
                            document.body.appendChild(clone);
                            window.duplicateIcons!.push(clone);
                        });
                    }
                    if (window.duplicateIcons) {
                        window.duplicateIcons.forEach((duplicate, index) => {
                            if (index < placeholders.length) {
                                const iconRect = iconElements[index].getBoundingClientRect();
                                const startCenterX = iconRect.left + iconRect.width / 2;
                                const startCenterY = iconRect.top + iconRect.height / 2;
                                const startPageX = startCenterX + window.pageXOffset;
                                const startPageY = startCenterY + window.pageYOffset;

                                const targetRect = placeholders[index].getBoundingClientRect();
                                const targetCenterX = targetRect.left + targetRect.width / 2;
                                const targetCenterY = targetRect.top + targetRect.height / 2;
                                const targetPageX = targetCenterX + window.pageXOffset;
                                const targetPageY = targetCenterY + window.pageYOffset;

                                const moveX = targetPageX - startPageX;
                                const moveY = targetPageY - startPageY;

                                let currentX = 0;
                                let currentY = 0;

                                if (moveProgress <= 0.5) {
                                    const verticalProgress = moveProgress / 0.5;
                                    currentY = moveY * verticalProgress;
                                } else {
                                    const horizontalProgress = (moveProgress - 0.5) / 0.5;
                                    currentY = moveY;
                                    currentX = moveX * horizontalProgress;
                                }

                                const finalPageX = startPageX + currentX;
                                const finalPageY = startPageY + currentY;

                                duplicate.style.left = finalPageX - headerIconSize / 2 + "px";
                                duplicate.style.top = finalPageY - headerIconSize / 2 + "px";
                                duplicate.style.opacity = "1";
                                duplicate.style.display = "flex";
                            }
                        });
                    }
                }
                // PHASE 4: Show text
                else {
                    gsap.set(heroHeader, {
                        transform: `translate(-50%, calc(-50% + -100px))`,
                        opacity: 0,
                    });

                    heroSection.style.backgroundColor = "#e5e5dd";
                    gsap.set(animatedIcons, { opacity: 0 });

                    if (window.duplicateIcons) {
                        window.duplicateIcons.forEach((duplicate, index) => {
                            if (index < placeholders.length) {
                                const targetRect = placeholders[index].getBoundingClientRect();
                                const targetCenterX = targetRect.left + targetRect.width / 2;
                                const targetCenterY = targetRect.top + targetRect.height / 2;
                                const targetPageX = targetCenterX + window.pageXOffset;
                                const targetPageY = targetCenterY + window.pageYOffset;

                                duplicate.style.left = targetPageX - headerIconSize / 2 + "px";
                                duplicate.style.top = targetPageY - headerIconSize / 2 + "px";
                                duplicate.style.opacity = "1";
                                duplicate.style.display = "flex";
                            }
                        });
                    }

                    textAnimationOrder.forEach((item, i) => {
                        const start = 0.75 + i * 0.03;
                        const end = start + 0.015;
                        const segmentProgress = gsap.utils.mapRange(start, end, 0, 1, progress);
                        const clamped = Math.max(0, Math.min(1, segmentProgress));
                        gsap.set(item.segment, { opacity: clamped });
                    });
                }
            },
        });
        let resizeTimeout: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("orientationchange", handleResize);

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
            lenis.destroy();
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("orientationchange", handleResize);
            clearTimeout(resizeTimeout);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-screen h-screen p-6 flex items-center justify-center bg-[#141414] text-[#e3e3db] overflow-hidden flex-col transition-colors duration-300"
        >
            <div
                ref={heroHeaderRef}
                className="absolute top-[35%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60%] text-center flex flex-col gap-8"
            >
                <h1 className="text-[7vw] font-thin tracking-wider leading-none font-three">Lenskart Redesign</h1>
                <p className="text-[1.5rem] font-normal font-santoshi">Great Glasses. Now with a Greater Experience.</p>
            </div>

            <div ref={animatedIconsRef} className="fixed bottom-4 left-4  right-4 flex items-center gap-4 z-20">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="animated-icon aspect-square flex-1">
                        <img src={`/icons/${i}.png`} alt="" className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>

            <h1 className="animated-text relative max-w-[1000px] font-santoshi text-center text-[#141414] text-[clamp(2rem,5vw,3.8rem)] leading-none">
                {[
                    "Discover stylish eyewear,",
                    "crafted with elegance.",
                    "Frames inspired by heroes,",
                    "like Superman & Potter.",
                    "Trendy picks for everyone,",
                    "from specs to shades."
                ]
                    .map((text, i) => (
                        <span
                            key={i}
                            className="text-segment opacity-0"
                            ref={(el) => (textSegmentsRef.current[i] = el!)}
                        >
                            <div
                                className="placeholder-icon inline-block align-middle invisible"
                                style={{
                                    width: isMobile ? 30 : 60,
                                    height: isMobile ? 30 : 60,
                                    marginTop: isMobile ? -4 : -10,
                                }}
                                ref={(el) => (placeholderIconsRef.current[i] = el!)}
                            ></div>
                            {text}
                        </span>
                    ))}
            </h1>

            <div className="outro mt-10">
                <h1 className="text-[7vw] font-semibold leading-none font-santoshi">Go to Products</h1>
            </div>
        </section>
    );
};

export default Text;