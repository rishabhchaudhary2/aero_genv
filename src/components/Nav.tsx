'use client';

import React, { useState, useEffect, useRef } from "react";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import { FiLogOut, FiUser } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import "./Navbar.css";


const Nav: React.FC = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isHoveringProfile, setIsHoveringProfile] = useState(false);
    const { user, isLoading: isLoadingUser, logout } = useAuth();
    const menuRef = useRef<HTMLDivElement>(null);
    
    const toggleMenu = () => {
        if (isAnimating) return;
        setIsOpen(!isOpen);
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await logout();
            setIsOpen(false);
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Handle animation state
    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
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
                    overflow-y: auto;
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
                .menu.open .link:nth-child(8) { transition-delay: 1.55s; }

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

                /* Responsive Styles */
                @media (max-width: 768px) {
                    body {
                        overflow-x: hidden;
                    }

                    .logo {
                        padding: 15px;
                    }

                    .logo img {
                        height: 60px !important;
                        width: 60px !important;
                    }

                    .menu-toggle {
                        padding: 15px;
                    }

                    .menu-toggle-icon {
                        transform: scale(0.8);
                    }

                    .menu-copy p {
                        font-size: 12px;
                    }

                    .menu {
                        display: flex;
                        flex-direction: column;
                        padding: 20px;
                        overflow-x: hidden;
                        width: 100vw;
                    }

                    .col {
                        width: 100% !important;
                        padding: 20px 0 !important;
                        max-width: 100%;
                    }

                    .col-2:first-child {
                        order: 1;
                    }

                    .col-2:last-child {
                        order: 2;
                    }

                    .menu-logo {
                        margin-bottom: 30px;
                    }

                    .menu-logo img {
                        height: 80px !important;
                        width: 80px !important;
                    }

                    .links {
                        flex-direction: column !important;
                        gap: 20px !important;
                        margin-bottom: 30px;
                    }

                    .link {
                        font-size: 24px;
                        margin-bottom: 15px;
                    }

                    .video-wrapper {
                        display: none;
                    }

                    .login-info {
                        display: none;
                    }

                    .socials {
                        display: none;
                    }

                    .header {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 300px;
                    }

                    .header h1 {
                        font-size: 80px;
                        justify-content: center;
                        flex-wrap: wrap;
                    }

                    .header-char {
                        font-size: 80px;
                    }

                    .col-2:last-child {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                }

                @media (min-width: 769px) and (max-width: 1024px) {
                    body {
                        overflow-x: hidden;
                    }

                    .logo img {
                        height: 90px !important;
                        width: 90px !important;
                    }

                    .menu {
                        padding: 30px;
                        overflow-x: hidden;
                        width: 100vw;
                    }

                    .col {
                        max-width: 100%;
                    }

                    .links {
                        gap: 30px !important;
                    }

                    .link {
                        font-size: 28px;
                    }

                    .video-wrapper {
                        display: none;
                    }

                    .login-info {
                        display: none;
                    }

                    .socials {
                        display: none;
                    }

                    .header {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 200px;
                    }

                    .header h1 {
                        font-size: 56px;
                    }
                }

                @media (max-width: 480px) {
                    body {
                        overflow-x: hidden;
                    }

                    .logo img {
                        height: 50px !important;
                        width: 50px !important;
                    }

                    .menu {
                        padding: 15px;
                        overflow-x: hidden;
                        width: 100vw;
                    }

                    .col {
                        max-width: 100%;
                    }

                    .link {
                        font-size: 20px;
                        margin-bottom: 12px;
                    }

                    .video-wrapper {
                        display: none;
                    }

                    .login-info {
                        display: none;
                    }

                    .socials {
                        display: none;
                    }

                    .header {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 220px;
                    }

                    .header h1 {
                        font-size: 64px;
                    }

                    .header-char {
                        font-size: 64px;
                    }
                }

                /* Ensure menu content doesn't overflow */
                @media (max-height: 700px) and (max-width: 768px) {
                    body {
                        overflow-x: hidden;
                    }

                    .menu {
                        overflow-y: auto;
                        overflow-x: hidden;
                        width: 100vw;
                    }

                    .col {
                        max-width: 100%;
                    }

                    .link {
                        font-size: 18px;
                        margin-bottom: 10px;
                    }

                    .video-wrapper {
                        display: none;
                    }

                    .login-info {
                        display: none;
                    }

                    .socials {
                        display: none;
                    }

                    .header {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 120px;
                    }

                    .header h1 {
                        font-size: 24px;
                    }

                    .menu-logo {
                        margin-bottom: 20px;
                    }
                }

                * {
                    box-sizing: border-box;
                }

                html, body {
                    overflow-x: hidden;
                    max-width: 100vw;
                }

                .profile-text {
                    position: relative;
                    display: block;
                    overflow: hidden;
                    width: 100%;
                    min-width: 240px;
                }

                .profile-text-content {
                    display: block;
                    width: 100%;
                    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }

                .profile-card:hover .profile-text-content {
                    transform: translateY(-100%);
                }

                .profile-text-alt {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    width: 100%;
                    min-width: 200px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }

                .profile-card:hover .profile-text-alt {
                    transform: translateY(-100%);
                }

                .profile-avatar {
                    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }

                .profile-card:hover .profile-avatar {
                    transform: scale(1.1) rotate(5deg);
                    box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
                }
            `}</style>

            <div className="logo">
                <Link href="/"><img src="/aerologo.png" alt="AeroModelling Logo" height={120} width={120} /></Link>
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
                <div className="col col-2">
                    <div className="menu-logo">
                        <Link href="/"><img src="/aerologo.png" alt="AeroModelling Logo" height={120} width={120} /></Link>
                    </div>
                    <div className="links flex gap-10">
                        <div className="">
                            <div className="link">
                                <Link href="/">Home</Link>
                            </div>
                            <div className="link">
                                <Link href="/drones">Drone </Link>
                            </div>
                            <div className="link">
                                <Link href="/rcplanes">Rc Planes</Link>
                            </div>
                            <div className="link">
                                <Link href="/techspardha">Techspardha</Link>
                            </div>
                            <div className="link">
                                <Link href="/workshop">WorkShops</Link>
                            </div>
                        </div>
                        <div>
                            <div className="link">
                                <Link href="/techspardha">External Events</Link>
                            </div>
                            <div className="link">
                                <Link href="/members">Our Members</Link>
                            </div>
                            <div className="link">
                                <Link href="/gallery">Gallery</Link>
                            </div>
                            {!isLoadingUser && (
                                user ? (
                                    <div className="link">
                                        <a 
                                            onClick={handleLogout}
                                            style={{ cursor: 'pointer' }}
                                            className="flex items-center gap-2"
                                        >
                                            Logout
                                        </a>
                                    </div>
                                ) : (
                                    <>
                                        <div className="link">
                                            <Link href="/login">Login</Link>
                                        </div>
                                        <div className="link">
                                            <Link href="/signup">Sign Up</Link>
                                        </div>
                                    </>
                                )
                            )}
                        </div>
                    </div>
                    <div className="video-wrapper">
                        <video loop muted autoPlay playsInline src="/videos/intro.mp4"></video>
                    </div>
                </div>

                <div className="col col-2">
                    {user && (
                        <div className="sub-col w-[50%] login-info">
                            <div 
                                className="flex items-center gap-3 mb-2 cursor-pointer profile-card"
                                onMouseEnter={() => setIsHoveringProfile(true)}
                                onMouseLeave={() => setIsHoveringProfile(false)}
                            >
                                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center border-2 border-current profile-avatar">
                                    <FiUser className="w-6 h-6" />
                                </div>
                                <div className="text-white flex-1">
                                    <p className="text-left opacity-70! transform-none! text-transform-none!">
                                        Logged in as
                                    </p>
                                    <div className="text-left text-sm transform-none! text-transform-none! profile-text">
                                        <div className="profile-text-content">
                                            {user.full_name || 'User'}
                                        </div>
                                        <div className="profile-text-alt">
                                            {user.email}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
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
                                {/* <a
                                    href="https://github.com/aeroclub-nitkkr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link"
                                >
                                    GitHub <span className="arrow"><LiaLongArrowAltRightSolid /></span>
                                    <span className="underline"></span>
                                </a> */}
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
                            <p>+91 98127 63151</p>
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