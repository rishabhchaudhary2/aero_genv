const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface LeaderboardEntry {
	id: string;
	user_name?: string;
	user_email: string;
	responses: Record<string, string>;
	submitted_at: string;
	score?: number;
	rank?: number;
}

export interface LeaderboardResponse {
	form_id: string;
	form_name: string;
	entries: LeaderboardEntry[];
	total_count: number;
}

export interface AdminLeaderboardResponse extends LeaderboardResponse {
	questions: Array<{
		question_key: string;
		question_text: string;
		question_type: string;
		options?: string[];
	}>;
}

export interface FormWithLeaderboard {
	id: string;
	name: string;
	type: string;
}

class LeaderboardService {
	private getHeaders(includeAuth = false): HeadersInit {
		const headers: HeadersInit = {
			"Content-Type": "application/json",
		};

		if (includeAuth && typeof window !== "undefined") {
			const token = localStorage.getItem("access_token");
			if (token) {
				headers["Authorization"] = `Bearer ${token}`;
			}
		}

		return headers;
	}

	async getLeaderboard(formId: string): Promise<LeaderboardResponse> {
		const response = await fetch(`${API_URL}/api/leaderboard/${formId}`, {
			method: "GET",
			headers: this.getHeaders(),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.detail || "Failed to fetch leaderboard");
		}

		return await response.json();
	}

	async getAdminLeaderboard(formId: string): Promise<AdminLeaderboardResponse> {
		const response = await fetch(`${API_URL}/api/leaderboard/${formId}/admin`, {
			method: "GET",
			headers: this.getHeaders(true),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.detail || "Failed to fetch admin leaderboard");
		}

		return await response.json();
	}

	async updateScore(formId: string, entryId: string, score: number): Promise<void> {
		const response = await fetch(
			`${API_URL}/api/leaderboard/${formId}/entry/${entryId}/score`,
			{
				method: "PATCH",
				headers: this.getHeaders(true),
				body: JSON.stringify({ score }),
			}
		);

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.detail || "Failed to update score");
		}
	}

	async getFormsWithLeaderboard(): Promise<FormWithLeaderboard[]> {
		const response = await fetch(`${API_URL}/api/forms-with-leaderboard`, {
			method: "GET",
			headers: this.getHeaders(),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.detail || "Failed to fetch forms");
		}

		const data = await response.json();
		return data.forms;
	}
}

export const leaderboardService = new LeaderboardService();
