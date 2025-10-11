"use client";


import { useEffect, useRef } from "react";
import gsap from "gsap";
import Nav from "../../components/Nav";
// import Transition from "../components/Transition";

const About = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const itemsRef = useRef<HTMLDivElement[]>([]);
    const spansRef = useRef<HTMLSpanElement[]>([]);

    useEffect(() => {
        const items = itemsRef.current;
        const container = containerRef.current;
        const spans = spansRef.current;
        const numberOfItems = items.length;
        const angleIncrement = (2 * Math.PI) / numberOfItems;
        const radius = 300;

        let currentAngle = 0;
        let isMouseOverSpan = false;
        let targetX = 0, targetY = 0;
        let currentX = 0, currentY = 0;

        const cloudinaryBase = "https://res.cloudinary.com/djczgyd7j/image/upload/";
        const imagePublicPaths = [
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
            "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
            "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
            "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
            "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99",
            "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
            "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
            "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
            "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
        ];

        items.forEach((item, index) => {
            if (!item) return;
            const img = document.createElement("img");
            img.src = imagePublicPaths[index];
            img.alt = `Image ${index + 1}`;
            img.classList.add("w-full", "h-full", "object-cover");
            item.appendChild(img);
        });

        const updateGallery = (mouseX: number, mouseY: number, show = true) => {
            if (!container) return;
            const rect = container.getBoundingClientRect();
            targetX = mouseX - rect.left;
            targetY = mouseY - rect.top;
            currentX += (targetX - currentX) * 0.1;
            currentY += (targetY - currentY) * 0.1;

            items.forEach((item, index) => {
                if (!item) return;
                const angle = currentAngle + index * angleIncrement;
                const x = currentX + radius * Math.cos(angle) - item.offsetWidth / 2;
                const y = currentY + radius * Math.sin(angle) - item.offsetHeight / 2;

                gsap.to(item, {
                    x: x,
                    y: y,
                    opacity: show ? 1 : 0,
                    duration: 0.5,
                    ease: "power1.out",
                });
            });
        };

        spans.forEach((span) => {
            if (!span) return;
            span.addEventListener("mouseenter", (e: MouseEvent) => {
                isMouseOverSpan = true;
                updateGallery(e.clientX, e.clientY, true);

                gsap.to((span.parentNode as HTMLElement), {
                    color: "#545454",
                    duration: 0.3,
                    ease: "power1.out",
                });
            });

            span.addEventListener("mousemove", (e: MouseEvent) => {
                if (isMouseOverSpan) {
                    targetX = e.clientX - 800;
                    targetY = e.clientY - 400;
                }
            });

            span.addEventListener("mouseleave", () => {
                isMouseOverSpan = false;
                updateGallery(0, 0, false);

                gsap.to((span.parentNode as HTMLElement), {
                    color: "#ffffff",
                    duration: 0.3,
                    ease: "power1.out",
                });
            });
        });

        gsap.ticker.add(() => {
            currentAngle += 0.005;
            if (currentAngle > 2 * Math.PI) currentAngle -= 2 * Math.PI;
            if (isMouseOverSpan) updateGallery(targetX, targetY, true);
        });
    }, []);

    return (
        <div className="relative w-full h-screen bg-black text-white font-sans overflow-hidden">
            {/* Hero Copy */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center w-[100%] md:w-[60%]">
                <p className="text-[1.5rem] md:text-[2.2rem] leading-[110%] font-santoshi  tracking-[-0.04em] text-[#fff] font-[sans-serif]">
                    We are redefining eyewear. From style to{" "}
                    <span
                        className="relative inline-block text-[1.6rem] md:text-[2.3rem] font-semibold cursor-pointer text-[#b0b0b0]"
                        ref={(el) => {
                            if (el) spansRef.current[0] = el;
                        }}
                    >
                        innovation
                    </span>, we craft frames,{" "}
                    <span
                        className="relative inline-block text-[1.6rem] md:text-[2.3rem] font-semibold cursor-pointer text-[#b0b0b0]"
                        ref={(el) => {
                            if (el) spansRef.current[1] = el;
                        }}
                    >
                        lenses
                    </span> and experiences that help our diverse{" "}
                    <span
                        className="relative inline-block text-[1.6rem] md:text-[2.3rem] font-semibold cursor-pointer text-[#b0b0b0]"
                        ref={(el) => {
                            if (el) spansRef.current[2] = el;
                        }}
                    >
                        customers
                    </span> express personality and see with{" "}
                    <span
                        className="relative inline-block text-[1.6rem] md:text-[2.3rem] font-semibold cursor-pointer text-[#b0b0b0]"
                        ref={(el) => {
                            if (el) spansRef.current[3] = el;
                        }}
                    >
                        clarity
                    </span> every single day. <br className="hidden md:block" />
                    Explore our latest collection and find the perfect look for you.
                </p>
            </div>

            <Nav />

            {/* Footer */}
            <footer className="fixed bottom-0 w-full flex font-final text-[0.6rem] md:text-[1rem] justify-between  text-[#666] uppercase p-4 z-20">
                <p>Hover On</p>
                <p>the highlighted words</p>
            </footer>

            {/* Container and Gallery */}
            <div className="absolute w-full h-full pointer-events-none" ref={containerRef}>
                <div className="gallery">
                    {Array.from({ length: 11 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute top-1/2 left-1/2 w-[100px] h-[70px] bg-[#b0b0b0] opacity-0 pointer-events-none"
                            ref={(el) => {
                                if (el) itemsRef.current[i] = el;
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

// export default Transition(About);
export default About;