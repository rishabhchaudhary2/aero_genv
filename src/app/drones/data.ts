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
    title: "Cave exploration drone",
    description: "Equipped with LiDAR, thermal cameras, and multi-gas sensors, our cave exploration drone maps complex underground terrains with pinpoint accuracy. It detects hazardous gases, monitors environmental conditions, and navigates tight passages, making exploration safer and efficient.",
    image: "/droneimages/cave.webp",
    rotation: "-rotate-3"
  },
  {
    title: "Gesture operated drone",
    description: "Take flight with just a wave of your hand. Gesture-controlled drone responds instantly to your movements, combining intuitive sensors, motion recognition, and real-time stabilization for a seamless, hands-on flying experience.",
    image: "/droneimages/gesture.jpg",
    rotation: "rotate-2"
  },
  {
    title: "Connected Drone",
    description: "Our connected drone leverages real-time GPS, IoT connectivity, and cloud integration to share live data, enable remote operation, and ensure seamless coordination, making every flight smarter and more connected.",
    image: "/droneimages/conn.JPG",
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