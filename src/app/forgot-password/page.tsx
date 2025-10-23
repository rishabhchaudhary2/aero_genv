"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Nav from "../../components/Nav";
import { HiOutlineMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { FiEye, FiEyeOff, FiCheck } from "react-icons/fi";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
	const router = useRouter();

	// Form phase: 'email' or 'verification' or 'reset'
	const [phase, setPhase] = useState<"email" | "verification" | "reset">("email");

	// Form fields
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const [newPassword, setNewPassword] = useState("");
	const [retypePassword, setRetypePassword] = useState("");

	// UI states
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showRetypePassword, setShowRetypePassword] = useState(false);

	// Validation errors
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [retypePasswordError, setRetypePasswordError] = useState("");
	const [formError, setFormError] = useState<string>("");
	const [otpError, setOtpError] = useState<string>("");
	const [successMessage, setSuccessMessage] = useState<string>("");

	// OTP resend timer
	const [resendTimer, setResendTimer] = useState(0);
	const [canResend, setCanResend] = useState(false);

	// Floating airplane animation
	const [planes, setPlanes] = useState<
		{ id: number; x: number; y: number; delay: number; scale: number; rotate: number }[]
	>([]);

	const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

	// Phase 1: Send OTP
	const handleSendOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormError("");

		// Validate email
		const emailErr = validateEmail(email);
		if (emailErr) {
			setEmailError(emailErr);
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch(API_URL + "/api/auth/forgot-password/initiate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});

			const data = await response.json();

			if (response.ok) {
				setPhase("verification");
				setResendTimer(60);
				setCanResend(false);
			} else {
				setFormError(data.detail || "Failed to send OTP. Please try again.");
			}
		} catch (error) {
			console.error("Error sending OTP:", error);
			setFormError("Network error. Please check your connection and try again.");
		} finally {
			setIsLoading(false);
		}
	};

	// Handle OTP input
	const handleOtpChange = (index: number, value: string) => {
		// Only allow numbers
		if (value && !/^\d$/.test(value)) return;

		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);
		setOtpError("");

		// Auto-focus next input
		if (value && index < 5) {
			const nextInput = document.getElementById(`otp-${index + 1}`);
			nextInput?.focus();
		}
	};

	// Handle OTP backspace
	const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			const prevInput = document.getElementById(`otp-${index - 1}`);
			prevInput?.focus();
		}
	};

	// Phase 2: Verify OTP
	const handleVerifyOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		setOtpError("");

		const otpValue = otp.join("");
		if (otpValue.length !== 6) {
			setOtpError("Please enter the complete 6-digit OTP");
			return;
		}

		setPhase("reset");
	};

	// Phase 3: Reset Password
	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormError("");

		// Validate passwords
		const passwordErr = validatePassword(newPassword);
		const retypePasswordErr = validateRetypePassword(newPassword, retypePassword);

		setPasswordError(passwordErr);
		setRetypePasswordError(retypePasswordErr);

		if (passwordErr || retypePasswordErr) return;

		setIsLoading(true);

		try {
			const otpValue = otp.join("");
			const response = await fetch(API_URL + "/api/auth/forgot-password/verify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					otp: otpValue,
					new_password: newPassword,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				setSuccessMessage("Password reset successful! Redirecting to login...");
				setTimeout(() => {
					router.push("/login");
				}, 2000);
			} else {
				setFormError(data.detail || "Failed to reset password. Please try again.");
			}
		} catch (error) {
			console.error("Error resetting password:", error);
			setFormError("Network error. Please check your connection and try again.");
		} finally {
			setIsLoading(false);
		}
	};

	// Resend OTP
	const handleResendOTP = async () => {
		if (!canResend) return;

		setOtpError("");
		setIsLoading(true);

		try {
			const response = await fetch(API_URL + "/api/auth/forgot-password/resend-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});

			const data = await response.json();

			if (response.ok) {
				setResendTimer(60);
				setCanResend(false);
				setOtp(["", "", "", "", "", ""]);
			} else {
				setOtpError(data.detail || "Failed to resend OTP");
			}
		} catch (error) {
			console.error("Error resending OTP:", error);
			setOtpError("Network error. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#e5e5dd] text-black overflow-hidden relative">
			{/* Navigation */}
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
						<path d="M 20 0 L 0 0 0 20" fill="none" stroke="black" strokeWidth="0.5" />
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
							Reset Password
						</h1>
						<p className="text-gray-600 font-light max-w-sm mx-auto">
							{phase === "email" && "Enter your email to receive a verification code"}
							{phase === "verification" && "Enter the 6-digit code sent to your email"}
							{phase === "reset" && "Create a new secure password for your account"}
						</p>
					</motion.div>

					{/* Form Container */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -30 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="bg-white p-8 rounded-lg shadow-lg border border-gray-200"
					>
						<AnimatePresence mode="wait">
							{/* Phase 1: Email Input */}
							{phase === "email" && (
								<motion.form
									key="email-form"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 20 }}
									onSubmit={handleSendOTP}
								>
									<h2 className="text-2xl font-bold mb-6">Forgot your password?</h2>

									{/* Error Message */}
									{formError && (
										<motion.div
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm"
										>
											{formError}
										</motion.div>
									)}

									{/* Email Field */}
									<div className="mb-6">
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Email Address
										</label>
										<div
											className={`relative rounded-md ${emailError
													? "ring-2 ring-red-500"
													: "focus-within:ring-2 focus-within:ring-black"
												}`}
										>
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
												<HiOutlineMail className="text-gray-400" />
											</div>
											<input
												type="email"
												value={email}
												onChange={(e) => {
													setEmail(e.target.value);
													setEmailError("");
													setFormError("");
												}}
												className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none transition-colors"
												placeholder="your.email@example.com"
											/>
										</div>
										{emailError && (
											<p className="mt-1 text-sm text-red-600">{emailError}</p>
										)}
									</div>

									{/* Submit Button */}
									<motion.button
										type="submit"
										disabled={isLoading}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										className="w-full cursor-pointer bg-black text-white py-2 rounded-md transition-colors relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{isLoading ? (
											<span className="flex items-center justify-center">
												<svg
													className="animate-spin h-5 w-5 mr-2"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													></circle>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
													></path>
												</svg>
												Sending Code...
											</span>
										) : (
											"Send Verification Code"
										)}
									</motion.button>

									{/* Back to Login */}
									<div className="mt-4 text-center">
										<Link
											href="/login"
											className="text-sm text-gray-600 hover:text-black transition-colors"
										>
											Back to Login
										</Link>
									</div>
								</motion.form>
							)}

							{/* Phase 2: OTP Verification */}
							{phase === "verification" && (
								<motion.form
									key="otp-form"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 20 }}
									onSubmit={handleVerifyOTP}
								>
									<h2 className="text-2xl font-bold mb-6">Enter Verification Code</h2>

									{/* Error Message */}
									{otpError && (
										<motion.div
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm"
										>
											{otpError}
										</motion.div>
									)}

									<div className="mb-6">
										<p className="text-center text-gray-600 mb-6 text-sm">
											We&apos;ve sent a 6-digit code to
											<br />
											<span className="font-semibold text-black">{email}</span>
										</p>

										{/* OTP Input Boxes */}
										<div className="flex gap-2 justify-center mb-6">
											{otp.map((digit, index) => (
												<input
													key={index}
													id={`otp-${index}`}
													type="text"
													maxLength={1}
													value={digit}
													onChange={(e) => handleOtpChange(index, e.target.value)}
													onKeyDown={(e) => handleOtpKeyDown(index, e)}
													className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black transition-all"
												/>
											))}
										</div>

										{/* Resend OTP */}
										<div className="text-center text-sm">
											{resendTimer > 0 ? (
												<p className="text-gray-600">
													Resend code in{" "}
													<span className="font-semibold text-black">
														{resendTimer}s
													</span>
												</p>
											) : (
												<button
													type="button"
													onClick={handleResendOTP}
													disabled={!canResend || isLoading}
													className="text-black hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
												>
													Resend Code
												</button>
											)}
										</div>
									</div>

									{/* Continue Button */}
									<motion.button
										type="submit"
										disabled={isLoading || otp.join("").length !== 6}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										className="w-full bg-black text-white py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										Continue
									</motion.button>

									{/* Back Button */}
									<button
										type="button"
										onClick={() => {
											setPhase("email");
											setOtp(["", "", "", "", "", ""]);
											setOtpError("");
										}}
										className="w-full mt-4 text-sm text-gray-600 hover:text-black transition-colors"
									>
										Change Email
									</button>
								</motion.form>
							)}

							{/* Phase 3: Reset Password */}
							{phase === "reset" && (
								<motion.form
									key="reset-form"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 20 }}
									onSubmit={handleResetPassword}
								>
									<h2 className="text-2xl font-bold mb-6">Create New Password</h2>

									{/* Error Message */}
									{formError && (
										<motion.div
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm"
										>
											{formError}
										</motion.div>
									)}

									{/* Success Message */}
									{successMessage && (
										<motion.div
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											className="mb-4 p-3 bg-green-50 text-green-600 rounded-md text-sm flex items-center gap-2"
										>
											<FiCheck className="text-lg" />
											{successMessage}
										</motion.div>
									)}

									{/* New Password Field */}
									<div className="mb-4">
										<label className="block text-sm font-medium text-gray-700 mb-1">
											New Password
										</label>
										<div
											className={`relative rounded-md ${passwordError
													? "ring-2 ring-red-500"
													: "focus-within:ring-2 focus-within:ring-black"
												}`}
										>
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
												<RiLockPasswordLine className="text-gray-400" />
											</div>
											<input
												type={showPassword ? "text" : "password"}
												value={newPassword}
												onChange={(e) => {
													setNewPassword(e.target.value);
													setPasswordError("");
													setFormError("");
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
										{passwordError && (
											<p className="mt-1 text-sm text-red-600">{passwordError}</p>
										)}
									</div>

									{/* Retype Password Field */}
									<div className="mb-6">
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Confirm Password
										</label>
										<div
											className={`relative rounded-md ${retypePasswordError
													? "ring-2 ring-red-500"
													: "focus-within:ring-2 focus-within:ring-black"
												}`}
										>
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
												<RiLockPasswordLine className="text-gray-400" />
											</div>
											<input
												type={showRetypePassword ? "text" : "password"}
												value={retypePassword}
												onChange={(e) => {
													setRetypePassword(e.target.value);
													setRetypePasswordError("");
													setFormError("");
												}}
												className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none transition-colors"
												placeholder="••••••••"
											/>
											<div className="absolute inset-y-0 right-0 pr-3 flex items-center">
												<button
													type="button"
													onClick={() => setShowRetypePassword(!showRetypePassword)}
													className="text-gray-400 hover:text-gray-600 focus:outline-none"
												>
													{showRetypePassword ? <FiEyeOff /> : <FiEye />}
												</button>
											</div>
										</div>
										{retypePasswordError && (
											<p className="mt-1 text-sm text-red-600">{retypePasswordError}</p>
										)}
									</div>

									{/* Reset Button */}
									<motion.button
										type="submit"
										disabled={isLoading || !!successMessage}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										className="w-full bg-black text-white py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{isLoading ? (
											<span className="flex items-center justify-center">
												<svg
													className="animate-spin h-5 w-5 mr-2"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													></circle>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
													></path>
												</svg>
												Resetting Password...
											</span>
										) : (
											"Reset Password"
										)}
									</motion.button>
								</motion.form>
							)}
						</AnimatePresence>
					</motion.div>

					{/* Additional Info */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
						className="mt-6 text-center"
					>
						<p className="text-gray-600 text-sm">
							Remember your password?{" "}
							<Link href="/login" className="text-black font-semibold hover:underline">
								Log in
							</Link>
						</p>
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
