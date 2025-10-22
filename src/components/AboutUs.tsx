"use client";

import React from "react";
import Link from "next/link";

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#E5E5DD] text-black py-20 px-6 sm:px-10 leading-relaxed mt-0">
      {/* Header */}
      <h1 className="text-4xl md:text-5xl font-bold text-black border-b-2 border-gray-400 pb-4 mb-8 text-center uppercase tracking-wider">
        About Us
      </h1>

      {/* Content */}
      <div className="max-w-5xl mx-auto space-y-6 text-gray-800">
        <p className="text-base md:text-lg font-light tracking-wide">
          Welcome to the <span className="font-bold">AeroModelling Club</span> at
          NIT Kurukshetra! We bring together students passionate about the art
          and science of designing, constructing, and flying model aircraft.
          Established in 2007, our club has grown from a small team of
          enthusiasts into a thriving community recognized for innovation,
          precision, and excellence in aviation.
        </p>

        <p className="text-base md:text-lg font-light tracking-wide">
          Our journey began with the vision and leadership of{" "}
          <span className="font-bold">Kamal Kant Gaur</span> and
          a team of dedicated aviation enthusiasts —{" "}
          <span className="font-bold">Deepesh, Rupesh, and Suman</span> — 
          under the expert mentorship of{" "}
          <span className="font-bold">Dr. A.S. GL Pahuja</span>.
          Their pioneering spirit laid the foundation for a club that continues
          to inspire creativity, collaboration, and technical mastery.
        </p>

        <p className="text-base md:text-lg font-light tracking-wide">
          Over the years, we have undertaken several ambitious aircraft
          prototyping projects — from fixed-wing RC planes to experimental
          drone systems. Our club provides an environment where innovation and
          engineering come together. Members collaborate on projects, exchange
          knowledge, and explore the limitless possibilities of flight design
          and aerodynamics.
        </p>

        <p className="text-base md:text-lg font-light tracking-wide">
          Whether you’re an experienced pilot or a curious beginner, the Aero
          Club welcomes you. We believe in building skills, sharing ideas, and
          nurturing a community where imagination truly takes flight. Join us to
          be part of this legacy — to learn, create, and soar to new heights.
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-400 mt-12 pt-6 text-center">
        <Link
          href="/"
          className="inline-block text-black hover:text-gray-600 font-bold uppercase tracking-wider transition-colors duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default AboutUs;
