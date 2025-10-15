export interface DroneProject {
  title: string;
  description: string;
  image: string;
  rotation: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export const SECTION_DURATION = 6000;
export const RESUME_TIMEOUT = 5000;
export const SECTIONS_COUNT = 4;

export const droneProjects: DroneProject[] = [
  {
    title: "Object Tracking Drone",
    description: "Advanced drone with real-time object tracking capabilities using computer vision algorithms.",
    image: "/droneimages/project1.jpg",
    rotation: "-rotate-3"
  },
  {
    title: "Arduino Mini Drone",
    description: "DIY drone kit perfect for beginners, built with Arduino technology for easy customization.",
    image: "/droneimages/project2.jpg",
    rotation: "rotate-2"
  },
  {
    title: "FPV Racing Drone",
    description: "High-speed racing drone with first-person view capabilities for immersive flight experience.",
    image: "/droneimages/project3.jpg",
    rotation: "-rotate-1"
  }
];

export const faqs: FAQ[] = [
  {
    question: "What types of drones are there?",
    answer: "There are several types including quadcopters, hexacopters, fixed-wing drones, and hybrid VTOL models. Each has unique advantages depending on your application needs."
  },
  {
    question: "What are the legal requirements for flying drones?",
    answer: "Requirements typically include registration, maintaining line-of-sight, avoiding no-fly zones, and possibly obtaining a license depending on your location and purpose (recreational vs. commercial)."
  },
  {
    question: "How long can drones fly on a single charge?",
    answer: "Flight time varies significantly by model, from 5-10 minutes for mini drones to 20-30 minutes for consumer models, and up to 40+ minutes for professional-grade drones."
  },
  {
    question: "What features should I look for when buying a drone?",
    answer: "Consider camera quality, flight time, range, GPS capabilities, obstacle avoidance, flight modes, size/portability, and whether it has a &apos;return to home&apos; feature."
  },
  {
    question: "How do I maintain my drone?",
    answer: "Regular maintenance includes checking propellers for damage, cleaning motors and sensors, battery care, firmware updates, and calibration before flights."
  }
];