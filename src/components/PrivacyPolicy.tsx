"use client";

import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#E5E5DD] text-black py-20 px-6 sm:px-16 leading-relaxed mt-0">
      {/* Heading with full-width underline */}
      <div className="text-center mb-12 relative">
        <h1 className="text-4xl md:text-5xl font-bold text-black uppercase tracking-wider inline-block bg-[#E5E5DD] px-4 relative z-10">
          Privacy Policy
        </h1>
        <div className="absolute left-0 bottom-0 w-full h-[2px] bg-gray-400"></div>
      </div>

      {/* Intro */}
      <p className="text-base md:text-lg mb-12 text-gray-800 text-center max-w-4xl mx-auto font-light tracking-wide">
        <span className="font-bold">AeroModelling Club at NIT Kurukshetra</span> is
        committed to protecting your privacy. This Privacy Policy outlines how
        we collect, use, and safeguard your personal information when you
        interact with our website,{" "}
        <a
          href="https://aeronitkkr.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black underline hover:text-gray-600 transition-colors duration-300 font-light tracking-wide"
        >
          https://aeronitkkr.in/
        </a>
        .
      </p>

      {/* Sections */}
      <section className="space-y-12 text-gray-800">
        {[
          {
            title: "Information We Collect",
            content:
              "We may collect personal information that you voluntarily provide to us, such as your name, email address, and any messages you send through our contact form."
          },
          {
            title: "How We Use Your Information",
            content:
              "The information you provide is used solely to respond to your inquiries and to improve our services. We do not share your personal information with third parties without your explicit consent."
          },
          {
            title: "Data Security",
            content:
              "We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction."
          },
          {
            title: "Cookies",
            content:
              "Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings; however, this may affect the functionality of our website."
          },
          {
            title: "Third-Party Links",
            content:
              "Our website may contain links to external sites. We are not responsible for the privacy practices or content of these external websites."
          },
          {
            title: "Changes to This Privacy Policy",
            content:
              "We reserve the right to update this Privacy Policy at any time. Any changes will be posted on this page with an updated revision date."
          },
          {
            title: "Contact Us",
            content:
              "If you have any questions or concerns about this Privacy Policy, please contact us through the message form on our website. By using our website, you consent to the terms of this Privacy Policy."
          }
        ].map((section, index) => (
          <div key={index}>
            <h2 className="text-2xl md:text-3xl font-bold text-black border-b-2 border-gray-400 pb-2 mb-4 uppercase tracking-wider">
              {section.title}
            </h2>
            <p className="text-base md:text-lg font-light tracking-wide">{section.content}</p>
          </div>
        ))}
      </section>

      {/* Divider */}
      <div className="border-t-2 border-gray-400 mt-16 pt-6 text-center text-sm text-gray-600 font-light tracking-wide">
        Last Updated: October 2025
      </div>
    </div>
  );
};

export default PrivacyPolicy;
