'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import DecoderMotion from '../components/DecoderMotion';

const Header: React.FC = () => {
    const headingsTopRight: string[] = [
        "Real Recommendation By Real People",
        "Genuine Opinions From Real Users"
    ];
    const [topIndex, setTopIndex] = useState<number>(0);

    const headingsBottomLeft: string[] = [
        "See Better. Look Smarter. Only with Lenskart.",
        "Eyewear That Reflects Your Style."
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
    }, []);

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="relative text-center">
                <h1 className="text-[5rem] md:text-[9rem] font-three font-thin leading-none tracking-wider uppercase text-black">
                    Aero Modelling Club
                </h1>
                <br />
                <h5 className="text-[2rem] md:text-[4rem] font-three font-thin leading-none tracking-wider uppercase text-black">
                    NIT Kurukshetra
                </h5>
                <DecoderMotion />

                {/* Glasses image on "WEAR" side */}
                <motion.img
                    initial={{ x: -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute -top-20 -left-10 md:-left-30 h-32 md:h-44 rotate-[20deg]"
                    src="https://res.cloudinary.com/djczgyd7j/image/upload/sunglasses_dfptlh.png"
                    alt=""
                />

                {/* Glasses image on "lenskart" side */}
                <motion.img
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                    className="absolute -bottom-10 -right-10 md:-right-30 h-24 md:h-44 rotate-[-15deg]"
                    src="https://res.cloudinary.com/djczgyd7j/image/upload/v1753443702/glasses_dz9xuq.png"
                    alt=""
                />
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