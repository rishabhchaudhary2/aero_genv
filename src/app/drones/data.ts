export interface DroneProject {
  title: string;
  description: string;
  image: string;
  rotation: string;
}

export interface TeamMember {
  name: string;
  role: string;
  email: string;
  rollNo: string;
  batch: string;
  branch: string;
  image: string;
  linkedin: string;
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

export const teamMembers: TeamMember[] = [
  {
    name: "John Smith",
    role: "Drone Team Lead",
    email: "john.smith@example.com",
    rollNo: "20B0101",
    batch: "2020-24",
    branch: "Aerospace Engineering",
    image: "/team/john-smith.jpg",
    linkedin: "https://linkedin.com/in/john-smith"
  },
  {
    name: "Sarah Johnson",
    role: "Design Engineer",
    email: "sarah.johnson@example.com",
    rollNo: "21B0202",
    batch: "2021-25",
    branch: "Mechanical Engineering",
    image: "/team/sarah-johnson.jpg",
    linkedin: "https://linkedin.com/in/sarah-johnson"
  },
  {
    name: "Mike Chen",
    role: "Electronics Lead",
    email: "mike.chen@example.com",
    rollNo: "20B0303",
    batch: "2020-24",
    branch: "Electronics Engineering",
    image: "/team/mike-chen.jpg",
    linkedin: "https://linkedin.com/in/mike-chen"
  },
  {
    name: "Priya Patel",
    role: "Software Engineer",
    email: "priya.patel@example.com",
    rollNo: "22B0404",
    batch: "2022-26",
    branch: "Computer Science",
    image: "/team/priya-patel.jpg",
    linkedin: "https://linkedin.com/in/priya-patel"
  }
];