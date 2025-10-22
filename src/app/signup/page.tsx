"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Script from "next/script";
import Nav from "../../components/Nav";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail, HiOutlineUser } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { FiEye, FiEyeOff, FiCheck } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { formatRedirectUrl } from "@/lib/redirectHelper";

const Signup = () => {
	const { loginWithGoogle } = useAuth();

	// Form phase: 'details' or 'verification'
	const [phase, setPhase] = useState<"details" | "verification">("details");

	// Form fields
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [retypePassword, setRetypePassword] = useState("");
	const [otp, setOtp] = useState(["", "", "", "", "", ""]);

	// UI states
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showRetypePassword, setShowRetypePassword] = useState(false);

	// Validation errors
	const [nameError, setNameError] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [retypePasswordError, setRetypePasswordError] = useState("");
	const [signupError, setSignupError] = useState<string>("");
	const [otpError, setOtpError] = useState<string>("");

	// OTP resend timer
	const [resendTimer, setResendTimer] = useState(0);
	const [canResend, setCanResend] = useState(false);

	// Floating airplane animation
	const [planes, setPlanes] = useState<
		{ id: number; x: number; y: number; delay: number; scale: number; rotate: number }[]
	>([]);
	
	// Redirect URL
	const [redirectUrl, setRedirectUrl] = useState<string>("");

	useEffect(() => {
		// Create decorative airplane elements
		const newPlanes = [];
		for (let i = 0; i < 5; i++) {
			newPlanes.push({
				id: i,
				x: Math.random() * 100,
				y: Math.random() * 100,
				delay: Math.random() * 5,
				scale: 0.5 + Math.random() * 0.5,
				rotate: Math.random() * 360,
			});
		}
		setPlanes(newPlanes);

		// Check for redirect URL
		const redirect = localStorage.getItem("redirect_after_login");
		if (redirect && redirect !== "/") {
			setRedirectUrl(redirect);
		}
	}, []);

	// Resend timer countdown
	useEffect(() => {
		if (resendTimer > 0) {
			const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
			return () => clearTimeout(timer);
		} else if (resendTimer === 0 && phase === "verification") {
			setCanResend(true);
		}
	}, [resendTimer, phase]);

	// Validation functions
	const validateName = (name: string) => {
		if (!name.trim()) return "Name is required";
		if (name.trim().length < 3) return "Name must be at least 3 characters";
		return "";
	};

	const validateEmail = (email: string) => {
		if (!email) return "Email is required";
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) return "Please enter a valid email address";
		return "";
	};

	const validatePassword = (password: string) => {
		if (!password) return "Password is required";
		if (password.length < 8) return "Password must be at least 8 characters";
		if (!/[0-9]/.test(password)) return "Password must contain at least one number";
		return "";
	};

	const validateRetypePassword = (password: string, retypePassword: string) => {
		if (!retypePassword) return "Please confirm your password";
		if (password !== retypePassword) return "Passwords do not match";
		return "";
	};

	// Handle initial signup form submission
	const handleSignupSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate all fields
		const nameValidationError = validateName(name);
		const emailValidationError = validateEmail(email);
		const passwordValidationError = validatePassword(password);
		const retypePasswordValidationError = validateRetypePassword(password, retypePassword);

		setNameError(nameValidationError);
		setEmailError(emailValidationError);
		setPasswordError(passwordValidationError);
		setRetypePasswordError(retypePasswordValidationError);
		setSignupError("");

		if (
			nameValidationError ||
			emailValidationError ||
			passwordValidationError ||
			retypePasswordValidationError
		) {
			return;
		}

		setIsLoading(true);

		try {
			// Send signup request to initiate OTP
			const response = await fetch("http://localhost:8000/api/auth/signup/initiate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
					full_name: name,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.detail || "Signup failed");
			}

			// Move to verification phase
			setPhase("verification");
			setResendTimer(60); // 60 seconds before can resend
			setCanResend(false);
		} catch (error) {
			console.error("Signup error:", error);
			setSignupError(
				error instanceof Error
					? error.message
					: "An error occurred during signup. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	// Handle OTP input
	const handleOtpChange = (index: number, value: string) => {
		if (value.length > 1) {
			value = value[0];
		}

		if (!/^\d*$/.test(value)) return;

		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);

		// Auto-focus next input
		if (value && index < 5) {
			const nextInput = document.getElementById(`otp-${index + 1}`);
			nextInput?.focus();
		}
	};

	// Handle OTP verification
	const handleVerifyOtp = async (e: React.FormEvent) => {
		e.preventDefault();

		const otpCode = otp.join("");
		if (otpCode.length !== 6) {
			setOtpError("Please enter all 6 digits");
			return;
		}

		setIsLoading(true);
		setOtpError("");

		try {
			const response = await fetch("http://localhost:8000/api/auth/signup/verify", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					otp: otpCode,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.detail || "OTP verification failed");
			}

			// Store tokens
			localStorage.setItem("access_token", data.access_token);
			localStorage.setItem("refresh_token", data.refresh_token);

			// Redirect to home
			// router.push("/login");

            const redirect = localStorage.getItem("redirect_after_login") || "/";
            window.location.href = redirect;
		} catch (error) {
			console.error("OTP verification error:", error);
			setOtpError(error instanceof Error ? error.message : "Invalid OTP. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	// Handle OTP resend
	const handleResendOtp = async () => {
		if (!canResend) return;

		setIsLoading(true);
		setOtpError("");

		try {
			const response = await fetch("http://localhost:8000/api/auth/signup/resend-otp", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.detail || "Failed to resend OTP");
			}

			setResendTimer(60);
			setCanResend(false);
			setOtp(["", "", "", "", "", ""]);
		} catch (error) {
			console.error("Resend OTP error:", error);
			setOtpError(
				error instanceof Error ? error.message : "Failed to resend OTP. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	// Google Sign-In handler
	const handleGoogleSignup = async () => {
		setIsLoading(true);
		setSignupError("");

		try {
			interface GoogleTokenClient {
				requestAccessToken: () => void;
			}

			interface GoogleAccounts {
				oauth2: {
					initTokenClient: (config: {
						client_id: string;
						scope: string;
						callback: (response: { access_token?: string }) => void;
					}) => GoogleTokenClient;
				};
			}

			const googleAccounts = (window as { google?: { accounts?: GoogleAccounts } }).google
				?.accounts;

			const client = googleAccounts?.oauth2?.initTokenClient({
				client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
				scope: "email profile",
				callback: async (response: { access_token?: string }) => {
					if (response.access_token) {
						try {
							await loginWithGoogle(response.access_token);
                            const redirect = localStorage.getItem("redirect_after_login") || "/";
                            window.location.href = redirect;
						} catch (error) {
							console.error("Google signup error:", error);
							setSignupError(
								error instanceof Error ? error.message : "Google signup failed"
							);
							setIsLoading(false);
						}
					}
				},
			});

			client?.requestAccessToken();
		} catch (error) {
			console.error("Google signup error:", error);
			setSignupError("Google signup failed. Please try again.");
			setIsLoading(false);
		}
	};

	return (
		<>
			<Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />
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
							rotate: plane.rotate,
						}}
						animate={{
							x: [0, 20, 0, -20, 0],
							y: [0, -10, 0, 10, 0],
							rotate: [
								plane.rotate,
								plane.rotate + 5,
								plane.rotate,
								plane.rotate - 5,
								plane.rotate,
							],
						}}
						transition={{
							duration: 20,
							repeat: Infinity,
							delay: plane.delay,
							ease: "linear",
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
							<path
								d="M 20 0 L 0 0 0 20"
								fill="none"
								stroke="black"
								strokeWidth="0.5"
							/>
						</pattern>
						<rect width="100%" height="100%" fill="url(#grid)" />

						<pattern id="circles" width="50" height="50" patternUnits="userSpaceOnUse">
							<circle cx="25" cy="25" r="1" fill="black" opacity="0.5" />
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
							<h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
								Join Aero Club
							</h1>
							<p className="text-gray-600 font-light max-w-sm mx-auto">
								Create your account and become part of our innovative aerospace
								community
							</p>
						</motion.div>

						{/* Signup Form */}
						<AnimatePresence mode="wait">
							{phase === "details" ? (
								<motion.div
									key="details"
									initial={{ opacity: 0, y: 30 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -30 }}
									transition={{ duration: 0.8, delay: 0.2 }}
									className="bg-white p-8 rounded-lg shadow-lg border border-gray-200"
								>
									<h2 className="text-2xl font-bold mb-6">Create your account</h2>

									{/* Redirect notification */}
									{redirectUrl &&
										(() => {
											const { display, description } = formatRedirectUrl(redirectUrl);
											return (
												<motion.div
													initial={{ opacity: 0, y: -10 }}
													animate={{ opacity: 1, y: 0 }}
													className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md"
												>
													<div className="flex items-start gap-2">
														<span className="text-blue-500 text-lg">ℹ️</span>
														<div className="flex-1">
															<p className="text-sm text-blue-800 font-medium">
																You&apos;ll be redirected after registration
															</p>
															<p className="text-xs text-blue-600 mt-1">
																<span className="font-semibold">{display}</span> • {description}
															</p>
														</div>
													</div>
												</motion.div>
											);
										})()}

									{/* Error message */}
									{signupError && (
										<div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
											{signupError}
										</div>
									)}

									{/* Signup form */}
									<form onSubmit={handleSignupSubmit} className="space-y-4">
										{/* Name field */}
										<div>
											<label
												htmlFor="name"
												className="block text-sm font-medium text-gray-700 mb-1"
											>
												Full Name
											</label>
											<div
												className={`relative rounded-md ${
													nameError
														? "ring-2 ring-red-500"
														: "focus-within:ring-2 focus-within:ring-black"
												}`}
											>
												<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
													<HiOutlineUser className="text-gray-400" />
												</div>
												<input
													id="name"
													type="text"
													value={name}
													onChange={(e) => {
														setName(e.target.value);
														if (nameError)
															setNameError(
																validateName(e.target.value)
															);
													}}
													className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none transition-colors"
													placeholder="John Doe"
												/>
											</div>
											{nameError && (
												<p className="mt-1 text-sm text-red-600">
													{nameError}
												</p>
											)}
										</div>

										{/* Email field */}
										<div>
											<label
												htmlFor="email"
												className="block text-sm font-medium text-gray-700 mb-1"
											>
												Email Address
											</label>
											<div
												className={`relative rounded-md ${
													emailError
														? "ring-2 ring-red-500"
														: "focus-within:ring-2 focus-within:ring-black"
												}`}
											>
												<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
													<HiOutlineMail className="text-gray-400" />
												</div>
												<input
													id="email"
													type="email"
													value={email}
													onChange={(e) => {
														setEmail(e.target.value);
														if (emailError)
															setEmailError(
																validateEmail(e.target.value)
															);
													}}
													className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none transition-colors"
													placeholder="your.email@example.com"
												/>
											</div>
											{emailError && (
												<p className="mt-1 text-sm text-red-600">
													{emailError}
												</p>
											)}
										</div>

										{/* Password field */}
										<div>
											<label
												htmlFor="password"
												className="block text-sm font-medium text-gray-700 mb-1"
											>
												Password
											</label>
											<div
												className={`relative rounded-md ${
													passwordError
														? "ring-2 ring-red-500"
														: "focus-within:ring-2 focus-within:ring-black"
												}`}
											>
												<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
													<RiLockPasswordLine className="text-gray-400" />
												</div>
												<input
													id="password"
													type={showPassword ? "text" : "password"}
													value={password}
													onChange={(e) => {
														setPassword(e.target.value);
														if (passwordError)
															setPasswordError(
																validatePassword(e.target.value)
															);
													}}
													className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none transition-colors"
													placeholder="••••••••"
												/>
												<div className="absolute inset-y-0 right-0 pr-3 flex items-center">
													<button
														type="button"
														onClick={() =>
															setShowPassword(!showPassword)
														}
														className="text-gray-400 hover:text-gray-600 focus:outline-none"
													>
														{showPassword ? <FiEyeOff /> : <FiEye />}
													</button>
												</div>
											</div>
											{passwordError && (
												<p className="mt-1 text-sm text-red-600">
													{passwordError}
												</p>
											)}
										</div>

										{/* Retype Password field */}
										<div>
											<label
												htmlFor="retypePassword"
												className="block text-sm font-medium text-gray-700 mb-1"
											>
												Confirm Password
											</label>
											<div
												className={`relative rounded-md ${
													retypePasswordError
														? "ring-2 ring-red-500"
														: "focus-within:ring-2 focus-within:ring-black"
												}`}
											>
												<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
													<RiLockPasswordLine className="text-gray-400" />
												</div>
												<input
													id="retypePassword"
													type={showRetypePassword ? "text" : "password"}
													value={retypePassword}
													onChange={(e) => {
														setRetypePassword(e.target.value);
														if (retypePasswordError)
															setRetypePasswordError(
																validateRetypePassword(
																	password,
																	e.target.value
																)
															);
													}}
													className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none transition-colors"
													placeholder="••••••••"
												/>
												<div className="absolute inset-y-0 right-0 pr-3 flex items-center">
													<button
														type="button"
														onClick={() =>
															setShowRetypePassword(
																!showRetypePassword
															)
														}
														className="text-gray-400 hover:text-gray-600 focus:outline-none"
													>
														{showRetypePassword ? (
															<FiEyeOff />
														) : (
															<FiEye />
														)}
													</button>
												</div>
											</div>
											{retypePasswordError && (
												<p className="mt-1 text-sm text-red-600">
													{retypePasswordError}
												</p>
											)}
										</div>

										{/* Submit button */}
										<motion.button
											type="submit"
											className="w-full bg-black text-white py-2 rounded-md transition-colors relative overflow-hidden group mt-6"
											disabled={isLoading}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
										>
											<span className="relative z-10">
												{isLoading ? "Creating Account..." : "Continue"}
											</span>
											<motion.div
												className="absolute inset-0 bg-gray-700 z-0"
												initial={{ x: "-100%" }}
												whileHover={{ x: 0 }}
												transition={{ duration: 0.3, ease: "easeInOut" }}
											/>
										</motion.button>
									</form>

									{/* Divider */}
									<div className="mt-6">
										<div className="relative">
											<div className="absolute inset-0 flex items-center">
												<div className="w-full border-t border-gray-300"></div>
											</div>
											<div className="relative flex justify-center text-sm">
												<span className="px-2 bg-white text-gray-500">
													Or continue with
												</span>
											</div>
										</div>

										{/* Google signup */}
										<div className="mt-6">
											<motion.button
												type="button"
												onClick={handleGoogleSignup}
												disabled={isLoading}
												className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
												whileHover={{
													scale: 1.02,
													boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
												}}
												whileTap={{ scale: 0.98 }}
											>
												<FcGoogle className="w-5 h-5 mr-2" />
												Sign up with Google
											</motion.button>
										</div>
									</div>

									{/* Login link */}
									<p className="mt-8 text-center text-sm text-gray-600">
										Already have an account?{" "}
										<Link
											href="/login"
											className="font-medium text-black hover:underline transition-colors"
										>
											Login
										</Link>
									</p>
								</motion.div>
							) : (
								<motion.div
									key="verification"
									initial={{ opacity: 0, y: 30 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -30 }}
									transition={{ duration: 0.8, delay: 0.2 }}
									className="bg-white p-8 rounded-lg shadow-lg border border-gray-200"
								>
									{/* Header */}
									<div className="text-center mb-8">
										<motion.div
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
										>
											<HiOutlineMail className="text-3xl text-black" />
										</motion.div>
										<h2 className="text-2xl font-bold mb-2">
											Verify Your Email
										</h2>
										<p className="text-gray-600">
											We&apos;ve sent a 6-digit code to
											<br />
											<span className="text-black font-semibold">
												{email}
											</span>
										</p>
									</div>

									{/* Error message */}
									{otpError && (
										<div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
											{otpError}
										</div>
									)}

									{/* OTP form */}
									<form onSubmit={handleVerifyOtp} className="space-y-6">
										{/* OTP input */}
										<div className="flex gap-2 justify-center">
											{otp.map((digit, index) => (
												<input
													key={index}
													id={`otp-${index}`}
													type="text"
													inputMode="numeric"
													maxLength={1}
													value={digit}
													onChange={(e) =>
														handleOtpChange(index, e.target.value)
													}
													onKeyDown={(e) => {
														if (
															e.key === "Backspace" &&
															!digit &&
															index > 0
														) {
															const prevInput =
																document.getElementById(
																	`otp-${index - 1}`
																);
															prevInput?.focus();
														}
													}}
													className="w-12 h-14 text-center text-2xl font-bold bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black transition-colors"
												/>
											))}
										</div>

										{/* Submit button */}
										<motion.button
											type="submit"
											disabled={isLoading}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											className="w-full bg-black text-white py-2 rounded-md transition-colors relative overflow-hidden group"
										>
											<span className="relative z-10">
												{isLoading ? (
													"Verifying..."
												) : (
													<>
														<FiCheck className="inline mr-2" /> Verify &
														Create Account
													</>
												)}
											</span>
											<motion.div
												className="absolute inset-0 bg-gray-700 z-0"
												initial={{ x: "-100%" }}
												whileHover={{ x: 0 }}
												transition={{ duration: 0.3, ease: "easeInOut" }}
											/>
										</motion.button>
									</form>

									{/* Resend OTP */}
									<div className="mt-6 text-center">
										{canResend ? (
											<button
												onClick={handleResendOtp}
												disabled={isLoading}
												className="text-black hover:underline font-medium disabled:opacity-50"
											>
												Resend Code
											</button>
										) : (
											<p className="text-gray-600">
												Resend code in{" "}
												<span className="text-black font-semibold">
													{resendTimer}s
												</span>
											</p>
										)}
									</div>

									{/* Back button */}
									<button
										onClick={() => setPhase("details")}
										className="mt-4 w-full text-gray-600 hover:text-black text-sm"
									>
										← Back to signup
									</button>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</>
	);
};

export default Signup;
