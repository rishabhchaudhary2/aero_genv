'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

// Types
interface Event {
  id: number;
  name: string;
  coverImage: string;
  images: string[];
}

// Sample event data
const events: Event[] = [
  {
    id: 1,
    name: "TechFest FlyShow 2024",
    coverImage: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1600&h=900&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583792551852-d84a9e9adec3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&h=600&fit=crop"
    ]
  },
  {
    id: 2,
    name: "Glider Challenge 2023",
    coverImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&h=900&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583792551852-d84a9e9adec3?w=800&h=600&fit=crop"
    ]
  },
  {
    id: 3,
    name: "Drone Racing 2022",
    coverImage: "https://images.unsplash.com/photo-1508614999368-9260051292e5?w=1600&h=900&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1508614999368-9260051292e5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=800&h=600&fit=crop"
    ]
  },
  {
    id: 4,
    name: "Workshop on Flight Design",
    coverImage: "https://images.unsplash.com/photo-1583792551852-d84a9e9adec3?w=1600&h=900&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1583792551852-d84a9e9adec3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop"
    ]
  }
];

// Event Section Component
interface EventSectionProps {
  event: Event;
  onViewMore: (event: Event) => void;
}

const EventSection: React.FC<EventSectionProps> = ({ event, onViewMore }) => {
  return (
    <div className="relative w-full h-screen">
      <img 
        src={event.coverImage} 
        alt={event.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
          {event.name}
        </h2>
        <button
          onClick={() => onViewMore(event)}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
        >
          View More
        </button>
      </div>
    </div>
  );
};

// Event Gallery Component
interface EventGalleryProps {
  event: Event;
  onBack: () => void;
}

const EventGallery: React.FC<EventGalleryProps> = ({ event, onBack }) => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Gallery</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <h1 className="text-5xl md:text-7xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          {event.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {event.images.map((img, idx) => (
            <div
              key={idx}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer"
              style={{
                animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`
              }}
            >
              <img
                src={img}
                alt={`${event.name} - Photo ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// Title Screen Component
const TitleScreen: React.FC = () => {
  return (
    <section className="h-screen relative bg-[#0A0A0A] flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated background particles/gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-[#0A0A0A] to-cyan-900/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center px-6">
        <div className="animate-fade-in-up">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 tracking-tight">
            ✈️ Aeromodelling Club
          </h1>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-gray-300 mb-12">
            Gallery
          </h2>
          
          {/* Scroll indicator */}
          <div className="mt-16 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2 mx-auto">
              <div className="w-1.5 h-2 bg-white/50 rounded-full animate-scroll-dot" />
            </div>
            <p className="text-white/50 text-sm mt-4 font-light">Scroll to explore</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main App Component
const AeromodellingGallery: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSections = 1 + events.length; // Title + Events

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | null = null;
    let scrollAccumulator = 0;
    const scrollThreshold = 50;

    const handleWheel = (e: WheelEvent): void => {
      if (isScrolling || selectedEvent) return;

      scrollAccumulator += e.deltaY;

      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      scrollTimeout = setTimeout(() => {
        if (Math.abs(scrollAccumulator) > scrollThreshold) {
          if (scrollAccumulator > 0 && currentSection < totalSections - 1) {
            // Scroll down
            setIsScrolling(true);
            setCurrentSection(prev => prev + 1);
            setTimeout(() => setIsScrolling(false), 1200);
          } else if (scrollAccumulator < 0 && currentSection > 0) {
            // Scroll up
            setIsScrolling(true);
            setCurrentSection(prev => prev - 1);
            setTimeout(() => setIsScrolling(false), 1200);
          }
        }
        scrollAccumulator = 0;
      }, 50);
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [currentSection, isScrolling, selectedEvent, totalSections]);

  const handleViewMore = (event: Event): void => {
    setSelectedEvent(event);
  };

  const handleBack = (): void => {
    setSelectedEvent(null);
  };

  if (selectedEvent) {
    return <EventGallery event={selectedEvent} onBack={handleBack} />;
  }

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden bg-[#0A0A0A]">
      <div
        className="transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateY(-${currentSection * 100}vh)`
        }}
      >
        {/* Title Screen - First Section */}
        <TitleScreen />

        {/* Event Sections */}
        {events.map((event) => (
          <section key={event.id} className="h-screen">
            <EventSection event={event} onViewMore={handleViewMore} />
          </section>
        ))}
      </div>

      {/* Section Indicators */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {Array.from({ length: totalSections }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => !isScrolling && setCurrentSection(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === currentSection ? 'bg-white scale-125' : 'bg-white/30'
            }`}
            aria-label={`Go to section ${idx + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scroll-dot {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(8px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animate-fade-in {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-scroll-dot {
          animation: scroll-dot 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AeromodellingGallery;