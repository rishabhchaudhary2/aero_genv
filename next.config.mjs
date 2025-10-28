/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "lh3.googleusercontent.com",
			},
			{
				hostname: "drive.usercontent.google.com",
			},
			{
				hostname: "encrypted-tbn0.gstatic.com",
			},
		],
	},
};

export default nextConfig;
