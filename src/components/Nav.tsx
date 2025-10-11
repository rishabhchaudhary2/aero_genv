'use client';

import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import Link from "next/link";
import "./Navbar.css";

gsap.registerPlugin(CustomEase);

const Nav: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);

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

        const menu = document.querySelector(".menu");
        const links = document.querySelectorAll(".link");
        const socialLinks = document.querySelectorAll(".socials p");
        const headerSpans = document.querySelectorAll(".header h1 span");
        const arrowLinks = document.querySelectorAll(".social-link");
        let isAnimating = false;

        CustomEase.create("hop", "M0,0 C0.354,0 0.464,0.133 0.498,0.502 0.532,0.872 0.651,1 1,1");

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

        if (isOpen) {
            if (isAnimating) return;
            isAnimating = true;

            gsap.to(menu, {
                clipPath: "polygon(0% 0%, 100% 0% , 100% 100% , 0% 100%)",
                ease: "hop",
                duration: 1.5,
                pointerEvents: "all",
                onComplete: () => isAnimating = false,
            });

            gsap.to(links, {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                delay: 0.85,
                duration: 1,
                ease: "power3.out",
            });

            gsap.to(socialLinks, {
                y: 0,
                opacity: 1,
                stagger: 0.05,
                delay: 0.85,
                duration: 1,
                ease: "power3.out",
            });

            gsap.to(".video-wrapper", {
                clipPath: "polygon(0% 0%, 100% 0% , 100% 100% , 0% 100%)",
                ease: "hop",
                duration: 1.5,
                delay: 0.5,
            });

            gsap.to(headerSpans, {
                rotateY: 0,
                stagger: 0.05,
                delay: 0.75,
                duration: 1.5,
                ease: "power4.out",
            });

            gsap.to(headerSpans, {
                y: 0,
                scale: 1,
                stagger: 0.05,
                delay: 0.5,
                duration: 1.5,
                ease: "power4.out",
            });
        } else {
            gsap.to(menu, {
                clipPath: "polygon(0% 0%, 100% 0% , 100% 0% , 0% 0%)",
                ease: "hop",
                duration: 1.5,
                pointerEvents: "none",
                onComplete: () => {
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
                },
            });
        }
    }, [isOpen]);

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
    }, []);

    return (
        <>
            <div className="logo">
                <Link href="/">AeroModelling </Link>
            </div>

            <div className={`menu-toggle ${isOpen ? "opened" : "closed"}`} onClick={toggleMenu}>
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
                            <Link href="/products">Drone Team </Link>
                        </div>
                        <div className="link">
                            <Link href="/products">Rc Team </Link>
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
                        <video loop muted autoPlay src="https://res.cloudinary.com/djczgyd7j/video/upload/intro_e4bfz2.mp4"></video>
                    </div>
                </div>

                <div className="col col-2">
                    <div className="socials">
                        <div className="sub-col">
                            <p>Lenskart HQ</p>
                            <p>Gurugram</p>
                            <p>Golf Course Rd, Sector 42</p>
                            <p> Haryana India</p>
                            <br />
                            <p>contact@lenskart.com</p>
                            <p>job@lenskart.com</p>
                        </div>
                        <div className="sub-col">
                            <p>
                                <a
                                    href="https://www.instagram.com/lenskart/"
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
                                    href="https://www.linkedin.com/company/lenskart-com/"
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
                                    href="https://x.com/lenskartME"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link"
                                >
                                    X <span className="arrow"><LiaLongArrowAltRightSolid /></span>
                                    <span className="underline"></span>
                                </a>
                            </p>
                            <p>
                                <a
                                    href="https://www.facebook.com/Lenskartindia"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link"
                                >
                                    Facebook <span className="arrow"><LiaLongArrowAltRightSolid /></span>
                                    <span className="underline"></span>
                                </a>
                            </p>
                            <br />
                            <p>99 99 8 99 99 8</p>
                        </div>
                    </div>
                    <div className="header">
                        <h1>Lenskart</h1>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Nav;