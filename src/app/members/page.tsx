'use client';

import { useRef, useEffect, useState } from 'react';
import Nav from '../../components/Nav';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface TeamMember {
  name: string;
  role: string;
  email: string;
  rollNo: string;
  batch: string;
  branch: string;
  image: string;
  subDomain?: string;
  timestamp?: string;
}

// Dummy data as fallback (outside component to avoid re-creating on each render)
const dummyMembers: TeamMember[] = [
  {
    name: "Rajesh Kumar",
    role: "Team Lead",
    email: "rajesh.kumar@example.com",
    rollNo: "123104001",
    batch: "2025",
    branch: "Mechanical",
    image: "/galleryimages/1.jpg"
  },
  {
    name: "Priya Sharma",
    role: "Technical Head",
    email: "priya.sharma@example.com",
    rollNo: "123104002",
    batch: "2025",
    branch: "Electrical",
    image: "/galleryimages/2.jpg"
  },
  {
    name: "Amit Patel",
    role: "Design Lead",
    email: "amit.patel@example.com",
    rollNo: "123104003",
    batch: "2026",
    branch: "Mechanical",
    image: "/galleryimages/3.jpg"
  },
  {
    name: "Sneha Reddy",
    role: "Electronics Head",
    email: "sneha.reddy@example.com",
    rollNo: "123104004",
    batch: "2027",
    branch: "Electronics",
    image: "/galleryimages/4.jpg"
  },
];

const MembersPage = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Fetch team members from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        // Update this URL to your backend URL
        const response = await fetch(API_URL + '/api/members');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTeamMembers(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching members:', err);
        setError(err instanceof Error ? err.message : 'Failed to load team members');
        // Keep using dummy data if API fails
        setTeamMembers(dummyMembers);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Group members by year of graduation (batch)
  const groupedMembers = teamMembers.reduce((groups: Record<string, TeamMember[]>, member) => {
    const year = member.batch || 'Unknown';
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(member);
    return groups;
  }, {});

  // Sort years in ascending order (earliest graduation year first)
  const sortedYears = Object.keys(groupedMembers).sort((a, b) => {
    if (a === 'Unknown') return 1;
    if (b === 'Unknown') return -1;
    return a.localeCompare(b);
  });

  // Capture wheel events from anywhere on the page and redirect to scroll container
  useEffect(() => {
    const handlePageWheel = (e: WheelEvent) => {
      if (scrollContainerRef.current) {
        e.preventDefault();
        scrollContainerRef.current.scrollTop += e.deltaY;
      }
    };

    window.addEventListener('wheel', handlePageWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handlePageWheel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#e5e5dd] text-black overflow-hidden">
      <Nav />
      {/* Main Container */}
      <div className="w-full h-screen">
        {/* Team Section */}
        <section className="w-full h-screen flex flex-col relative px-4 sm:px-8 md:px-12 lg:px-20">
          <div className="absolute top-10 md:top-20 left-6 bottom-5 md:left-12 text-[4rem] md:text-[8rem] font-bold opacity-10">TEAM</div>
          <div className="w-full max-w-[1400px] mx-auto h-full pt-20 md:pt-24">
            <motion.div
              className="flex items-center justify-between mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold uppercase tracking-wider">
                Our Team
              </h2>

              {/* Optional: Show member count */}
              {!loading && (
                <span className="text-sm md:text-base text-gray-600">
                  {teamMembers.length} members
                </span>
              )}
            </motion.div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded text-sm">
                ⚠️ {error} - Showing sample data
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="h-[calc(100vh-200px)] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading team members...</p>
                </div>
              </div>
            ) : (
              <div
                ref={scrollContainerRef}
                className="h-[calc(100vh-200px)] overflow-y-auto pr-2 md:pr-4 custom-scrollbar"
              >
                {sortedYears.map((year) => (
                  <div key={year} className="mb-12">
                    {/* Year Heading */}
                    <motion.h3
                      className="text-xl sm:text-2xl md:text-3xl font-bold uppercase mb-6 tracking-wide border-b-2 border-black pb-2"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                    >
                      Batch of {year}
                    </motion.h3>

                    {/* Members Grid for this year */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                      {groupedMembers[year].map((member: TeamMember, index: number) => (
                        <motion.div
                          key={`${year}-${index}`}
                          className="relative group mx-auto w-full max-w-sm"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <div className="relative w-full aspect-3/4 overflow-hidden rounded-lg bg-gray-900 shadow-lg">
                            <Image
                              src={member.image || '/galleryimages/1.jpg'}
                              alt={member.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 sm:p-6">
                              <div className="flex justify-end space-x-3 sm:space-x-4">
                                <a href={`mailto:${member.email}`} className="text-white hover:text-gray-200">
                                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                  </svg>
                                </a>
                              </div>
                              <div className="text-white">
                                <p className="text-xs sm:text-sm">{member.branch}</p>
                                {member.subDomain && (
                                  <p className="text-xs sm:text-sm mt-1 opacity-80">{member.subDomain}</p>
                                )}
                              </div>
                            </div>
                          </div>
                          {/* Name and Role - Always visible */}
                          <div className="mt-3 sm:mt-4">
                            <h3 className="text-base sm:text-lg font-bold tracking-wide">{member.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">{member.role}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
        body {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default MembersPage;
