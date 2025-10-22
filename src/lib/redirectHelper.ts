// Helper function to format redirect URLs for display
export const formatRedirectUrl = (url: string): { display: string; description: string } => {
	// Remove leading slash
	const cleanUrl = url.startsWith("/") ? url.substring(1) : url;

	// Parse different URL patterns
	if (cleanUrl.startsWith("form/")) {
		const formId = cleanUrl.split("/")[1];
		return {
			display: `Form #${formId}`,
			description: "Continue with your event registration",
		};
	}

	if (cleanUrl.startsWith("drones")) {
		return {
			display: "Drones",
			description: "Learn more about drones",
		};
	}

	if (cleanUrl.startsWith("rcplanes")) {
		return {
			display: "RC Planes",
			description: "View RC planes",
		};
	}

	if (cleanUrl.startsWith("gallery")) {
		return {
			display: "Gallery",
			description: "Browse our photo gallery",
		};
	}

	if (cleanUrl.startsWith("about")) {
		return {
			display: "About",
			description: "Learn more about Aero Club",
		};
	}

	if (cleanUrl.startsWith("contact")) {
		return {
			display: "Contact",
			description: "Get in touch with us",
		};
	}

	// Default fallback
	return {
		display: url,
		description: "Return to your previous page",
	};
};
