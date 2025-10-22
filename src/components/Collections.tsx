'use client';

import React from "react";
import Image from 'next/image';

const spotlightItems = [
  { name: "Priyanshu Soni", img: "/galleryimages/President.jpg", post: "President", nameColor: "#0C4A6E", postColor: "#0EA5E9" },
  { name: "Omkar Dua", img: "/galleryimages/Vice_President.jpg", post: "Vice President", nameColor: "#0F172A", postColor: "#1D4ED8" },
  { name: "Jay Kumar Gupta", img: "/galleryimages/Secretary.png", post: "Secretary", nameColor: "#172554", postColor: "#2563EB" },
  { name: "Harsh Raj", img: "/galleryimages/Joint_Secretary.jpg", post: "Joint Secretary", nameColor: "#1E40AF", postColor: "#3B82F6" },
];

const Spotlight: React.FC = () => {
  return (
    <>
      {/* Competitions Timeline Section */}
      <section className="relative w-full min-h-[60vh] bg-gradient-to-b from-[#f5f5f0] via-[#ffffff] to-[#e5e5dd] py-16 md:py-24 font-final overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        </div>

        {/* Header */}
        <div className="relative text-center mb-12 md:mb-16 px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-3 text-[#111]">
            Competitions Timeline
          </h2>
          <p className="text-sm md:text-base text-[#666] font-santoshi max-w-2xl mx-auto">
            Our journey in national and international aeromodelling competitions
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Timeline Items */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-0 relative">
            {/* Timeline Line - positioned to pass through dots */}
            <div className="absolute left-0 right-0 top-[8px] h-1 bg-gradient-to-r from-[#195E39] via-[#2d7a52] to-[#195E39] hidden md:block"></div>
            
            {/* 2022 - IIT Kanpur */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-4">
                <div className="w-4 h-4 bg-[#195E39] rounded-full border-4 border-white shadow-lg relative z-10 group-hover:scale-150 transition-transform duration-300"></div>
                <div className="absolute inset-0 w-4 h-4 bg-[#195E39] rounded-full animate-ping opacity-50"></div>
              </div>
              <p className="text-[#195E39] font-bold text-base md:text-lg mb-2">2022</p>
              <p className="text-[#333] font-semibold text-xs md:text-sm">IIT Kanpur</p>
            </div>

            {/* 2022 - NIT Calicut */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-4">
                <div className="w-4 h-4 bg-[#2d7a52] rounded-full border-4 border-white shadow-lg relative z-10 group-hover:scale-150 transition-transform duration-300"></div>
                <div className="absolute inset-0 w-4 h-4 bg-[#2d7a52] rounded-full animate-ping opacity-50"></div>
              </div>
              <p className="text-[#195E39] font-bold text-base md:text-lg mb-2">2022</p>
              <p className="text-[#333] font-semibold text-xs md:text-sm">NIT Calicut</p>
            </div>

            {/* 2023 - SIH */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-4">
                <div className="w-4 h-4 bg-[#195E39] rounded-full border-4 border-white shadow-lg relative z-10 group-hover:scale-150 transition-transform duration-300"></div>
                <div className="absolute inset-0 w-4 h-4 bg-[#195E39] rounded-full animate-ping opacity-50"></div>
              </div>
              <p className="text-[#195E39] font-bold text-base md:text-lg mb-2">2023</p>
              <p className="text-[#333] font-semibold text-xs md:text-sm">SIH</p>
            </div>

            {/* 2024 - IIT Bombay */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-4">
                <div className="w-4 h-4 bg-[#2d7a52] rounded-full border-4 border-white shadow-lg relative z-10 group-hover:scale-150 transition-transform duration-300"></div>
                <div className="absolute inset-0 w-4 h-4 bg-[#2d7a52] rounded-full animate-ping opacity-50"></div>
              </div>
              <p className="text-[#195E39] font-bold text-base md:text-lg mb-2">2024</p>
              <p className="text-[#333] font-semibold text-xs md:text-sm">IIT Bombay</p>
            </div>

            {/* 2025 - IIT Roorkee */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-4">
                <div className="w-4 h-4 bg-[#195E39] rounded-full border-4 border-white shadow-lg relative z-10 group-hover:scale-150 transition-transform duration-300"></div>
                <div className="absolute inset-0 w-4 h-4 bg-[#195E39] rounded-full animate-ping opacity-50"></div>
              </div>
              <p className="text-[#195E39] font-bold text-base md:text-lg mb-2">2025</p>
              <p className="text-[#333] font-semibold text-xs md:text-sm">IIT Roorkee</p>
            </div>

            {/* 2025 - NIDAR */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-4">
                <div className="w-4 h-4 bg-[#2d7a52] rounded-full border-4 border-white shadow-lg relative z-10 group-hover:scale-150 transition-transform duration-300"></div>
                <div className="absolute inset-0 w-4 h-4 bg-[#2d7a52] rounded-full animate-ping opacity-50"></div>
              </div>
              <p className="text-[#195E39] font-bold text-base md:text-lg mb-2">2025</p>
              <p className="text-[#333] font-semibold text-xs md:text-sm">NIDAR</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leaders Section */}
      <section className="relative w-full min-h-screen bg-gradient-to-b from-[#e5e5dd] via-[#f5f5f0] to-[#e5e5dd] py-16 md:py-24 font-final">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-[#111] mb-3">
            Meet Our Leaders
          </h2>
          <p className="text-sm md:text-base text-[#666] font-santoshi max-w-2xl mx-auto">
            The visionaries steering Aero Club to new heights
          </p>
        </div>

      {/* Grid of Leaders */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {spotlightItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group"
            >
              <div className="grid grid-cols-1 sm:grid-cols-5">
                {/* Image */}
                <div className="relative h-64 sm:h-auto sm:col-span-2 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                  <div className="absolute inset-0">
                    <Image 
                      src={item.img} 
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Info */}
                <div className="p-6 sm:p-8 sm:col-span-3 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.postColor }}></div>
                    <p 
                      className="text-xs md:text-sm font-semibold uppercase tracking-wide"
                      style={{ color: item.postColor }}
                    >
                      {item.post}
                    </p>
                  </div>
                  
                  <h3 
                    className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight mb-4 group-hover:translate-x-2 transition-transform duration-300"
                    style={{ color: item.nameColor }}
                  >
                    {item.name}
                  </h3>
                  
                  <div className="w-12 h-1 rounded-full transition-all duration-300 group-hover:w-20" style={{ backgroundColor: item.postColor }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Sponsors Section */}
    <section className="relative w-full min-h-[50vh] bg-gradient-to-b from-[#e5e5dd] via-[#f5f5f0] to-[#e5e5dd] py-16 md:py-24 font-final overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#195E39]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#195E39]/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative text-center mb-12 md:mb-16 px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-3 text-[#111]">
          Our Past Sponsors
        </h2>
      </div>

      {/* Sponsors Grid */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Unstop */}
          <div className="flex flex-col items-center justify-center group">
            <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-full shadow-lg flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl border-2 border-[#195E39]/10">
              <div className="w-16 h-16 md:w-18 md:h-18 bg-[#0066CC] rounded-full flex items-center justify-center">
                <span className="text-white font-black text-xs md:text-sm">Unstop</span>
              </div>
            </div>
            <h3 className="text-sm md:text-base font-semibold text-[#333] group-hover:text-[#195E39] transition-colors duration-300">
              Unstop
            </h3>
          </div>

          {/* Polygon */}
          <div className="flex flex-col items-center justify-center group">
            <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-full shadow-lg flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl border-2 border-[#195E39]/10">
              <div className="w-16 h-16 md:w-18 md:h-18 bg-gradient-to-br from-[#8247E5] to-[#A855F7] rounded-full flex items-center justify-center">
                <span className="text-white font-black text-xs md:text-sm">Polygon</span>
              </div>
            </div>
            <h3 className="text-sm md:text-base font-semibold text-[#333] group-hover:text-[#195E39] transition-colors duration-300">
              Polygon
            </h3>
          </div>

          {/* Dassault Systems */}
          <div className="flex flex-col items-center justify-center group">
            <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-full shadow-lg flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl border-2 border-[#195E39]/10">
              <div className="w-16 h-16 md:w-18 md:h-18 bg-[#005A9C] rounded-full flex items-center justify-center">
                <span className="text-white font-black text-xs text-center px-1">Dassault</span>
              </div>
            </div>
            <h3 className="text-sm md:text-base font-semibold text-[#333] group-hover:text-[#195E39] transition-colors duration-300">
              Dassault Systems
            </h3>
          </div>

          {/* EM Works */}
          <div className="flex flex-col items-center justify-center group">
            <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-full shadow-lg flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl border-2 border-[#195E39]/10">
              <div className="w-16 h-16 md:w-18 md:h-18 bg-gradient-to-br from-[#DC2626] to-[#1E40AF] rounded-full flex items-center justify-center">
                <span className="text-white font-black text-xs">EM Works</span>
              </div>
            </div>
            <h3 className="text-sm md:text-base font-semibold text-[#333] group-hover:text-[#195E39] transition-colors duration-300">
              EM Works
            </h3>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default Spotlight;