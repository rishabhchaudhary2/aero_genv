'use client';

import AboutUs from '@/components/AboutUs';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen w-full bg-[#e5e5dd] pt-24 pb-12 relative overflow-hidden">
        <AboutUs />
      </main>
      <Footer />
    </>
  );
}
