import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Aero Club",
  description: "We think >> we build >> we innnovate >>. Join NIT Kurukshetra's Aeromodeling Club for exploring the realm of diving deeper into the skies of your aviation dream.",
  icons: {
    icon: '/aerologo.ico',
  },
  openGraph: {
    title: "AeroModelling Club",
    description: "We think >> we build >> we innnovate >>. Join NIT Kurukshetra's Aeromodeling Club for exploring the realm of diving deeper into the skies of your aviation dream.",
    url: "https://aeronitkkr.in",
    siteName: "AeroModelling Club",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
