'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Nav from '../../components/Nav';

// Types
interface Event {
  id: number;
  name: string;
  coverImage: string;
  images: string[];
}

// Sample event data with mock images
const events: Event[] = [
  {
    "id": 1,
    "name": "Group Photos",
    "coverImage": "https://lh3.googleusercontent.com/d/1xD4UMOQ-JJMDZIJb2GiMN3IlSWV4_m4s",
    "images": [
      "https://lh3.googleusercontent.com/d/1f3I980N-LSB0c_qrs76G84e7e9fNLu7y",
      "https://lh3.googleusercontent.com/d/1vTmJMrJyoQnglw6dKXeEVYBVgVrIHU0f",
      "https://lh3.googleusercontent.com/d/1xD4UMOQ-JJMDZIJb2GiMN3IlSWV4_m4s",
      "https://lh3.googleusercontent.com/d/1rnV8wK-ana6MsPkTy6qSpn-R2_bzBxvQ",
      "https://lh3.googleusercontent.com/d/1j1_0vT9iTeGSpzovBjjri3Ey7KlRMAWi",
      "https://lh3.googleusercontent.com/d/1hFh0VkEk_MgIVeHhb1rjES59ajQEgVKL",
      "https://lh3.googleusercontent.com/d/1Fb503-ULn6BPcZcylCVaChBXomneTCeL",
      "https://lh3.googleusercontent.com/d/121PUuUHwk8qn5srWtaf_mEcXD3X6kCtm",
      "https://lh3.googleusercontent.com/d/1yih5h-ZutVC2geYSwadA3B9yQ7xG5_NA",
      "https://lh3.googleusercontent.com/d/1pvb5PuX4MmPoT8sKyc29jv2kuzVTLpab",
      "https://lh3.googleusercontent.com/d/1_yJW6DjgNE6YTBuGi9XMtRCGt46H1ukk",
      "https://lh3.googleusercontent.com/d/1XfodDSZTIUTf03BDtCiJbgmQgivg3d48",
      "https://lh3.googleusercontent.com/d/1Qa3Y8h7sVhwOh1-pR5GWq4u9geyvdXIV",
      "https://lh3.googleusercontent.com/d/1jkSxw4uSUkjL2rJDEFn942FS97hci1aE",
      "https://lh3.googleusercontent.com/d/1u1K0uaGB1-X4-5weR7OeyRNV011NOJ34",
      "https://lh3.googleusercontent.com/d/1d0fd-I0o5hv-xvEEkICBKxb7DIIqrvIP"
    ]
  },
  {
    "id": 2,
    "name": "Freshers",
    "coverImage": "https://lh3.googleusercontent.com/d/16zYdznpk9oXn9m6jpkF9FKarUDtAfSrD",
    "images": [
      "https://lh3.googleusercontent.com/d/16zYdznpk9oXn9m6jpkF9FKarUDtAfSrD",
      "https://lh3.googleusercontent.com/d/18x0BeWSMlDtCcMwA5FiovyMTHW6hVvpR",
      "https://lh3.googleusercontent.com/d/1DNadrh1bc_c4BZbUjoKpbVAbBjrgDwL_",
      "https://lh3.googleusercontent.com/d/1LeYk8NfVH6TVGrrrS47ymyzdHlBMIglc",
      "https://lh3.googleusercontent.com/d/1RNSiU5ELQnZ_NMFz5vJ9iDEU9U2-UymS",
      "https://lh3.googleusercontent.com/d/1SLLTKGgeDboN-xJ7SRhVRHjmbpNJMa2U",
      "https://lh3.googleusercontent.com/d/1deAHKMJsJ_gCYbzhQ1YD97XyfH_-iQHW",
      "https://lh3.googleusercontent.com/d/1eS-mF1M6ilSNs9M77oEfmLXTVh6XQeh4",
      "https://lh3.googleusercontent.com/d/1qecgLVg0P4uCke5u-GoznjADHdnK8Ffa",
      "https://lh3.googleusercontent.com/d/1v1BUelndQrAXVEY5bWp5hXsiGTE4kzzc"
    ]
  },
  {
    "id": 3,
    "name": "Farewell",
    "coverImage": "https://lh3.googleusercontent.com/d/1dgCgic0KH5WlCYAm2fd9MP2f4xO8qMzg",
    "images": [
      "https://lh3.googleusercontent.com/d/1dgCgic0KH5WlCYAm2fd9MP2f4xO8qMzg",
      "https://lh3.googleusercontent.com/d/1xQiEkEQUCCLhBMIqXm51y6HcFYq_ImD-",
      "https://lh3.googleusercontent.com/d/1EX5hTx1Rvw-o3VxSPyZ1eDR12-d1kYvl",
      "https://lh3.googleusercontent.com/d/1EwO_nao-4IOjbDndopwciXshA4aW9M2P",
      "https://lh3.googleusercontent.com/d/1oardQ-C0LZvHfTILqR6cixDfH2Vk5uvQ",
      "https://lh3.googleusercontent.com/d/1s1L3onoIosSiHRFAc3DRUAewa55XIo5r",
      "https://lh3.googleusercontent.com/d/1jtu0q2rE-CwkYaeoG0VjqnD0iWq-Lbfp",
      "https://lh3.googleusercontent.com/d/1Lm6o2ZDRq8tNcFDFAhsaO4WbEQ9YlvxS",
      "https://lh3.googleusercontent.com/d/1yirgamjbbsWn7ly78dMP9DuFuYgSedM-",
      "https://lh3.googleusercontent.com/d/1II9CQJTCm8BNWluYPmahQ_hXycxvBFtT",
      "https://lh3.googleusercontent.com/d/1dFCpxtbzQk4v6T6xYvnVIaWGbTdQu33f",
      "https://lh3.googleusercontent.com/d/11y2-9PzTQ2SCPJimcNwHy_20eEFt4BQr"
    ]
  },
  {
    "id": 4,
    "name": "RC Plane",
    "coverImage": "https://lh3.googleusercontent.com/d/1T08eK_MhP_K3nd0DzSbty9XoqzxLGeke",
    "images": [
      "https://lh3.googleusercontent.com/d/1T08eK_MhP_K3nd0DzSbty9XoqzxLGeke",
      "https://lh3.googleusercontent.com/d/1gmwaxWej_8kmIRuES27XiMXfzuUO7K_g",
      "https://lh3.googleusercontent.com/d/1Qsun2RfCsKOlh6nCoJ1EQJ7nE0ef6sPR",
      "https://lh3.googleusercontent.com/d/1QOQXhE1o-0WGA9GouPeVhJRHUaizje2Z",
      "https://lh3.googleusercontent.com/d/1Hs4bwKjMu0rh03ukukFA06655RAAJf3Y",
      "https://lh3.googleusercontent.com/d/1olzITW10tj2r6EtzfvHxPxudxhwfBmkv",
      "https://lh3.googleusercontent.com/d/1n3zmV0UdwmfwMuuaKjXplfSsCR5MHXOB",
      "https://lh3.googleusercontent.com/d/1F2pbjimKEBgyJM3zpYSA1pVb7W4G78F4",
      "https://lh3.googleusercontent.com/d/1z1zNiTxHQ23Up53sgh67C0hHeetHVlxw",
      "https://lh3.googleusercontent.com/d/17YvWPkRzqioz3m5g51xFFrMGi8iZe4EX",
      "https://lh3.googleusercontent.com/d/1uvw_BHTgMlp1nJFS9PhwWw4M3PM-QnTb",
      "https://lh3.googleusercontent.com/d/1QmoYtWsFm0Ej8rgKSzJW5V1Q-o5oxyrS",
      "https://lh3.googleusercontent.com/d/1bWntdD_EEg5EAm0MJIKFtjXPD_ahO9o5",
      "https://lh3.googleusercontent.com/d/1nFPd98_OHZ-Ke7fBEbsDj1nAfEGOlmSo",
      "https://lh3.googleusercontent.com/d/1nFPd98_OHZ-Ke7fBEbsDj1nAfEGOlmSo"
    ]
  },
  {
    "id": 5,
    "name": "Techspardha",
    "coverImage": "https://lh3.googleusercontent.com/d/1eohdZYgLAAZlMnzROk0cyOTQb9aEXJ2D",
    "images": [
      "https://lh3.googleusercontent.com/d/1eohdZYgLAAZlMnzROk0cyOTQb9aEXJ2D",
      "https://lh3.googleusercontent.com/d/1Hn3BvXHV_OHeRZqHciLUQZ2gAO9E6kmr",
      "https://lh3.googleusercontent.com/d/1v6m7FHDakj8FCmZalprw9l2QEnNHcI5E",
      "https://lh3.googleusercontent.com/d/1sFS5oc7NDalCU2DL6Zs6LuD7iA5nLC4v",
      "https://lh3.googleusercontent.com/d/1WaGTITq0ilFc9QHzHXrOiJkxkdcYp85Y",
      "https://lh3.googleusercontent.com/d/1eN1yTDkKQdOVYGHJpMKDLEIvUMqD5-Zw",
      "https://lh3.googleusercontent.com/d/1JuAtnQUZhP3qKM1fKzNC7BGDk7F_p-lz"
    ]
  }
]




// Event Section Component
interface EventSectionProps {
  event: Event;
  onViewMore: (event: Event) => void;
}

const EventSection: React.FC<EventSectionProps> = ({ event, onViewMore }) => {
  return (
    <div className="relative w-full h-screen"> 
      <Image
        src={event.coverImage}
        fill
        priority
        alt={event.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#111]/90 via-[#111]/40 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
        <h2 className="text-4xl md:text-6xl font-bold text-[#e5e5dd] mb-6 animate-fade-in uppercase tracking-wider">
          {event.name}
        </h2>
        <button
          onClick={() => onViewMore(event)}
          className="px-8 py-3 border-2 border-[#e5e5dd] text-[#e5e5dd] font-semibold uppercase tracking-wider hover:bg-[#e5e5dd] hover:text-[#111] transition-all duration-300 group"
        >
          View More
          <span className="inline-block ml-2 transition-transform group-hover:translate-x-2">→</span>
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
    <div className="min-h-screen bg-[#e5e5dd] text-[#111]">
      <div className="sticky top-0 z-50 bg-[#e5e5dd]/95 backdrop-blur-sm border-b-2 border-[#111]">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#111] hover:opacity-70 transition-opacity uppercase tracking-wider font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Gallery</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-center uppercase tracking-wider">
          {event.name}
        </h1>
        <div className="w-32 h-1 bg-[#111] mx-auto mb-12"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {event.images.map((img, idx) => (
            <div
              key={idx}
              className="group relative aspect-[4/3] overflow-hidden cursor-pointer"
              style={{
                animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`
              }}
            >
              <Image
                src={img}
                fill
                alt={`${event.name} - Photo ${idx + 1}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#111] transition-all duration-300" />
              <div className="absolute inset-0 bg-[#111]/0 group-hover:bg-[#111]/10 transition-all duration-300" />
              
              {/* Photo number */}
              <div className="absolute top-4 right-4 w-10 h-10 border-2 border-[#e5e5dd] flex items-center justify-center text-[#e5e5dd] text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#111]">
                {idx + 1}
              </div>
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
    <section className="h-screen relative bg-[#e5e5dd] flex items-center justify-center overflow-hidden">
      <Nav/>
      <div className="absolute inset-0">
        {/* Rotating circles */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute border-2 border-[#111] opacity-10"
            style={{
              width: `${300 + i * 150}px`,
              height: `${300 + i * 150}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              animation: `rotate ${25 + i * 10}s linear infinite`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-6">
        <div className="animate-fade-in-up">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-[#111] mb-6 tracking-tight uppercase">
            ✈️ Aeromodelling Club
          </h1>
          <div className="w-32 h-1 bg-[#111] mx-auto mb-8"></div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-[#111] mb-12 uppercase tracking-widest">
            Gallery
          </h2>
          
          {/* Scroll indicator */}
          <div className="mt-16 animate-bounce">
            <div className="w-6 h-10 border-2 border-[#111] rounded-full flex items-start justify-center p-2 mx-auto">
              <div className="w-1.5 h-2 bg-[#111] rounded-full animate-scroll-dot" />
            </div>
            <p className="text-[#111] opacity-60 text-sm mt-4 font-light uppercase tracking-wider">Scroll to explore</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

// Main App Component
const AeromodellingGallery: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);

  const totalSections = 1 + events.length;

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
            setIsScrolling(true);
            setCurrentSection(prev => prev + 1);
            setTimeout(() => setIsScrolling(false), 1200);
          } else if (scrollAccumulator < 0 && currentSection > 0) {
            setIsScrolling(true);
            setCurrentSection(prev => prev - 1);
            setTimeout(() => setIsScrolling(false), 1200);
          }
        }
        scrollAccumulator = 0;
      }, 50);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isScrolling || selectedEvent) return;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY.current || isScrolling || selectedEvent) return;

      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;
      const swipeThreshold = 50;

      if (Math.abs(deltaY) > swipeThreshold) {
        if (deltaY > 0 && currentSection < totalSections - 1) {
          setIsScrolling(true);
          setCurrentSection(prev => prev + 1);
          setTimeout(() => setIsScrolling(false), 1200);
        } else if (deltaY < 0 && currentSection > 0) {
          setIsScrolling(true);
          setCurrentSection(prev => prev - 1);
          setTimeout(() => setIsScrolling(false), 1200);
        }
        touchStartY.current = null;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
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
    <>
      <Nav />
   
    <div ref={containerRef} className="relative h-screen overflow-hidden bg-[#e5e5dd]">
      <div
        className="transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateY(-${currentSection * 100}vh)`
        }}
      >
        <TitleScreen />

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
            className={`relative transition-all duration-300 ${
              idx === currentSection ? 'w-3 h-3' : 'w-2 h-2'
            }`}
            aria-label={`Go to section ${idx + 1}`}
          >
            <div className={`w-full h-full rounded-full bg-[#111] transition-all duration-300 ${
              idx === currentSection ? 'scale-100' : 'opacity-30 scale-75 hover:scale-100 hover:opacity-60'
            }`}/>
            {idx === currentSection && (
              <div className="absolute inset-0 rounded-full bg-[#111] animate-ping"/>
            )}
          </button>
        ))}
      </div>

      {/* Panel counter */}
      <div className="fixed top-8 left-8 z-50 font-mono text-sm text-[#111]">
        <div className="relative">
          <span className="block font-bold">{String(currentSection).padStart(2, '0')}</span>
          <span className="absolute top-0 left-0 opacity-30" style={{ transform: 'translate(1px, 1px)' }}>
            {String(currentSection).padStart(2, '0')}
          </span>
        </div>
        <div className="w-12 h-px bg-[#111] mt-2"/>
        <span className="block mt-1 text-xs opacity-50">{String(totalSections - 1).padStart(2, '0')}</span>
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
    </>
  );
};

export default AeromodellingGallery;