"use client";

import Image from "next/image";
import Nav from "../../components/Nav";

export default function CompetitionPage() {
  return (
    <div className="relative min-h-screen bg-[#e5e5dd] text-black overflow-hidden">

        {/* Nav */}
        <div className="absolute top-0 left-0 w-full z-50">
          <Nav />
        </div>

        {/* Main Content */}
        <div className="font-santoshi text-black">


        {/*  HERO  */}
        <section className="bg-[#f6f2ea] pt-40 pb-20 px-6 text-center">
          <h1 className="text-5xl md:text-8xl font-three tracking-wide mb-8">
            SkyFiesta 2026
          </h1>

          <p className="text-sm md:text-base font-final leading-relaxed text-black/75 max-w-2xl mx-auto">
            We Think <span className="mx-2">||</span>
            We Build <span className="mx-2">||</span>
            We Innovate
            <br />
            Experience the thrill of aeromodelling at NIT Kurukshetra.
          </p>

          <div className="mt-8 text-sm md:text-base font-final text-black/80">
            27-28 February 2026 <br />
            10:00 AM - 4:00 PM
          </div>

          {/* Poster */}
          <div className="mt-14 flex justify-center">
            <div className="relative w-full max-w-3xl h-[500px] rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/skyfiesta1/poster.jpg"
                alt="SkyFiesta Poster"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* ================= REGISTRATION ================= */}
        <section className="bg-[#efe9dd] py-28 px-6">
          <div className="max-w-4xl mx-auto text-center">

            <h2 className="text-3xl md:text-5xl font-three tracking-wide mb-6">
              Register Now
            </h2>

            <p className="text-sm md:text-base font-final text-black/70 leading-relaxed max-w-2xl mx-auto mb-12">
              Participation is open for both internal students of NIT Kurukshetra
              and external teams from other institutions.
            </p>

            <div className="bg-white rounded-3xl shadow-md py-12 px-8 flex flex-col md:flex-row justify-center gap-10">

              {/* Internal */}
              <div className="flex-1">
                <h3 className="text-base md:text-lg font-bold tracking-widest uppercase text-black/90 mb-6">
                  Internal Participants
                </h3>

                <p className="text-sm font-final text-black/70 mb-6">
                  For students currently enrolled at NIT Kurukshetra.
                </p>

                <a
                  href="https://forms.gle/RxgF5jj35TBZ16se9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 rounded-full 
                  bg-black text-white text-xs tracking-widest uppercase
                  hover:bg-white hover:text-black border-2 border-black transition duration-300"
                >
                  Register
                </a>
              </div>

              <div className="hidden md:block w-px bg-gray-200"></div>

              {/* External */}
              <div className="flex-1">
                <h3 className="text-base md:text-lg font-bold tracking-widest uppercase text-black/90 mb-6">
                  External Participants
                </h3>

                <p className="text-sm font-final text-black/70 mb-6">
                  For teams from other colleges and institutions.
                </p>

                <a
                  href="https://forms.gle/QFV4J2rhzm2Mt7pJ9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 rounded-full 
                  border-2 border-black text-xs tracking-widest uppercase
                  hover:bg-black hover:text-white transition duration-300"
                >
                  Register
                </a>
              </div>

            </div>
          </div>
        </section>

        <section className="bg-[#e8e2d6] py-28 px-6">
          <h2 className="text-3xl md:text-5xl font-three tracking-wide text-center mb-16">
            Event gallary
          </h2>

          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {["av.jpg", "orni.jpg", "ornithopter.jpg"].map((img, index) => (
              <div
                key={index}
                className="relative h-64 w-full overflow-hidden 
                rounded-2xl shadow-md hover:shadow-lg transition duration-300"
              >
                <Image
                  src={`/planeimages/${img}`}
                  alt="RC Plane"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ================= MAP ================= */}
        <section className="bg-[#f1ece3] py-28 text-center px-6">
          <h2 className="text-3xl md:text-5xl font-three tracking-wide mb-16">
            Location - NIT Kurukshetra
          </h2>

          <div className="flex justify-center">
            <iframe
              src="https://www.google.com/maps?q=NIT%20Kurukshetra&output=embed"
              width="90%"
              height="450"
              className="rounded-2xl shadow-md"
              loading="lazy"
            ></iframe>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="bg-black text-white text-center py-12 font-final border-t border-white/20">
          <p className="text-sm tracking-wide">
            © 2026 AERO Club | National Institute of Technology Kurukshetra
          </p>
        </footer>

      </div>
    </div>
  );
}
