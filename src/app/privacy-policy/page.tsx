'use client';

import PrivacyPolicy from '@/components/PrivacyPolicy';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen w-full bg-[#E5E5DD] pt-24 pb-12 relative overflow-hidden">
        <PrivacyPolicy />
      </main>
      <Footer />
    </>
  );
}
