'use client';

import React, { useState, useEffect, useRef } from "react";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import Link from "next/link";
import "./Navbar.css";

const Nav: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    
    const toggleMenu = () => {
        if (isAnimating) return;
        setIsOpen(!isOpen);
    };

    // Handle animation state
    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            // Animation duration is 1500ms
            const timer = setTimeout(() => setIsAnimating(false), 1500);
            return () => clearTimeout(timer);
        } else {
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    return (
        <>
            <style jsx>{`
                .menu {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    z-index: 998;
                    pointer-events: none;
                    clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);
                    transition: clip-path 1.5s cubic-bezier(0.354, 0, 0.498, 0.502);
                }

                .menu.open {
                    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
                    pointer-events: all;
                }

                .link {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }

                .menu.open .link {
                    opacity: 1;
                    transform: translateY(0);
                }

                .menu.open .link:nth-child(1) { transition-delay: 0.85s; }
                .menu.open .link:nth-child(2) { transition-delay: 0.95s; }
                .menu.open .link:nth-child(3) { transition-delay: 1.05s; }
                .menu.open .link:nth-child(4) { transition-delay: 1.15s; }
                .menu.open .link:nth-child(5) { transition-delay: 1.25s; }
                .menu.open .link:nth-child(6) { transition-delay: 1.35s; }
                .menu.open .link:nth-child(7) { transition-delay: 1.45s; }

                .socials p {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }

                .menu.open .socials p {
                    opacity: 1;
                    transform: translateY(0);
                }

                .menu.open .socials .sub-col:nth-child(1) p:nth-child(1) { transition-delay: 0.85s; }
                .menu.open .socials .sub-col:nth-child(1) p:nth-child(2) { transition-delay: 0.90s; }
                .menu.open .socials .sub-col:nth-child(1) p:nth-child(3) { transition-delay: 0.95s; }
                .menu.open .socials .sub-col:nth-child(1) p:nth-child(4) { transition-delay: 1.00s; }
                .menu.open .socials .sub-col:nth-child(1) p:nth-child(6) { transition-delay: 1.05s; }
                .menu.open .socials .sub-col:nth-child(1) p:nth-child(7) { transition-delay: 1.10s; }

                .menu.open .socials .sub-col:nth-child(2) p:nth-child(1) { transition-delay: 0.85s; }
                .menu.open .socials .sub-col:nth-child(2) p:nth-child(2) { transition-delay: 0.90s; }
                .menu.open .socials .sub-col:nth-child(2) p:nth-child(3) { transition-delay: 0.95s; }
                .menu.open .socials .sub-col:nth-child(2) p:nth-child(4) { transition-delay: 1.00s; }
                .menu.open .socials .sub-col:nth-child(2) p:nth-child(6) { transition-delay: 1.05s; }

                .video-wrapper {
                    clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);
                    transition: clip-path 1.5s cubic-bezier(0.354, 0, 0.498, 0.502);
                }

                .menu.open .video-wrapper {
                    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
                    transition-delay: 0.5s;
                }

                .header h1 {
                    display: flex;
                }

                .header-char {
                    display: inline-block;
                    transform: translateY(500px) rotateY(90deg) scale(0.75);
                    transition: all 1.5s cubic-bezier(0.19, 1, 0.22, 1);
                }

                .menu.open .header-char {
                    transform: translateY(0) rotateY(0deg) scale(1);
                }

                .menu.open .header-char:nth-child(1) { transition-delay: 0.75s; }
                .menu.open .header-char:nth-child(2) { transition-delay: 0.80s; }
                .menu.open .header-char:nth-child(3) { transition-delay: 0.85s; }
                .menu.open .header-char:nth-child(4) { transition-delay: 0.90s; }
                .menu.open .header-char:nth-child(5) { transition-delay: 0.95s; }
                .menu.open .header-char:nth-child(6) { transition-delay: 1.00s; }
                .menu.open .header-char:nth-child(7) { transition-delay: 1.05s; }
                .menu.open .header-char:nth-child(8) { transition-delay: 1.10s; }

                .social-link {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }

                .arrow {
                    display: inline-flex;
                    opacity: 0;
                    transform: translateX(-10px);
                    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }

                .social-link:hover .arrow {
                    opacity: 1;
                    transform: translateX(0);
                }

                .underline {
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 0;
                    height: 1px;
                    background-color: currentColor;
                    transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }

                .social-link:hover .underline {
                    width: 100%;
                }
            `}</style>

            <div className="logo">
                <Link href="/">AeroModelling</Link>
            </div>

            <div 
                className={`menu-toggle ${isOpen ? "opened" : "closed"}`} 
                onClick={toggleMenu} 
                style={{ zIndex: 999 }}
            >
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

            <div className={`menu ${isOpen ? 'open' : ''}`} ref={menuRef}>
                <div className="col col-1">
                    <div className="menu-logo">
                        <Link href="/">AeroModelling</Link>
                    </div>
                    <div className="links">
                        <div className="link">
                            <Link href="/">Home</Link>
                        </div>
                        <div className="link">
                            <Link href="/drones">Drone Team</Link>
                        </div>
                        <div className="link">
                            <Link href="/rcplanes">Rc Team</Link>
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
                        <video loop muted autoPlay playsInline src="/videos/intro.mp4"></video>
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
                        <h1>
                            {"AeroClub".split("").map((char, index) => (
                                <span key={index} className="header-char">
                                    {char}
                                </span>
                            ))}
                        </h1>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Nav;