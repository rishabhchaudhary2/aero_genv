'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const spotlightItems = [
  { name: "Welcome to Post Holders Intro", img: "/galleryimages/1.jpg", nameColor: "#000", postColor: "#444", bgColor: "#E5E5DD" },
  { name: "Priyanshu Soni", img: "/galleryimages/President.jpg", post: "President", nameColor: "#ff4d4d", postColor: "#ff9999", bgColor: "#ffe6e6" },
  { name: "Omkar Dua", img: "/galleryimages/Vice_President.jpg", post: "Vice President", nameColor: "#4d79ff", postColor: "#99b3ff", bgColor: "#e6ecff" },
  { name: "Jay Kumar Gupta", img: "/galleryimages/Secretary.png", post: "Secretary", nameColor: "#33cc33", postColor: "#99ff99", bgColor: "#e6ffe6" },
  { name: "Harsh Raj", img: "/galleryimages/Joint_Secretary.jpg", post: "Joint Secretary", nameColor: "#ff9900", postColor: "#ffd699", bgColor: "#fff2e6" },
  { name: "Hiphop", img: "/galleryimages/6.jpg", nameColor: "#aa33ff", postColor: "#d699ff", bgColor: "#f0e6ff" }
];

const Spotlight: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [bgImgSrc, setBgImgSrc] = useState(spotlightItems[0].img);
  const [bgColor, setBgColor] = useState(spotlightItems[0].bgColor);

  const titlesContainerRef = useRef<HTMLDivElement | null>(null);
  const titlesContainerElementRef = useRef<HTMLDivElement | null>(null);
  const imagesContainerRef = useRef<HTMLDivElement | null>(null);
  const spotlightHeaderRef = useRef<HTMLDivElement | null>(null);
  const spotlightBgImgRef = useRef<HTMLDivElement | null>(null);
  const introTextElementsRef = useRef<Array<HTMLDivElement | null>>([]);
  const imageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const titleRefs = useRef<Array<HTMLHeadingElement | null>>([]);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const totalItems = spotlightItems.length;
  const config = { gap: 0.8 / totalItems, speed: 0.3, arcRadius: 500 };

  useEffect(() => setMounted(true), []);

  const setIntroTextRef = (el: HTMLDivElement | null, i: number) => {
    introTextElementsRef.current[i] = el;
  };

  useLayoutEffect(() => {
    if (!mounted) return;

    const lenis = new Lenis();
    lenisRef.current = lenis;
    const rafCallback = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    if (!titlesContainerRef.current || !imagesContainerRef.current) return;

    let currentActiveIndex = 0;

    const getBezierPosition = (t: number) => {
      const containerWidth = window.innerWidth * 0.3;
      const containerHeight = window.innerHeight;
      const arcStartX = containerWidth - 220;
      const arcStartY = -200;
      const arcEndY = containerHeight + 200;
      const arcControlX = arcStartX + config.arcRadius;
      const arcControlY = containerHeight / 2;
      const x = (1 - t) * (1 - t) * arcStartX + 2 * (1 - t) * t * arcControlX + t * t * arcStartX;
      const y = (1 - t) * (1 - t) * arcStartY + 2 * (1 - t) * t * arcControlY + t * t * arcEndY;
      return { x, y };
    };

    const getImgProgressState = (index: number, overallProgress: number) => {
      const startTime = index * config.gap;
      const endTime = startTime + config.speed;
      if (overallProgress < startTime) return -1;
      if (overallProgress > endTime) return 2;
      return (overallProgress - startTime) / config.speed;
    };

    imageRefs.current.forEach(img => img && gsap.set(img, { opacity: 0 }));

    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: ".spotlight",
      start: "top top",
      end: `+=${window.innerHeight * (3 + totalItems / 2)}`,
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        // ---- Intro animation ----
        if (progress <= 0.2) {
          const animProgress = progress / 0.2;
          if (spotlightBgImgRef.current) gsap.set(spotlightBgImgRef.current, { scale: animProgress });
          if (imageRefs.current[0]) {
            gsap.set(imageRefs.current[0], {
              y: -animProgress * 150,
              scale: 0.5 + animProgress * 0.5,
              opacity: animProgress
            });
          }
          introTextElementsRef.current.forEach((el, i) => {
            if (!el) return;
            gsap.set(el, { x: (i === 0 ? -1 : 1) * animProgress * window.innerWidth * 0.6, opacity: 1 });
          });
        }

        // ---- Bézier arc animation for other images ----
        if (progress > 0.25 && progress <= 0.95) {
          const switchProgress = (progress - 0.25) / 0.7;
          const viewportHeight = window.innerHeight;
          const titlesHeight = titlesContainerRef.current?.scrollHeight || 0;
          const startY = viewportHeight;
          const targetY = -titlesHeight;
          const totalDist = startY - targetY;
          const currentY = startY - switchProgress * totalDist;
          if (titlesContainerRef.current) gsap.set(titlesContainerRef.current, { y: currentY });

          imageRefs.current.forEach((img, idx) => {
            if (!img) return;
            if (idx === 0) return;
            const imgProgress = getImgProgressState(idx, switchProgress);
            if (imgProgress < 0 || imgProgress > 1) gsap.set(img, { opacity: 0 });
            else {
              const pos = getBezierPosition(imgProgress);
              gsap.set(img, { x: pos.x - 100, y: pos.y - 75, opacity: 1 });
            }
          });

          const mid = viewportHeight / 2;
          let closestIndex = 0;
          let closestDist = Infinity;
          titleRefs.current.forEach((title, i) => {
            if (!title) return;
            const rect = title.getBoundingClientRect();
            const center = rect.top + rect.height / 2;
            const dist = Math.abs(center - mid);
            if (dist < closestDist) {
              closestDist = dist;
              closestIndex = i;
            }
          });

          if (closestIndex !== currentActiveIndex) {
            if (titleRefs.current[currentActiveIndex]) titleRefs.current[currentActiveIndex]!.style.opacity = "0.25";
            if (titleRefs.current[closestIndex]) titleRefs.current[closestIndex]!.style.opacity = "1";
            const img = new window.Image();
            img.src = spotlightItems[closestIndex].img;
            img.onload = () => {
              setBgImgSrc(spotlightItems[closestIndex].img);
              setBgColor(spotlightItems[closestIndex].bgColor);
            };
            currentActiveIndex = closestIndex;
          }
        }

        // ---- Header & triangular lines visibility (fixed for scroll up) ----
        if (progress > 0.2 && progress <= 0.95) {
          if (spotlightHeaderRef.current) spotlightHeaderRef.current.style.opacity = "1";
          if (titlesContainerElementRef.current) {
            titlesContainerElementRef.current.style.setProperty("--before-opacity", "1");
            titlesContainerElementRef.current.style.setProperty("--after-opacity", "1");
          }
        } else {
          if (spotlightHeaderRef.current) spotlightHeaderRef.current.style.opacity = "0";
          if (titlesContainerElementRef.current) {
            titlesContainerElementRef.current.style.setProperty("--before-opacity", "0");
            titlesContainerElementRef.current.style.setProperty("--after-opacity", "0");
          }
        }
      },
    });

    return () => {
      gsap.killTweensOf("*");
      scrollTriggerRef.current?.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
      lenisRef.current?.destroy();
      gsap.ticker.remove(rafCallback);
      imageRefs.current = [];
      titleRefs.current = [];
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <section className="spotlight relative w-screen h-[100svh] overflow-hidden font-santoshi" style={{ height: "100svh", backgroundColor: bgColor }}>
      {/* Intro text */}
      <div className="spotlight-intro-text-wrapper absolute w-full top-1/2 -translate-y-1/2 flex gap-2">
        <div className="flex-1 relative will-change-transform flex justify-end" ref={el => setIntroTextRef(el, 0)}>
          <p className="text-[1.5rem] font-medium leading-none">Post</p>
        </div>
        <div className="flex-1 relative will-change-transform" ref={el => setIntroTextRef(el, 1)}>
          <p className="text-[1.5rem] font-medium leading-none">Holders</p>
        </div>
      </div>

      {/* Background image */}
      <div className="spotlight-bg-img absolute w-full h-full overflow-hidden will-change-transform z-0" ref={spotlightBgImgRef}>
        <Image src={bgImgSrc} alt="Background" fill sizes="100vw" quality={100} className="w-full h-full object-contain"/>
      </div>

      {/* Titles container with triangular lines */}
      <div className="spotlight-titles-container uppercase font-bold text-[4rem] absolute top-0 left-[15vw] w-full h-full overflow-hidden" ref={titlesContainerElementRef} style={{ "--before-opacity": 0, "--after-opacity": 0 } as React.CSSProperties}>
        <style>{`
          .spotlight-titles-container::before,
          .spotlight-titles-container::after {
            content: "";
            position: absolute;
            width: 100svh;
            height: 2.5px;
            background: #fff;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 10;
          }
          .spotlight-titles-container::before {
            top: 0;
            left: 0;
            transform: rotate(-45deg) translate(-7rem);
            opacity: var(--before-opacity);
          }
          .spotlight-titles-container::after {
            bottom: 0;
            left: 0;
            transform: rotate(45deg) translate(-7rem);
            opacity: var(--after-opacity);
          }
        `}</style>

        <div className="spotlight-titles relative left-[15%] w-[75%] h-full flex flex-col gap-20 translate-y-full z-20" ref={titlesContainerRef}>
          {spotlightItems.map((item, idx) => (
            <div key={idx}>
              <h1 ref={el => { if (el) titleRefs.current[idx] = el; }} style={{ opacity: idx === 0 ? 1 : 0.25, color: item.nameColor }}>{item.name}</h1>
              {item.post && <p style={{ color: item.postColor, fontSize: "1rem", marginTop: "0.5rem" }}>{item.post}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="spotlight-images absolute top-0 left-0 w-1/2 min-w-[300px] h-full pointer-events-none z-10" ref={imagesContainerRef}>
        {spotlightItems.map((item, idx) => (
          <div key={idx} className="spotlight-img absolute md:right-[-10%] w-[200px] h-[150px] will-change-transform" ref={el => { if (el) imageRefs.current[idx] = el; }} style={{ opacity: 0 }}>
            <Image src={item.img} alt={item.name} fill sizes="(max-width: 768px) 100vw, 200px" className="w-full h-full object-cover"/>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="spotlight-header absolute top-1/2 left-[10%] -translate-y-1/2 text-black transition-opacity duration-300 opacity-0 z-20" ref={spotlightHeaderRef}>
        <p className="text-[1.5rem] font-medium leading-none">Meet the Post Holders</p>
      </div>
    </section>
  );
};

export default Spotlight;
