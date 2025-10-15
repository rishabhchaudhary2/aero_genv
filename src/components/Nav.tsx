'use client';

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import Link from "next/link";
import "./Navbar.css";

gsap.registerPlugin(CustomEase);

const Nav: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const isAnimatingRef = useRef(false);
    const animationsRef = useRef<gsap.core.Timeline[]>([]);
    
    const toggleMenu = () => {
        if (isAnimatingRef.current) return;
        setIsOpen(!isOpen);
    };

    // Initialize header text only once
    useEffect(() => {
        const header = document.querySelector(".header h1");
        if (header) {
            const text = header.textContent || "";
            header.innerHTML = text
                .split("")
                .map((char) =>
                    char === " " ? "&nbsp;&nbsp;" : `<span>${char}</span>`
                )
                .join("");
        }
        
        // Setup arrow animations
        const arrowLinks = document.querySelectorAll(".social-link");
        arrowLinks.forEach((link) => {
            const arrow = link.querySelector(".arrow");
            link.addEventListener("mouseenter", () => {
                gsap.to(arrow, {
                    x: 0,
                    opacity: 1,
                    duration: 0.4,
                    ease: "power3.out",
                });
            });
            link.addEventListener("mouseleave", () => {
                gsap.to(arrow, {
                    x: -10,
                    opacity: 0,
                    duration: 0.4,
                    ease: "power3.in",
                });
            });
        });
        
        // Cleanup function
        return () => {
            // Kill all animations on component unmount
            animationsRef.current.forEach(tl => tl.kill());
        };
    }, []);

    // Handle menu open/close animations
    useEffect(() => {
        const menu = document.querySelector(".menu");
        const links = document.querySelectorAll(".link");
        const socialLinks = document.querySelectorAll(".socials p");
        const headerSpans = document.querySelectorAll(".header h1 span");
        
        if (!menu) return;
        
        CustomEase.create("hop", "M0,0 C0.354,0 0.464,0.133 0.498,0.502 0.532,0.872 0.651,1 1,1");
        
        // Kill any existing animations
        animationsRef.current.forEach(tl => tl.kill());
        animationsRef.current = [];

        isAnimatingRef.current = true;
        
        if (isOpen) {
            const tl = gsap.timeline({
                onComplete: () => {
                    isAnimatingRef.current = false;
                }
            });
            
            animationsRef.current.push(tl);
            
            tl.to(menu, {
                clipPath: "polygon(0% 0%, 100% 0% , 100% 100% , 0% 100%)",
                ease: "hop",
                duration: 1.5,
                pointerEvents: "all",
            });

            tl.to(links, {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                duration: 1,
                ease: "power3.out",
            }, "-=0.65");

            tl.to(socialLinks, {
                y: 0,
                opacity: 1,
                stagger: 0.05,
                duration: 1,
                ease: "power3.out",
            }, "<");

            tl.to(".video-wrapper", {
                clipPath: "polygon(0% 0%, 100% 0% , 100% 100% , 0% 100%)",
                ease: "hop",
                duration: 1.5,
            }, "-=1.0");

            tl.to(headerSpans, {
                rotateY: 0,
                stagger: 0.05,
                duration: 1.5,
                ease: "power4.out",
            }, "-=0.75");

            tl.to(headerSpans, {
                y: 0,
                scale: 1,
                stagger: 0.05,
                duration: 1.5,
                ease: "power4.out",
            }, "-=1.0");
        } else {
            const tl = gsap.timeline({
                onComplete: () => {
                    if (menu) {
                        gsap.set(menu, { clipPath: "polygon(0% 100%, 100% 100% , 100% 100% , 0% 100%)" });
                        gsap.set(links, { y: 30, opacity: 0 });
                        gsap.set(socialLinks, { y: 30, opacity: 0 });
                        gsap.set(".video-wrapper", {
                            clipPath: "polygon(0% 100%, 100% 100% , 100% 100% , 0% 100%)",
                        });
                        gsap.set(headerSpans, {
                            y: 500,
                            rotateY: 90,
                            scale: 0.75,
                        });
                    }
                    isAnimatingRef.current = false;
                }
            });
            
            animationsRef.current.push(tl);
            
            tl.to(menu, {
                clipPath: "polygon(0% 0%, 100% 0% , 100% 0% , 0% 0%)",
                ease: "hop",
                duration: 1.5,
                pointerEvents: "none",
            });
        }
    }, [isOpen]);

    return (
        <>
            <div className="logo">
                <Link href="/">AeroModelling </Link>
            </div>

            <div className={`menu-toggle ${isOpen ? "opened" : "closed"}`} onClick={toggleMenu} style={{ zIndex: 999 }}>
                <div className="menu-toggle-icon">
                    <div className="hamburger">
                        <div className="menu-bar" data-position="top"></div>
                        <div className="menu-bar" data-position="bottom"></div>
                    </div>
                </div>
                <div className="menu-copy">
                    <p>Menu</p>
                </div>
            </div>

            <div className="menu">
                <div className="col col-1">
                    <div className="menu-logo">
                        <Link href="/">AeroModelling</Link>
                    </div>
                    <div className="links">
                        <div className="link">
                            <Link href="/">Home</Link>
                        </div>
                        <div className="link">
                            <Link href="/drones">Drone Team </Link>
                        </div>
                        <div className="link">
                            <Link href="/rcplanes">Rc Team </Link>
                        </div>
                        <div className="link">
                            <Link href="/about">About</Link>
                        </div>
                        <div className="link">
                            <Link href="/techspardha">Techspardha</Link>
                        </div>
                        <div className="link">
                            <Link href="/gallery">Gallery</Link>
                        </div>
                        <div className="link">
                            <Link href="/login">Login</Link>
                        </div>
                    </div>
                    <div className="video-wrapper">
                        <video loop muted autoPlay src="/videos/intro.mp4"></video>
                    </div>
                </div>

                <div className="col col-2">
                    <div className="socials">
                        <div className="sub-col">
                            <p>AeroModelling Club</p>
                            <p>NIT Kurukshetra</p>
                            <p>University Campus</p>
                            <p>Haryana, India</p>
                            <br />
                            <p>aeroclub@nitkkr.ac.in</p>
                            <p>join@aeroclub.nitkkr.ac.in</p>
                        </div>
                        <div className="sub-col">
                            <p>
                                <a
                                    href="https://www.instagram.com/aero_modelling_club_nitkkr/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link"
                                >
                                    Instagram <span className="arrow"><LiaLongArrowAltRightSolid /></span>
                                    <span className="underline"></span>
                                </a>
                            </p>
                            <p>
                                <a
                                    href="https://www.linkedin.com/company/aero-modelling-club-nitkkr/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link"
                                >
                                    LinkedIn <span className="arrow"><LiaLongArrowAltRightSolid /></span>
                                    <span className="underline"></span>
                                </a>
                            </p>
                            <p>
                                <a
                                    href="https://github.com/aeroclub-nitkkr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link"
                                >
                                    GitHub <span className="arrow"><LiaLongArrowAltRightSolid /></span>
                                    <span className="underline"></span>
                                </a>
                            </p>
                            <p>
                                <a
                                    href="https://www.facebook.com/aeroclub.nitkkr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link"
                                >
                                    Facebook <span className="arrow"><LiaLongArrowAltRightSolid /></span>
                                    <span className="underline"></span>
                                </a>
                            </p>
                            <br />
                            <p>+91 9876543210</p>
                        </div>
                    </div>
                    <div className="header">
                        <h1>AeroClub</h1>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Nav;