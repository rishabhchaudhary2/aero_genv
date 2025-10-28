'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import { leaderboardService, FormWithLeaderboard } from '@/lib/leaderboard';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLeaderboardHomePage() {
	const router = useRouter();
	const { user, isLoading: authLoading } = useAuth();
	const [forms, setForms] = useState<FormWithLeaderboard[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!authLoading) {
			if (!user) {
				router.push('/login');
			} else {
				fetchForms();
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authLoading, user]);

	const fetchForms = async () => {
		try {
			setIsLoading(true);
			const data = await leaderboardService.getFormsWithLeaderboard();
			setForms(data);
		} catch (err) {
			setError((err as Error).message || 'Failed to load forms');
		} finally {
			setIsLoading(false);
		}
	};

	if (authLoading || isLoading) {
		return (
			<div className="min-h-screen bg-linear-to-br from-[#e5e5dd] via-[#f5f5ed] to-[#e5e5dd]">
				<Nav />
				<div className="flex items-center justify-center h-screen">
					<div className="text-2xl font-santoshi">Loading...</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-linear-to-br from-[#e5e5dd] via-[#f5f5ed] to-[#e5e5dd]">
				<Nav />
				<div className="flex items-center justify-center h-screen">
					<div className="text-xl text-red-600 font-santoshi">{error}</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-linear-to-br from-[#e5e5dd] via-[#f5f5ed] to-[#e5e5dd]">
			<Nav />
			<div className="container mx-auto px-4 py-24">
				<div className="text-center mb-12">
					<h1 className="text-5xl md:text-6xl font-bold font-santoshi mb-4 text-[#111]">
						Admin Leaderboard Panel
					</h1>
					<p className="text-lg text-gray-600 font-santoshi">
						Manage scores for competitions
					</p>
				</div>

				{forms.length === 0 ? (
					<div className="text-center py-12">
						<p className="text-xl text-gray-500 font-santoshi">
							No leaderboards available at the moment.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
						{forms.map((form) => (
							<div
								key={form.id}
								onClick={() => router.push(`/leaderboard/admin/${form.id}`)}
								className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
							>
								<h3 className="text-2xl font-bold font-santoshi mb-2 text-[#111]">
									{form.name}
								</h3>
								<p className="text-gray-600 font-santoshi mb-4 capitalize">
									{form.type} Competition
								</p>
								<button className="w-full px-6 py-3 bg-linear-to-r from-red-600 to-red-800 text-white rounded-lg font-santoshi font-semibold hover:from-red-700 hover:to-red-900 transition-all">
									Manage Scores →
								</button>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
