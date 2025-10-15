'use client';

import { useState, useRef, useEffect } from 'react';
import Nav from '../../components/Nav';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const GalleryPage = () => {
  const [activeAlbum, setActiveAlbum] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [currentRotation, setCurrentRotation] = useState<number>(0);
  const circleRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number | null>(null);
  
  const albums = [
    {
      name: "Dronewebfiesta",
      date: "8/26/2024",
      author: "Jay Kumar Gupta",
      description: "Puzzles in the Air, Minds Engaged!!",
      coverImage: "/galleryimages/dronewebfiesta.jpg"
    },
    {
      name: "Aero Farewell: Skyward Departures",
      date: "8/26/2024",
      author: "Jay Kumar Gupta",
      description: "Wings of goodbye and a sky full of memories...",
      coverImage: "/galleryimages/farewell.jpg"
    },
    {
      name: "Wings of Beginnings: Aero Freshers' 2024",
      date: "8/26/2024",
      author: "Jay Kumar Gupta",
      description: "Photos of freshers' journey at Hotel Maan",
      coverImage: "/galleryimages/freshers.jpg"
    },
    {
      name: "Highsky '23",
      date: "8/26/2024",
      author: "Jay Kumar Gupta",
      description: "HighSky Giggles....",
      coverImage: "/galleryimages/highsky.jpg"
    }
  ];
  
  // Time in milliseconds to stay on each album
  const sectionDuration = 1000;
  
  // Auto-rotate between albums
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;
    let progressValue = 0;
    
    if (!isPaused && !isRotating) {
      // Main interval for changing albums
      interval = setInterval(() => {
        const nextAlbum = (activeAlbum + 1) % albums.length;
        rotateToAlbum(nextAlbum);
        progressValue = 0;
      }, sectionDuration);
      
      // Progress indicator update interval
      progressInterval = setInterval(() => {
        progressValue += (50 / sectionDuration) * 100;
        setProgress(Math.min(progressValue, 100));
      }, 50);
    }
    
    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [activeAlbum, isPaused, isRotating, albums.length]);
  
  // Add touch support for mobile
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartRef.current === null || isRotating) return;
      
      const touchEnd = e.changedTouches[0].clientX;
      const diff = touchStartRef.current - touchEnd;
      
      if (Math.abs(diff) > 50) {
        setIsPaused(true);
        if (diff > 0) {
          // Swipe left - next album
          rotateToAlbum((activeAlbum + 1) % albums.length);
        } else {
          // Swipe right - previous album
          rotateToAlbum((activeAlbum - 1 + albums.length) % albums.length);
        }
        
        setTimeout(() => {
          setIsPaused(false);
        }, 5000);
      }
      
      touchStartRef.current = null;
    };
    
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeAlbum, albums.length, isRotating]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isRotating) return;
      
      if (e.key === 'ArrowRight') {
        setIsPaused(true);
        rotateToAlbum((activeAlbum + 1) % albums.length);
        setTimeout(() => setIsPaused(false), 5000);
      } else if (e.key === 'ArrowLeft') {
        setIsPaused(true);
        rotateToAlbum((activeAlbum - 1 + albums.length) % albums.length);
        setTimeout(() => setIsPaused(false), 5000);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeAlbum, albums.length, isRotating]);
  
  // Handle wheel events for manual rotation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isRotating) return;
      
      setIsPaused(true);
      
      if (e.deltaY > 0) {
        rotateToAlbum((activeAlbum + 1) % albums.length);
      } else {
        rotateToAlbum((activeAlbum - 1 + albums.length) % albums.length);
      }
      
      // Resume auto-rotation after inactivity
      const resumeTimer = setTimeout(() => {
        setIsPaused(false);
      }, 5000);
      
      return () => clearTimeout(resumeTimer);
    };
    
    document.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, [activeAlbum, albums.length, isRotating]);
  
  // Improved rotation function
  const rotateToAlbum = (index: number) => {
    if (isRotating || index === activeAlbum) return;
    
    setIsRotating(true);
    
    // Calculate the shortest direction to rotate
    const anglePer = 360 / albums.length;
    const targetAngle = index * anglePer;
    
    // Find absolute angular difference, then determine shortest path
    let angleDiff = ((targetAngle - currentRotation) % 360 + 360) % 360;
    if (angleDiff > 180) angleDiff -= 360;
    
    // Calculate new absolute rotation
    const newRotation = currentRotation + angleDiff;
    setCurrentRotation(newRotation);
    
    // Apply the rotation to the circle container
    if (circleRef.current) {
      circleRef.current.style.transition = 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
      circleRef.current.style.transform = `translate(-50%, -50%) rotate(${newRotation}deg)`;
    }
    
    // Update active album and reset rotation state after animation
    const transitionDuration = 1000; // 1000ms = 1s
    setTimeout(() => {
      setActiveAlbum(index);
      setIsRotating(false);
    }, transitionDuration);
  };
  
  // Detect if we're on a small screen
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 768;
  
  return (
    <div className="min-h-screen bg-[#e5e5dd] text-black overflow-hidden">
      <Nav />
      
      {/* Page Title with consistent styling */}
      <div className="fixed top-24 left-0 w-full text-center z-30">
        <h1 className="text-3xl md:text-5xl font-bold tracking-wider uppercase mb-2">
          Photos And Videos Albums
        </h1>
        <div className="w-24 h-1 bg-black mx-auto"></div>
      </div>
      
      {/* Circular Gallery */}
      <div className="w-full h-screen relative flex items-center justify-center">
        {/* Current album details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeAlbum}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="z-30 absolute max-w-lg w-full px-6 md:px-0"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-wide text-center">
              {albums[activeAlbum].name}
            </h2>
            <div className="flex justify-center gap-6 mb-6 text-sm text-gray-600 font-light">
              <span>{albums[activeAlbum].date}</span>
              <span>By {albums[activeAlbum].author}</span>
            </div>
            <p className="text-lg mb-8 font-light leading-relaxed text-center">
              {albums[activeAlbum].description}
            </p>
            <div className="flex justify-center">
              <Link 
                href={`/gallery/${encodeURIComponent(albums[activeAlbum].name.toLowerCase().replace(/\s+/g, '-'))}`} 
                className="border border-black px-6 py-2 text-lg font-medium tracking-wider hover:bg-black hover:text-[#e5e5dd] transition-colors"
              >
                Explore
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Circular album covers - For larger screens */}
        {!isSmallScreen && (
          <div
            ref={circleRef}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vmin] h-[80vmin]"
          >
            {albums.map((album, index) => {
              // Calculate position on the circle
              const angle = (index * (360 / albums.length));
              const radius = 35; // in vmin units
              const x = radius * Math.cos((angle - 90) * (Math.PI / 180));
              const y = radius * Math.sin((angle - 90) * (Math.PI / 180));
              
              return (
                <motion.div
                  key={index}
                  className="absolute w-[20vmin] h-[15vmin] shadow-lg overflow-hidden cursor-pointer"
                  style={{
                    left: `calc(50% + ${x}vmin)`,
                    top: `calc(50% + ${y}vmin)`,
                    transform: `translate(-50%, -50%) rotate(${-currentRotation}deg)`,
                    zIndex: activeAlbum === index ? 20 : 10,
                  }}
                  animate={{
                    scale: activeAlbum === index ? 1.2 : 1,
                  }}
                  transition={{
                    scale: { duration: 0.3 }
                  }}
                  onClick={() => rotateToAlbum(index)}
                >
                  <div className="w-full h-full relative">
                    <Image
                      src={album.coverImage}
                      alt={album.name}
                      fill
                      sizes="(max-width: 768px) 80vw, 20vmin"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/galleryimages/placeholder.jpg";
                        (e.target as HTMLImageElement).onerror = null; // Prevent infinite loop
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white text-sm font-bold px-3 py-1 border border-white rounded">
                        Select
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Alternative horizontal layout for small screens */}
        {isSmallScreen && (
          <div className="absolute bottom-32 left-0 w-full px-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 pb-4 justify-start">
              {albums.map((album, index) => (
                <motion.div
                  key={index}
                  className={`flex-shrink-0 w-32 h-24 rounded-lg shadow-lg overflow-hidden cursor-pointer border-2 ${activeAlbum === index ? 'border-black' : 'border-transparent'}`}
                  animate={{
                    scale: activeAlbum === index ? 1.1 : 1,
                  }}
                  onClick={() => {
                    setIsPaused(true);
                    setActiveAlbum(index);
                    setTimeout(() => setIsPaused(false), 5000);
                  }}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={album.coverImage}
                      alt={album.name}
                      fill
                      sizes="128px"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/galleryimages/placeholder.jpg";
                        (e.target as HTMLImageElement).onerror = null;
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Section Indicators and Controls */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex space-x-6">
        {albums.map((album, index) => (
          <div key={index} className="flex flex-col items-center">
            <button
              className="w-8 h-8 flex items-center justify-center focus:outline-none"
              onClick={() => {
                if (!isRotating) {
                  setIsPaused(true);
                  rotateToAlbum(index);
                  setTimeout(() => setIsPaused(false), 5000);
                }
              }}
              aria-label={`View ${album.name} album`}
              aria-current={activeAlbum === index ? "true" : "false"}
              disabled={isRotating}
            >
              <div 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeAlbum === index ? 'bg-black scale-150' : 'bg-gray-400'
                }`}
              ></div>
            </button>
            {activeAlbum === index && (
              <div className="w-10 h-0.5 bg-gray-300 relative">
                <motion.div 
                  className="h-full bg-black absolute top-0 left-0"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              </div>
            )}
          </div>
        ))}
        
        {/* Navigation Controls */}
        <div className="flex space-x-2 ml-4">
          {/* Previous Button */}
          <button 
            onClick={() => {
              if (!isRotating) {
                setIsPaused(true);
                rotateToAlbum((activeAlbum - 1 + albums.length) % albums.length);
                setTimeout(() => setIsPaused(false), 5000);
              }
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-black hover:bg-black hover:text-white transition-colors"
            aria-label="Previous album"
            disabled={isRotating}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          
          {/* Play/Pause Button */}
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-black hover:bg-black hover:text-white transition-colors"
            aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
          >
            {isPaused ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            )}
          </button>
          
          {/* Next Button */}
          <button 
            onClick={() => {
              if (!isRotating) {
                setIsPaused(true);
                rotateToAlbum((activeAlbum + 1) % albums.length);
                setTimeout(() => setIsPaused(false), 5000);
              }
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-black hover:bg-black hover:text-white transition-colors"
            aria-label="Next album"
            disabled={isRotating}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Background circle decoration */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vmin] h-[80vmin] border border-gray-300 rounded-full z-0 opacity-40"></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[65vmin] h-[65vmin] border border-gray-300 rounded-full z-0 opacity-25"></div>
      
      <style jsx global>{`
        body {
          overflow: hidden;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default GalleryPage;