'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const workshopsData = [
  {

    title: 'Aero Vicks',
    description:
      'Learn the principles of aerodynamics and build your own glider from scratch. This workshop covers everything from airfoil design to construction techniques using balsa wood and foam.',
    images: ['/galleryimages/1.jpg', '/galleryimages/2.jpg', '/galleryimages/3.jpg'],
  },
  {
    title: 'Skyforge 1.0',
    description:
      'Dive into the fast-paced world of FPV (First-Person View) drone racing. Assemble your own racing drone, learn to fly, and compete against fellow enthusiasts on a custom-designed track.',
    images: ['/galleryimages/4.jpg', '/galleryimages/5.jpg', '/galleryimages/6.jpg'],
  },
  {

    title: 'Skyforge 2.0',
    description:
      'Explore the electronics that power modern aircraft. This workshop focuses on programming flight controllers, setting up GPS modules, and implementing autonomous flight missions.',
    images: ['/galleryimages/7.jpg', '/galleryimages/8.jpg', '/galleryimages/9.jpg'],
  }
];

const Workshops = () => {

  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.panel');
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${(panels.length - 1) * window.innerHeight}`,
        pin: true,
        scrub: 1,
        snap: {
          snapTo: 1 / (panels.length - 1),
          duration: 0.5,
          ease: 'power1.inOut',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-[#e5e5dd] text-[#111]">
      {/* Intro Panel */}
      <section className="panel h-screen flex flex-col justify-center items-center text-center p-8">
        <h1 className="text-5xl md:text-7xl font-bold font-final uppercase tracking-wider">
          Workshops
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto font-santoshi">
          From foundational principles to advanced applications, our workshops are designed to
          equip you with the skills and knowledge to excel in the world of aerospace.
        </p>
      </section>

      {/* Workshop Panels */}
      {workshopsData.map((workshop, index) => (
        <section
          key={index}
          className="panel h-screen w-screen flex items-center justify-center p-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full max-w-7xl">
            {/* Text content - alternate order */}
            <div className={`flex flex-col justify-center ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 font-final uppercase">
                {workshop.title}
              </h2>
              <p className="text-lg md:text-xl font-santoshi leading-relaxed">
                {workshop.description}
              </p>
            </div>

            {/* Image gallery - alternate order */}
            <div className={`relative grid grid-cols-2 grid-rows-2 gap-4 h-96 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
              <div className="relative col-span-1 row-span-2">
                <Image
                  src={workshop.images[0]}
                  alt={`${workshop.title} image 1`}
                  fill
                  className="object-cover rounded-lg shadow-lg"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
              <div className="relative col-span-1 row-span-1">
                <Image
                  src={workshop.images[1]}
                  alt={`${workshop.title} image 2`}
                  fill
                  className="object-cover rounded-lg shadow-lg"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
              <div className="relative col-span-1 row-span-1">
                <Image
                  src={workshop.images[2]}
                  alt={`${workshop.title} image 3`}
                  fill
                  className="object-cover rounded-lg shadow-lg"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Workshops;
      
       