'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IconType } from 'react-icons';
import {
  FaFacebook, FaInstagram, FaLinkedin, FaPlane, FaGraduationCap, FaBlog,
  FaEnvelope, FaMapMarkerAlt, FaDev
} from 'react-icons/fa';
import { HiMiniUserGroup } from 'react-icons/hi2';
import { TbDrone } from 'react-icons/tb';
import { RiGalleryLine } from 'react-icons/ri';
import { MdPrivacyTip } from 'react-icons/md';

type NavLink = {
  href: string;
  icon: IconType;
  label: string;
};

type SocialLink = {
  Icon: IconType;
  href: string;
};

const Footer: React.FC = () => {
  const exploreLinks: NavLink[] = [
    { href: '/', icon: FaGraduationCap, label: 'Home' },
    { href: '/drones', icon: TbDrone, label: 'Drones' },
    { href: '/workshops', icon: FaPlane, label: 'Workshops' },
    { href: '/rcplanes', icon: FaPlane, label: 'RC Planes' },
    { href: '/techspardha', icon: FaBlog, label: 'Techspardha' },
    { href: '/external_events', icon: FaBlog, label: 'Events' },
  ];

  const additionalLinks: NavLink[] = [
    { href: '/gallery', icon: RiGalleryLine, label: 'Gallery' },
    // { href: '/devteam', icon: FaDev, label: 'DevTeam' },
    { href: '/members', icon: HiMiniUserGroup, label: 'Members' },
    { href: '/privacy-policy', icon: MdPrivacyTip, label: 'Privacy Policy' },
    { href: '/aboutUs', icon: FaGraduationCap, label: 'About Us' }
  ];

  const socialLinks: SocialLink[] = [
    { Icon: FaInstagram, href: 'https://www.instagram.com/aeroclub.nitkkr/' },
    { Icon: FaLinkedin, href: 'https://www.linkedin.com/company/aero-club-nit-kurukshetra/' },
    { Icon: FaFacebook, href: 'https://www.facebook.com/aeromodellingnitkkr/' }
  ];

  return (
    <footer className="bg-[#111] text-[#ababa1] font-final pt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Club Identity */}
        <div className="text-center md:text-left space-y-4">
          <h3 className="text-xl font-bold text-[#fff] border-b-2 border-[#333] pb-2 uppercase tracking-wider">
            Aero Club
          </h3>
          <div className="flex flex-col items-center md:items-start">
            <Image
              src="/aerologo.png"
              alt="Aero Club Logo"
              width={200}
              height={150}
              className="mb-2"
            />
            <p className="text-sm text-[#9ca3af]">
              Pioneering aerospace innovation at NIT Kurukshetra. Transforming dreams into flight.
            </p>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[#fff] border-b-2 border-[#333] pb-2 uppercase tracking-wider">
            Explore
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {exploreLinks.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 text-[#ababa1] hover:text-[#fff] transition-colors duration-300 font-final"
              >
                <Icon className="text-lg" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[#fff] border-b-2 border-[#333] pb-2 uppercase tracking-wider">
            Additional Links
          </h3>
          <div className="flex flex-col gap-2">
            {additionalLinks.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 text-[#ababa1] hover:text-[#fff] transition-colors duration-300 font-final"
              >
                <Icon className="text-lg" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Contact & Social */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[#fff] border-b-2 border-[#333] pb-2 uppercase tracking-wider">
            Connect
          </h3>
          <div className="space-y-3">
            {/* Contact Info */}
            <div className="flex flex-col gap-2 text-[#9ca3af] font-final">
              <div className="flex items-center gap-2">
                <FaEnvelope />
                <span>aeroclub@nitkkr.ac.in</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt />
                <span>NIT Kurukshetra, Haryana</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex gap-4 pt-2">
              {socialLinks.map(({ Icon, href }) => (
                <Link
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9ca3af] hover:text-[#fff] transition-colors duration-300 font-final"
                >
                  <Icon size={24} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm mt-10 pt-6 border-t border-[#333] text-[#9ca3af] font-final">
        &copy; {new Date().getFullYear()} Aero Club NIT Kurukshetra. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
