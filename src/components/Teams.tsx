'use client';

import Image from 'next/image';

const Teams = () => {
    return (
        <div className="min-h-screen w-full bg-[#ffffff] py-20">
            <div className="text-center mb-16">
                <div className="w-full flex justify-center">
                    <div className="border-t-2 border-black w-40 mb-4"></div>
                </div>
                <h2 className="text-5xl font-bold">OUR TEAMS</h2>
                <div className="w-full flex justify-center">
                    <div className="border-t-2 border-black w-40 mt-4"></div>
                </div>
            </div>

            {/* RC Plane Team Section */}
            <div className="max-w-7xl mx-auto px-4 mb-20">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="md:w-1/2">
                        <Image 
                            src="/planeimages/rc_bg.jpg" 
                            alt="RC Plane Team" 
                            width={800}
                            height={400}
                            className="rounded-3xl w-full h-[400px] object-cover"
                        />
                    </div>
                    <div className="md:w-1/2">
                        <div className="inline-block border-2 border-black rounded-full px-6 py-2 mb-6">
                            <h3 className="text-2xl font-bold">RC PLANE</h3>
                        </div>
                        <p className="text-lg mb-6">
                            Meet Team RC Plane, SAE NIT KKR&apos;s dedicated radio-controlled aircraft team. 
                            We design, build, and fly custom RC planes that push the boundaries of 
                            aeronautical engineering at the student level.
                        </p>
                        <p className="text-lg mb-6">
                            Born from a passion for aviation and engineering excellence, our team 
                            combines aerodynamics expertise with hands-on craftsmanship to create 
                            aircraft that demonstrate precision in flight and innovative design solutions.
                        </p>
                        <p className="text-lg">
                            We participate in various national and international RC plane competitions, 
                            showcasing our technical prowess and piloting skills.
                        </p>
                    </div>
                </div>
            </div>

            {/* Nitrox Team Section */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row-reverse items-center gap-10">
                    <div className="md:w-1/2">
                        <Image 
                            src="/galleryimages/drone.jpg" 
                            alt="Nitrox Team" 
                            width={800}
                            height={400}
                            className="rounded-3xl w-full h-[400px] object-cover"
                        />
                    </div>
                    <div className="md:w-1/2">
                        <div className="inline-block border-2 border-black rounded-full px-6 py-2 mb-6">
                            <h3 className="text-2xl font-bold">Drones</h3>
                        </div>
                        <p className="text-lg mb-6">
                            Meet Team Drones, Aero&apos;s very own drone team, 
                            where aerial engineering meets fearless innovation.
                        </p>
                        <p className="text-lg mb-6">
                            We design and fabricate cutting-edge drones that are built 
                            to conquer everything from aerial photography to racing. Whether it&apos;s 
                            clearing obstacles, climbing grades, or outlasting endurance rounds, Team 
                            Drones thrives where the terrain gets tough and the challenge gets real.
                        </p>
                        <p className="text-lg">
                            {/* We participate in competitions such as eBAJA and ATVC. */}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Teams;