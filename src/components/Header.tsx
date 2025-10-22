'use client';

import {  useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import DecoderMotion from '../components/DecoderMotion';

const Header: React.FC = () => {
    const headingsTopRight: string[] = [
        "Real Ideas from Real Innovators.",
        "Genuine creations by real Engineers"
    ];
    const [topIndex, setTopIndex] = useState<number>(0);

    const headingsBottomLeft: string[] = [
        "Design Better. Fly Smarter. Only with AERO Modelling.",
        "Aircrafts that reflect your passion."
    ];
    const [bottomIndex, setBottomIndex] = useState<number>(0);

    useEffect(() => {
        const intervalTop = setInterval(() => {
            setTopIndex((prev) => (prev + 1) % headingsTopRight.length);
        }, 4000);

        const intervalBottom = setInterval(() => {
            setBottomIndex((prev) => (prev + 1) % headingsBottomLeft.length);
        }, 4000);

        return () => {
            clearInterval(intervalTop);
            clearInterval(intervalBottom);
        };
    } );

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="relative text-center max-w-7xl mx-auto px-4">
                <h1 className="text-[5rem] md:text-[9rem] font-three font-thin leading-none tracking-wider uppercase text-black">
                    Aero Modelling Club
                </h1>
                <br />
                <h5 className="text-[2rem] md:text-[4rem] font-three font-thin leading-none tracking-wider uppercase text-black">
                    NIT Kurukshetra
                </h5>
                
                {/* Sleek Description Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className="mt-10 md:mt-14 max-w-3xl mx-auto px-6"
                >
                    {/* Motto Heading */}
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
                        className="text-lg md:text-2xl font-final font-semibold text-[#195E39] mb-6 tracking-wide"
                    >
                        "If it flies, we build it."
                    </motion.h3>
                    
                    {/* Description Text */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
                        className="text-sm md:text-base font-final leading-relaxed text-black/75 max-w-2xl mx-auto"
                    >
                        At Aero Modelling Club, NIT Kurukshetra, we blend creativity and engineering to design, build, and fly miniature aircraft. From gliders to RC planes, every project pushes our curiosity higher. We learn, innovate, and take flight — one idea at a time.
                    </motion.p>
                </motion.div>

                {/* Glasses image on "WEAR" side
                <motion.img
                    initial={{ x: -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute -top-20 -left-10 md:-left-30 h-32 md:h-44 rotate-[20deg]"
                    src="/icons/sunglasses.png"
                    alt=""
                />

                {/* Glasses image on "lenskart" side */}
                {/* <motion.img
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                    className="absolute -bottom-10 -right-10 md:-right-30 h-24 md:h-44 rotate-[-15deg]"
                    src="/icons/glasses.png"
                    alt=""
                /> */}
            </div>
            {/* Top-Right Animated Heading */}
            <div className="absolute top-20 right-10 text-[0.6rem] md:text-xs uppercase text-[#8472F6] font-final font-thin max-w-[30vw] text-right">
                <AnimatePresence mode="wait">
                    <motion.h1
                        key={headingsTopRight[topIndex]}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.5 }}
                    >
                        {headingsTopRight[topIndex]}
                    </motion.h1>
                </AnimatePresence>
                <br />
                <hr />
            </div>

            {/* Bottom-Left Animated Heading */}
            <div className="absolute bottom-10 left-10 text-[0.6rem] md:text-xs uppercase text-[#DA9797] font-final font-thin max-w-[30vw] text-left">
                <AnimatePresence mode="wait">
                    <motion.h1
                        key={headingsBottomLeft[bottomIndex]}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                    >
                        {headingsBottomLeft[bottomIndex]}
                    </motion.h1>
                </AnimatePresence>
                <br />
                <hr />
            </div>
        </div>
    );
};

export default Header;