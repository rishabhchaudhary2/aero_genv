'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type ContactMiniProps = {
    isHome?: boolean;
};

const Footer: React.FC<ContactMiniProps> = ({ isHome }) => {
    const footerRef = useRef<HTMLDivElement | null>(null);
    const lenskartRef = useRef<HTMLHeadingElement | null>(null);
    const bylineRef = useRef<HTMLHeadingElement | null>(null);
    const handRef = useRef<SVGGElement | null>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (lenskartRef.current && footerRef.current) {
                gsap.from(lenskartRef.current, {
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 80%",
                        toggleActions: "play none none none",
                    },
                    opacity: 0,
                    scale: 0.8,
                    duration: 1.5,
                    ease: "power4.out",
                });
            }

            if (bylineRef.current && footerRef.current) {
                gsap.from(bylineRef.current, {
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 85%",
                        toggleActions: "play none none none",
                    },
                    y: 30,
                    opacity: 0,
                    duration: 1.2,
                    delay: 0.5,
                    ease: "power3.out",
                });
            }

            if (handRef.current) {
                gsap.to(handRef.current, {
                    x: -50,
                    rotation: 5,
                    transformOrigin: "center center",
                    yoyo: true,
                    repeat: -1,
                    duration: 0.8,
                    ease: "sine.inOut",
                });
            }

            // Hover headings animations
            const headings = gsap.utils.toArray<HTMLElement>(".hover-heading");
            headings.forEach((el) => {
                el.addEventListener("mouseenter", () => {
                    gsap.to(el, {
                        color: "#ffffff",
                        letterSpacing: "1px",
                        duration: 0.6,
                        delay: 0.2,
                        ease: "power2.out",
                    });
                });
                el.addEventListener("mouseleave", () => {
                    gsap.to(el, {
                        color: "#9ca3af",
                        letterSpacing: "normal",
                        duration: 0.3,
                        ease: "power2.out",
                    });
                });
            });

            // Hover items animations
            const items = gsap.utils.toArray<HTMLElement>(".hover-item");
            items.forEach((el) => {
                el.addEventListener("mouseenter", () => {
                    gsap.to(el, {
                        x: 5,
                        opacity: 1,
                        color: "#ffffff",
                        duration: 0.2,
                        ease: "power2.out",
                    });
                });
                el.addEventListener("mouseleave", () => {
                    gsap.to(el, {
                        x: 0,
                        opacity: 0.8,
                        color: "#ababa1",
                        duration: 0.2,
                        ease: "power2.out",
                    });
                });
            });
        }, footerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={footerRef}>
            <div className="bg-[#111] h-100vh w-screen flex flex-col justify-between p-10 text-[#ababa1] font-final">
                {/* Top section */}
                <div className="footer-first w-full h-[60%] md:h-[40%]">
                    <div className="grid grid-cols-5 gap-10 text-sm">
                        {/* About */}
                        <div className="hidden md:block">
                            <h3 className="text-gray-400 mb-2 hover-heading">About Aero Club</h3>
                            <p className="mb-4">
                                Aero Club is a premier aviation community dedicated to fostering a passion for flight.
                                We offer a range of resources, events, and networking opportunities for aviation enthusiasts.
                            </p>
                            {/* <ul className="space-y-1 text-xs  text-white/80 flex flex-col gap-1">
                                <li className="hover-item"><a className='border-b-1 border-white/60 pb-1' href="https://www.lenskart.com/">support@lenskart.com ↗</a> </li>
                                <li className="hover-item"><a className='border-b-1 border-white/60 pb-1' href="https://www.instagram.com/lenskart/">Instagram ↗</a></li>
                                <li className="hover-item"><a className='border-b-1 border-white/60 pb-1' href="https://www.linkedin.com/company/lenskart-com/">LinkedIn ↗</a></li>
                                <li className="hover-item"><a className='border-b-1 border-white/60 pb-1' href="https://x.com/Lenskart_com">X ↗</a></li>
                            </ul> */}
                            <h1>Add aero logo and some spacing from bottom </h1>
                        </div>

                        {/* Explore */}
                        <div>
                            <h3 className="text-gray-400 mb-4 hover-heading">Explore</h3>
                            <ul className="space-y-2 text-sm">
                                <li className="hover-item">🏠 Home</li>
                                <li className="hover-item">🛠️ Workshops</li>
                                <li className="hover-item">📝 Blogs</li>
                                <li className="hover-item">🤝 Meets</li>
                                <li className="hover-item">ℹ️ About Us</li>
                            </ul>
                        </div>

                        {/* Additional Links */}
                        <div>
                            <h3 className="text-gray-400 mb-4 hover-heading">Additional Links</h3>
                            <ul className="space-y-2 text-sm">
                                <li className="hover-item">🖼️ Gallery</li>
                                <li className="hover-item">👥 DevTeam</li>
                                <li className="hover-item">👥 Members</li>
                                <li className="hover-item">🔒 Privacy Policy</li>
                            </ul>
                        </div>

                        {/* Connect */}
                        <div>
                            <h3 className="text-gray-400 mb-4 hover-heading">Connect</h3>
                            <ul className="space-y-2 text-sm">
                                <li className="hover-item">✉️ aeroclub@nitkkr.ac.in</li>
                                <li className="hover-item">📍 NIT Kurukshetra, Haryana</li>
                                <li className="flex space-x-4 mt-4">
                                    <a href="https://www.instagram.com/aeroclub.nitkkr/" className="hover-item text-gray-400 hover:text-white">
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                        </svg>
                                    </a>
                                    <a href="https://www.linkedin.com/company/aero-club-nit-kurukshetra/" className="hover-item text-gray-400 hover:text-white">
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                        </svg>
                                    </a>
                                    <a href="https://www.facebook.com/aeromodellingnitkkr/" className="hover-item text-gray-400 hover:text-white">
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Empty div to maintain grid structure */}
                        <div></div>
                    </div>
                </div>

                {/* Bottom section with logo and waving hand */}
               
            </div>
        </div>
    );
};

export default Footer;