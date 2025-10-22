'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Nav from '@/components/Nav';
import { IoReload } from "react-icons/io5";
import { leaderboardService, LeaderboardEntry } from '@/lib/leaderboard';

export default function LeaderboardPage() {
	const params = useParams();
	const formId = params.id as string;
	const containerRef = useRef<HTMLDivElement>(null);

	const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
	const [formName, setFormName] = useState<string>('');
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchLeaderboard = async (isManualRefresh = false) => {
		try {
			if (isManualRefresh) {
				setIsRefreshing(true);
			} else {
				setIsLoading(true);
			}
			const data = await leaderboardService.getLeaderboard(formId);
			setEntries(data.entries);
			setFormName(data.form_name);
			setError(null);
		} catch (err) {
			setError((err as Error).message || 'Failed to load leaderboard');
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	};

	useEffect(() => {
		fetchLeaderboard();
		
		// Auto-reload every 5 seconds
		const interval = setInterval(() => {
			fetchLeaderboard(true);
		}, 5000);

		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formId]);

	const topThree = entries.slice(0, 3);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-[#e5e5dd]">
				<Nav />
				<div className="flex items-center justify-center h-screen">
					<div className="text-2xl font-santoshi text-gray-700">Loading leaderboard...</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-[#e5e5dd]">
				<Nav />
				<div className="flex items-center justify-center h-screen">
					<div className="text-lg text-red-600 font-santoshi bg-white px-6 py-4 rounded-lg shadow-md">{error}</div>
				</div>
			</div>
		);
	}

	return (
		<div ref={containerRef} className="min-h-screen w-full bg-[#e5e5dd] text-black">
			<Nav />
			
			{/* Content */}
			<div className="container mx-auto px-4 py-24 max-w-6xl">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-5xl md:text-6xl font-bold font-final mb-4 text-[#111]">
						{formName}
					</h1>
					<div className="inline-block bg-white px-6 py-2 rounded-full shadow-sm border border-gray-300">
						<p className="text-lg text-gray-700 font-santoshi">
							{entries.length} Participants
						</p>
					</div>
				</div>

				{/* Top 3 Podium - Minimalistic */}
				{topThree.length > 0 && (
					<div className="mb-12">
						<div className="flex items-end justify-center gap-4 mb-8 max-w-3xl mx-auto">
							{/* 2nd Place */}
							{topThree[1] && (
								<div className="flex flex-col items-center w-40">
									<div className="bg-white w-full aspect-square rounded-lg shadow-md flex flex-col items-center justify-center p-4 border border-gray-200 hover:shadow-lg transition-shadow">
										<div className="text-3xl mb-2">🥈</div>
										<div className="text-2xl font-bold text-gray-800 mb-1">2nd</div>
										<div className="text-lg font-semibold text-gray-600">
											{topThree[1].score?.toFixed(1)}
										</div>
									</div>
									<div className="bg-white rounded-lg p-3 shadow-sm w-full border border-gray-200 mt-3">
										<h3 className="font-medium text-sm text-center truncate text-gray-800">
											{topThree[1].user_name || topThree[1].user_email}
										</h3>
									</div>
								</div>
							)}

							{/* 1st Place */}
							{topThree[0] && (
								<div className="flex flex-col items-center w-48 -mt-4">
									<div className="bg-white w-full aspect-square rounded-lg shadow-lg flex flex-col items-center justify-center p-5 border-2 border-gray-300">
										<div className="text-2xl mb-1">👑</div>
										<div className="text-4xl mb-2">🥇</div>
										<div className="text-3xl font-bold text-gray-800 mb-1">1st</div>
										<div className="text-xl font-semibold text-gray-600">
											{topThree[0].score?.toFixed(1)}
										</div>
									</div>
									<div className="bg-white rounded-lg p-4 shadow-md w-full border-2 border-gray-300 mt-3">
										<h3 className="font-semibold text-base text-center truncate text-gray-800">
											{topThree[0].user_name || topThree[0].user_email}
										</h3>
									</div>
								</div>
							)}

							{/* 3rd Place */}
							{topThree[2] && (
								<div className="flex flex-col items-center w-40">
									<div className="bg-white w-full aspect-square rounded-lg shadow-md flex flex-col items-center justify-center p-4 border border-gray-200 hover:shadow-lg transition-shadow">
										<div className="text-3xl mb-2">🥉</div>
										<div className="text-2xl font-bold text-gray-800 mb-1">3rd</div>
										<div className="text-lg font-semibold text-gray-600">
											{topThree[2].score?.toFixed(1)}
										</div>
									</div>
									<div className="bg-white rounded-lg p-3 shadow-sm w-full border border-gray-200 mt-3">
										<h3 className="font-medium text-sm text-center truncate text-gray-800">
											{topThree[2].user_name || topThree[2].user_email}
										</h3>
									</div>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Full Leaderboard Table - Minimalistic */}
				<div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
					<div className="bg-[#111] px-6 py-4 flex justify-between items-center">
						<h2 className="text-xl font-bold text-white font-santoshi">Complete Rankings</h2>
						<button
							onClick={() => fetchLeaderboard(true)}
							disabled={isRefreshing}
							className={`text-2xl hover:opacity-70 transition-opacity ${
								isRefreshing ? 'cursor-not-allowed' : 'cursor-pointer'
							}`}
							title="Reload leaderboard"
						>
							<span className={isRefreshing ? 'inline-block animate-spin' : ''}><IoReload className='text-white font-bold' /></span>
						</button>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50 border-b border-gray-200">
								<tr>
									<th className="px-6 py-3 text-left font-santoshi font-semibold text-gray-700 text-sm">Rank</th>
									<th className="px-6 py-3 text-left font-santoshi font-semibold text-gray-700 text-sm">Name</th>
									<th className="px-6 py-3 text-left font-santoshi font-semibold text-gray-700 text-sm">Email</th>
									<th className="px-6 py-3 text-right font-santoshi font-semibold text-gray-700 text-sm">Score</th>
								</tr>
							</thead>
							<tbody>
								{entries.map((entry, index) => {
									const isTopThree = index < 3;
									
									return (
										<tr
											key={entry.id}
											className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${isTopThree ? 'bg-gray-50/50' : 'bg-white'}`}
										>
											<td className="px-6 py-4 font-semibold text-lg text-gray-800">
												{isTopThree && (
													<span className="mr-2">
														{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
													</span>
												)}
												{entry.rank}
											</td>
											<td className="px-6 py-4 font-medium text-gray-800">
												{entry.user_name || 'N/A'}
											</td>
											<td className="px-6 py-4 text-gray-600 text-sm">
												{entry.user_email}
											</td>
											<td className="px-6 py-4 text-right font-bold text-lg text-gray-800">
												{entry.score?.toFixed(1)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>

				{entries.length === 0 && (
					<div className="text-center py-16">
						<div className="bg-white rounded-lg shadow-md p-10 max-w-md mx-auto border border-gray-200">
							<div className="text-5xl mb-4">🏆</div>
							<p className="text-lg text-gray-600 font-santoshi">
								No scores have been assigned yet. Check back later!
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
