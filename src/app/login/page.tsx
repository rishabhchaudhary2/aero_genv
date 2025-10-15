'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Nav from '../../components/Nav';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineMail } from 'react-icons/hi';
import { RiLockPasswordLine } from 'react-icons/ri';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Floating airplane animation
  const [planes, setPlanes] = useState<{id: number, x: number, y: number, delay: number, scale: number, rotate: number}[]>([]);
  
  useEffect(() => {
    // Create decorative airplane elements
    const newPlanes = [];
    for (let i = 0; i < 5; i++) {
      newPlanes.push({
        id: i,
        x: Math.random() * 100, // Random position
        y: Math.random() * 100,
        delay: Math.random() * 5, // Random animation delay
        scale: 0.5 + Math.random() * 0.5, // Random size
        rotate: Math.random() * 360 // Random rotation
      });
    }
    setPlanes(newPlanes);
  }, []);
  
  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };
  
  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);
    
    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);
    
    if (emailValidationError || passwordValidationError) {
      return;
    }
    
    setIsLoading(true);
    setFormSubmitted(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Handle login logic here
      // Redirect on success or show error message
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#e5e5dd] text-black overflow-hidden relative">
      <Nav />
      
      {/* Decorative airplane elements */}
      {planes.map((plane) => (
        <motion.div
          key={plane.id}
          className="absolute pointer-events-none opacity-10 z-0"
          style={{
            left: `${plane.x}%`,
            top: `${plane.y}%`,
            scale: plane.scale,
            rotate: plane.rotate
          }}
          animate={{
            x: [0, 20, 0, -20, 0],
            y: [0, -10, 0, 10, 0],
            rotate: [plane.rotate, plane.rotate + 5, plane.rotate, plane.rotate - 5, plane.rotate]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            delay: plane.delay,
            ease: "linear"
          }}
        >
          <svg width="120" height="60" viewBox="0 0 120 60" fill="currentColor">
            <path d="M110,25 L80,25 L60,10 L10,10 L5,25 L60,40 L80,40 L110,25 Z M115,25 C117.5,25 117.5,30 115,30 L80,30 L80,35 L90,40 L90,45 L70,40 L60,40 L50,45 L50,40 L60,35 L60,30 L5,30 C2.5,30 2.5,25 5,25 L60,25 L60,20 L50,15 L50,10 L70,15 L80,15 L80,25 L115,25 Z" />
          </svg>
        </motion.div>
      ))}

      {/* Technical pattern background */}
      <div className="absolute inset-0 opacity-5 z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="black" strokeWidth="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          <pattern id="circles" width="50" height="50" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="1" fill="black" opacity="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#circles)" />
        </svg>
      </div>
      
      <div className="container mx-auto py-12 px-4 mt-16 relative z-10">
        <div className="max-w-md mx-auto">
          {/* Welcome Message */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-10 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Welcome to Aero Club</h1>
            <p className="text-gray-600 font-light max-w-sm mx-auto">Where imagination takes flight and innovation soars to new heights</p>
          </motion.div>
          
          {/* Login Form with success animation */}
          <AnimatePresence mode="wait">
            {formSubmitted && isLoading ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    borderRadius: ["20%", "50%", "20%"] 
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-16 h-16 border-t-4 border-b-4 border-black"
                />
                <p className="mt-6 text-lg">Logging in...</p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white p-8 rounded-lg shadow-lg border border-gray-200"
              >
                <h2 className="text-2xl font-bold mb-6">Login to your account</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className={`relative rounded-md ${emailError ? 'ring-2 ring-red-500' : 'focus-within:ring-2 focus-within:ring-black'}`}>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiOutlineMail className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError('');
                        }}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <Link href="/forgot-password" className="text-xs text-black hover:underline transition-colors">
                        Forgot Password?
                      </Link>
                    </div>
                    <div className={`relative rounded-md ${passwordError ? 'ring-2 ring-red-500' : 'focus-within:ring-2 focus-within:ring-black'}`}>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <RiLockPasswordLine className="text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (passwordError) setPasswordError('');
                        }}
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none transition-colors"
                        placeholder="••••••••"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>
                    {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
                  </div>
                  
                  <motion.button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded-md transition-colors relative overflow-hidden group"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10">{isLoading ? 'Logging in...' : 'Login'}</span>
                    <motion.div 
                      className="absolute inset-0 bg-gray-700 z-0" 
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  </motion.button>
                </form>
                
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <motion.button
                      type="button"
                      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.02, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FcGoogle className="w-5 h-5 mr-2" />
                      Login with Google
                    </motion.button>
                  </div>
                </div>
                
                <p className="mt-8 text-center text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/signup" className="font-medium text-black hover:underline transition-colors">
                    Signup
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Aero Club Info */}
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-lg font-bold mb-4">Aero Club</h3>
                <p className="text-gray-600 mb-4">
                  Pioneering aerospace innovation at NIT Kurukshetra. Transforming dreams into flight.
                </p>
                <div className="flex space-x-4 mt-4">
                  <a href="https://instagram.com" className="text-gray-400 hover:text-gray-500" aria-label="Instagram">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.235.6 1.8 1.165.565.565.915 1.132 1.165 1.8.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.165 1.8c-.565.565-1.132.915-1.8 1.165-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.8-1.165 4.902 4.902 0 01-1.165-1.8c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.165-1.8A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="https://linkedin.com" className="text-gray-400 hover:text-gray-500" aria-label="LinkedIn">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a href="https://facebook.com" className="text-gray-400 hover:text-gray-500" aria-label="Facebook">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
              
              {/* Explore Links */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Explore</h3>
                <ul className="space-y-2">
                  {['Home', 'Drones', 'Workshops', 'RC Planes', 'Blogs', 'Events', 'Meets', 'Inductions'].map(
                    (item) => (
                      <li key={item}>
                        <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-gray-600 hover:text-gray-800">
                          {item}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </div>
              
              {/* Additional Links */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">More</h3>
                <ul className="space-y-2">
                  {['Gallery', 'DevTeam', 'Members', 'Privacy Policy', 'About Us'].map((item) => (
                    <li key={item}>
                      <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-gray-600 hover:text-gray-800">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Contact</h3>
                  <p className="text-gray-600">aeroclub@nitkkr.ac.in</p>
                  <p className="text-gray-600">NIT Kurukshetra, Haryana</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-8 mt-8 text-center">
              <p className="text-sm text-gray-600">
                &copy; 2025 Aero Club NIT Kurukshetra. All Rights Reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Login;
