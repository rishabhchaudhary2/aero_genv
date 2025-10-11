'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type ContactMiniProps = {
    isHome?: boolean;
};

const ContactMini: React.FC<ContactMiniProps> = ({ isHome }) => {
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
            <div className="bg-[#111] h-screen w-full flex flex-col justify-between p-10 text-[#ababa1] font-final">
                {/* Top section */}
                <div className="footer-first w-full h-[60%] md:h-[40%]">
                    <div className="grid grid-cols-5 gap-10 text-sm">
                        {/* About */}
                        <div className="hidden md:block">
                            <h3 className="text-gray-400 mb-2 hover-heading">ABOUT LENSKART</h3>
                            <p className="mb-4">
                                Lenskart is one of the leading eyewear brands in India offering a wide range
                                of eyeglasses, contact lenses, and sunglasses. With over 1000 stores, we blend
                                cutting-edge technology with fashion and healthcare.
                            </p>
                            <ul className="space-y-1 text-xs  text-white/80 flex flex-col gap-1">
                                <li className="hover-item"><a className='border-b-1 border-white/60 pb-1' href="https://www.lenskart.com/">support@lenskart.com ↗</a> </li>
                                <li className="hover-item"><a className='border-b-1 border-white/60 pb-1' href="https://www.instagram.com/lenskart/">Instagram ↗</a></li>
                                <li className="hover-item"><a className='border-b-1 border-white/60 pb-1' href="https://www.linkedin.com/company/lenskart-com/">LinkedIn ↗</a></li>
                                <li className="hover-item"><a className='border-b-1 border-white/60 pb-1' href="https://x.com/Lenskart_com">X ↗</a></li>
                            </ul>
                        </div>

                        {/* Stores */}
                        <div>
                            <h3 className="text-gray-400 mb-2 hover-heading">STORES</h3>
                            <p className="hover-item">Over 1000 stores in India</p>
                            <p className="hover-item">Expanding in Middle East & Southeast Asia</p>

                            <h3 className="text-gray-400 mt-4 mb-2 hover-heading">CUSTOMER SERVICE</h3>
                            <ul className="space-y-1 text-xs">
                                <li className="hover-item">Try at Home</li>
                                <li className="hover-item">Free Eye Test</li>
                                <li className="hover-item">30-Day Return</li>
                                <li className="hover-item">24x7 Support</li>
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h3 className="text-gray-400 mb-2 hover-heading">SERVICES</h3>
                            <ul className="space-y-1 text-xs">
                                <li className="hover-item">3D Try-On</li>
                                <li className="hover-item">Virtual Eye Test</li>
                                <li className="hover-item">Home Eye Checkup</li>
                                <li className="hover-item">Premium Lens Options</li>
                                <li className="hover-item">Prescription Management</li>
                            </ul>
                        </div>

                        {/* Brands */}
                        <div>
                            <h3 className="text-gray-400 mb-2 hover-heading">BRANDS</h3>
                            <div className="grid grid-cols-2 gap-x-4 text-xs">
                                {[
                                    "John Jacobs", "Aqualens", "Hooper", "Vincent Chase",
                                    "Ray-Ban", "Oakley", "Tommy Hilfiger", "Vogue",
                                    "Gucci", "Polaroid", "Michael Kors", "Fossil"
                                ].map((brand, index) => (
                                    <span key={index} className="hover-item opacity-80">{brand}</span>
                                ))}
                            </div>
                        </div>

                        {/* Careers */}
                        <div>
                            <h3 className="text-gray-400 mb-2 hover-heading">CAREERS</h3>
                            <p className="text-xs hover-item">Join our team – we're hiring across tech, retail, and design. Visit our careers page.</p>
                        </div>
                    </div>
                </div>

                {/* Bottom section with logo and waving hand */}
                <div className="footer-second relative w-full bg-[#ababa1] flex items-center justify-center md:h-[40%]">
                    <h1
                        ref={lenskartRef}
                        className="tracking-wide font-three uppercase text-[#111] text-[8rem] md:text-[15rem] xl:text-[20rem]"
                    >
                        Lenskart
                    </h1>

                    {/* Waving Hand SVG */}
                    <svg className='absolute -top-[70%] right-0 hidden md:block' version="1.0" xmlns="http://www.w3.org/2000/svg" width="154pt" height="243pt" viewBox="0 0 154 243" preserveAspectRatio="xMidYMid meet">
                        <g transform="translate(0,243) scale(0.1,-0.1)" fill="#ff4d4d" stroke="none">
                            <g ref={handRef}> {/* 👋 This is the waving hand */}
                                <path d="M1381 2038 c-75 -233 -239 -413 -428 -469 -47 -13 -60 -33 -15 -23 65 14 172 76 241 140 105 97 170 198 217 338 26 76 28 86 16 86 -4 0 -19 -33 -31 -72z" />
                            </g>
                            <path d="M702 1979 c-64 -32 -82 -61 -82 -132 0 -116 62 -193 163 -204 94 -10 172 32 208 112 39 85 15 152 -75 213 -41 27 -57 32 -110 32 -42 0 -74 -7 -104 -21z m205 -25 c82 -48 105 -129 60 -209 -33 -59 -93 -87 -176 -83 -59 4 -66 7 -101 45 -68 72 -76 199 -14 239 69 46 161 49 231 8z" />
                            <path d="M814 1555 c-3 -20 -5 -76 -2 -124 3 -69 10 -99 29 -137 14 -27 54 -105 89 -174 35 -69 65 -120 67 -113 4 10 -36 94 -134 283 -30 59 -44 148 -36 232 6 72 -2 92 -13 33z" />
                            <path d="M685 1463 c-24 -221 -87 -421 -161 -519 -13 -17 -21 -34 -18 -37 8 -8 55 57 88 121 34 67 72 201 90 315 21 133 25 177 16 177 -5 0 -11 -26 -15 -57z" />
                            <path d="M1203 963 c-64 -9 -31 -18 65 -18 79 0 103 -4 132 -20 43 -25 70 -76 70 -131 0 -52 -33 -160 -71 -236 -16 -31 -25 -59 -20 -62 9 -6 71 122 92 189 18 57 15 164 -5 203 -9 18 -34 41 -56 52 -40 20 -146 32 -207 23z" />
                            <path d="M890 931 c0 -6 10 -11 23 -11 28 0 122 -44 165 -77 19 -14 41 -42 49 -61 16 -39 21 -186 8 -260 -4 -25 -3 -42 3 -42 21 0 31 223 12 290 -13 47 -72 103 -140 134 -68 30 -120 42 -120 27z" />
                        </g>
                    </svg>

                    {isHome && (
                        <h1
                            ref={bylineRef}
                            className="absolute -bottom-8 md:-bottom-6 text-[0.8rem] md:text-[1.1rem] text-[#ababa1]"
                        >
                            &copy; 2025 Design and Developed by{" "}
                            <a href="https://www.linkedin.com/in/saurabh-dwivedi-7b301a334/">Saurabh Dwivedi</a>
                        </h1>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactMini;