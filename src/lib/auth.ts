const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface LoginCredentials {
	email: string;
	password: string;
}

interface SignupData {
	email: string;
	password: string;
	full_name?: string;
}

interface AuthResponse {
	access_token: string;
	refresh_token: string;
	token_type: string;
}

interface UserResponse {
	_id: string;
	email: string;
	full_name?: string;
	profile_picture?: string;
	is_active: boolean;
	is_verified: boolean;
	created_at: string;
}

class AuthService {
	private getHeaders(includeAuth = false): HeadersInit {
		const headers: HeadersInit = {
			"Content-Type": "application/json",
		};

		if (includeAuth) {
			const token = this.getAccessToken();
			if (token) {
				headers["Authorization"] = `Bearer ${token}`;
			}
		}

		return headers;
	}

	// Token management
	getAccessToken(): string | null {
		if (typeof window !== "undefined") {
			return localStorage.getItem("access_token");
		}
		return null;
	}

	getRefreshToken(): string | null {
		if (typeof window !== "undefined") {
			return localStorage.getItem("refresh_token");
		}
		return null;
	}

	setTokens(accessToken: string, refreshToken: string): void {
		if (typeof window !== "undefined") {
			localStorage.setItem("access_token", accessToken);
			localStorage.setItem("refresh_token", refreshToken);
		}
	}

	clearTokens(): void {
		if (typeof window !== "undefined") {
			localStorage.removeItem("access_token");
			localStorage.removeItem("refresh_token");
		}
	}

	// Authentication methods
	async signup(data: SignupData): Promise<AuthResponse> {
		const response = await fetch(`${API_URL}/api/auth/signup`, {
			method: "POST",
			headers: this.getHeaders(),
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.detail || "Signup failed");
		}

		const authData: AuthResponse = await response.json();
		this.setTokens(authData.access_token, authData.refresh_token);
		return authData;
	}

	async login(credentials: LoginCredentials): Promise<AuthResponse> {
		const response = await fetch(`${API_URL}/api/auth/login`, {
			method: "POST",
			headers: this.getHeaders(),
			body: JSON.stringify(credentials),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.detail || "Login failed");
		}

		const authData: AuthResponse = await response.json();
		this.setTokens(authData.access_token, authData.refresh_token);
		return authData;
	}

	async loginWithGoogle(googleToken: string): Promise<AuthResponse> {
		const response = await fetch(`${API_URL}/api/auth/google`, {
			method: "POST",
			headers: this.getHeaders(),
			body: JSON.stringify({ token: googleToken }),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.detail || "Google login failed");
		}

		const authData: AuthResponse = await response.json();
		this.setTokens(authData.access_token, authData.refresh_token);
		return authData;
	}

	async refreshAccessToken(): Promise<AuthResponse> {
		const refreshToken = this.getRefreshToken();
		if (!refreshToken) {
			throw new Error("No refresh token available");
		}

		const response = await fetch(`${API_URL}/api/auth/refresh`, {
			method: "POST",
			headers: this.getHeaders(),
			body: JSON.stringify({ refresh_token: refreshToken }),
		});

		if (!response.ok) {
			this.clearTokens();
			throw new Error("Token refresh failed");
		}

		const authData: AuthResponse = await response.json();
		this.setTokens(authData.access_token, authData.refresh_token);
		return authData;
	}

	async getCurrentUser(): Promise<UserResponse> {
		const response = await fetch(`${API_URL}/api/auth/me`, {
			method: "GET",
			headers: this.getHeaders(true),
		});

		if (!response.ok) {
			if (response.status === 401) {
				// Try to refresh token
				try {
					await this.refreshAccessToken();
					return this.getCurrentUser();
				} catch {
					this.clearTokens();
					throw new Error("Authentication required");
				}
			}
			throw new Error("Failed to get user info");
		}

		return response.json();
	}

	async logout(): Promise<void> {
		try {
			await fetch(`${API_URL}/api/auth/logout`, {
				method: "POST",
				headers: this.getHeaders(true),
			});
		} finally {
			this.clearTokens();
		}
	}

	isAuthenticated(): boolean {
		return !!this.getAccessToken();
	}
}

export const authService = new AuthService();
export type { LoginCredentials, SignupData, AuthResponse, UserResponse };
