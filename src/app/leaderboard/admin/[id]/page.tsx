'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { IoReload } from "react-icons/io5";
import Nav from '@/components/Nav';
import { leaderboardService, LeaderboardEntry } from '@/lib/leaderboard';
import { useAuth } from '@/contexts/AuthContext';

interface Question {
	question_key: string;
	question_text: string;
	question_type: string;
	options?: string[];
}

export default function AdminLeaderboardPage() {
	const params = useParams();
	const router = useRouter();
	const { user, isLoading: authLoading } = useAuth();
	const formId = params.id as string;
	const containerRef = useRef<HTMLDivElement>(null);

	const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
	const [questions, setQuestions] = useState<Question[]>([]);
	const [formName, setFormName] = useState<string>('');
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [editingScores, setEditingScores] = useState<Record<string, string>>({});
	const [savingEntries, setSavingEntries] = useState<Set<string>>(new Set());
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	useEffect(() => {
		if (!authLoading) {
			if (!user) {
				router.push('/login');
			} else {
				fetchAdminLeaderboard();
				
				// Auto-reload every 5 seconds
				const interval = setInterval(() => {
					fetchAdminLeaderboard(true);
				}, 5000);

				return () => clearInterval(interval);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authLoading, user, formId]);

	const fetchAdminLeaderboard = async (isManualRefresh = false) => {
		try {
			if (isManualRefresh) {
				setIsRefreshing(true);
			} else {
				setIsLoading(true);
			}
			const data = await leaderboardService.getAdminLeaderboard(formId);
			setEntries(data.entries);
			setFormName(data.form_name);
			setQuestions(data.questions);
			
			// Initialize editing scores with current values
			const initialScores: Record<string, string> = {};
			data.entries.forEach(entry => {
				initialScores[entry.id] = entry.score?.toString() || '';
			});
			setEditingScores(initialScores);
			setError(null);
		} catch (err) {
			setError((err as Error).message || 'Failed to load admin leaderboard');
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	};

	const handleScoreChange = (entryId: string, value: string) => {
		setEditingScores(prev => ({
			...prev,
			[entryId]: value
		}));
	};

	const handleSaveScore = async (entryId: string) => {
		const scoreValue = editingScores[entryId];
		if (!scoreValue || scoreValue.trim() === '') {
			alert('Please enter a valid score');
			return;
		}

		const score = parseFloat(scoreValue);
		if (isNaN(score)) {
			alert('Score must be a number');
			return;
		}

		try {
			setSavingEntries(prev => new Set(prev).add(entryId));
			await leaderboardService.updateScore(formId, entryId, score);
			
			// Update the entry in the local state
			setEntries(prev => prev.map(entry => 
				entry.id === entryId ? { ...entry, score } : entry
			));

			// Show success message
			setSuccessMessage(`Score updated successfully!`);
			setTimeout(() => setSuccessMessage(null), 3000);
		} catch (err) {
			alert((err as Error).message || 'Failed to update score');
		} finally {
			setSavingEntries(prev => {
				const newSet = new Set(prev);
				newSet.delete(entryId);
				return newSet;
			});
		}
	};

	if (authLoading || isLoading) {
		return (
			<div className="min-h-screen bg-[#e5e5dd]">
				<Nav />
				<div className="flex items-center justify-center h-screen">
					<div className="text-3xl font-final animate-pulse text-gray-800">Loading admin panel...</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-[#e5e5dd]">
				<Nav />
				<div className="flex items-center justify-center h-screen">
					<div className="text-xl text-red-600 font-santoshi bg-white px-8 py-6 rounded-2xl shadow-lg">{error}</div>
				</div>
			</div>
		);
	}

	return (
		<div ref={containerRef} className="min-h-screen w-full bg-[#e5e5dd] text-black font-sans">
			<Nav />

			{/* Success Message Toast */}
			{successMessage && (
				<div className="fixed top-24 right-8 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg">
					<div className="flex items-center gap-3">
						<div className="text-2xl">✓</div>
						<div className="font-santoshi font-semibold">{successMessage}</div>
					</div>
				</div>
			)}
			
			{/* Content */}
			<div className="container mx-auto px-4 py-24">
				{/* Header */}
				<div className="mb-12">
					<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
						<div>
							<div className="flex items-center gap-4 mb-4">
								<h1 className="text-5xl md:text-6xl font-bold font-final text-gray-800">
									{formName}
								</h1>
							</div>
						</div>
						<button
							onClick={() => router.push(`/leaderboard/${formId}`)}
							className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300 font-santoshi font-bold text-lg shadow-md hover:shadow-lg"
						>
							👁️ View Public Leaderboard
						</button>
					</div>
					<div className="bg-white px-6 py-4 rounded-2xl shadow-md inline-block border border-gray-200">
						<p className="text-gray-700 font-santoshi font-medium text-lg">
							📊 Total Submissions: <span className="font-bold text-blue-600">{entries.length}</span>
						</p>
					</div>
				</div>

				{/* Entries Table */}
				<div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
					<div className="bg-gray-800 px-8 py-6 flex justify-between items-center">
						<h2 className="text-3xl font-bold text-white font-final">Manage Scores</h2>
						<button
							onClick={() => fetchAdminLeaderboard(true)}
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
							<thead className="bg-gray-50 border-b-2 border-gray-200">
								<tr>
									<th className="px-4 py-5 text-left font-santoshi font-bold text-gray-800 text-base sticky left-0 bg-gray-50">
										Name
									</th>
									<th className="px-4 py-5 text-left font-santoshi font-bold text-gray-800 text-base">Email</th>
									<th className="px-4 py-5 text-left font-santoshi font-bold text-gray-800 text-base">Submitted</th>
									{questions.map(q => (
										<th key={q.question_key} className="px-4 py-5 text-left font-santoshi font-bold text-gray-800 text-sm min-w-[150px]">
											{q.question_text}
										</th>
									))}
									<th className="px-4 py-5 text-left font-santoshi font-bold text-gray-800 text-base">Score</th>
									<th className="px-4 py-5 text-left font-santoshi font-bold text-gray-800 text-base">Action</th>
								</tr>
							</thead>
							<tbody>
								{entries.map((entry, index) => (
									<tr
										key={entry.id}
										className={`${
											index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
										} border-b border-gray-200 hover:bg-gray-100 transition-colors duration-200`}
									>
										<td className="px-4 py-5 font-medium text-gray-900 sticky left-0 bg-inherit">
											<div className="flex items-center gap-2">
												<div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
													{(entry.user_name || entry.user_email).charAt(0).toUpperCase()}
												</div>
												{entry.user_name || 'N/A'}
											</div>
										</td>
										<td className="px-4 py-5 text-gray-600 text-sm">
											{entry.user_email}
										</td>
										<td className="px-4 py-5 text-sm text-gray-500">
											{new Date(entry.submitted_at).toLocaleString()}
										</td>
										{questions.map(q => (
											<td key={q.question_key} className="px-4 py-5 text-sm text-gray-700">
												<div className="max-w-xs truncate" title={entry.responses[q.question_key] || 'N/A'}>
													{entry.responses[q.question_key] || 'N/A'}
												</div>
											</td>
										))}
										<td className="px-4 py-5">
											<input
												type="number"
												step="0.1"
												value={editingScores[entry.id] || ''}
												onChange={(e) => handleScoreChange(entry.id, e.target.value)}
												className="w-28 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold text-center"
												placeholder="0.0"
											/>
										</td>
										<td className="px-4 py-5">
											<button
												onClick={() => handleSaveScore(entry.id)}
												disabled={savingEntries.has(entry.id)}
												className={`px-6 py-3 rounded-xl font-santoshi font-bold transition-all duration-300 shadow-md ${
													savingEntries.has(entry.id)
														? 'bg-gray-400 cursor-not-allowed'
														: 'bg-green-500 hover:bg-green-600'
												} text-white`}
											>
												{savingEntries.has(entry.id) ? '💾 Saving...' : '✓ Save'}
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{entries.length === 0 && (
					<div className="text-center py-20">
						<div className="bg-white rounded-2xl shadow-lg p-12 max-w-2xl mx-auto border border-gray-200">
							<div className="text-7xl mb-6">📋</div>
							<p className="text-2xl text-gray-600 font-santoshi">
								No submissions yet.
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
