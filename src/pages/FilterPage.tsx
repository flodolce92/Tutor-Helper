import { useState } from 'react';
import { apiService } from '../services/api.service';
import type { UserSearch as UserSearchType } from '../types/user';
import { UserCard } from '../components/UserCard';
import { UserModal } from '../components/UserModal';

export const FilterPage = () => {
	const [month, setMonth] = useState('');
	const [year, setYear] = useState('');
	const [results, setResults] = useState<UserSearchType[]>([]);
	const [loading, setLoading] = useState(false);
	const [searched, setSearched] = useState(false);
	const [selectedUser, setSelectedUser] = useState<UserSearchType | null>(null);

	const months = [
		'january',
		'february',
		'march',
		'april',
		'may',
		'june',
		'july',
		'august',
		'september',
		'october',
		'november',
		'december',
	];

	const handleFilter = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!month || !year) return;

		setLoading(true);
		setSearched(true);
		try {
			const users = await apiService.getUsersByPool(month, year);
			setResults(users);
		} catch (error) {
			console.error('Filter failed:', error);
			alert('Filter failed. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
			<form onSubmit={handleFilter} style={{ marginBottom: '20px' }}>
				<select
					value={month}
					onChange={(e) => setMonth(e.target.value)}
					style={{
						padding: '10px',
						fontSize: '16px',
						marginRight: '10px',
						borderRadius: '4px',
						border: '1px solid #333333',
						backgroundColor: '#2a2a2a',
						color: '#ffffff',
					}}>
					<option value="">Select Month</option>
					{months.map((m) => (
						<option key={m} value={m}>
							{m}
						</option>
					))}
				</select>
				<input
					type="text"
					value={year}
					onChange={(e) => setYear(e.target.value)}
					placeholder="Year (e.g., 2023)"
					style={{
						padding: '10px',
						fontSize: '16px',
						width: '150px',
						marginRight: '10px',
						borderRadius: '4px',
						border: '1px solid #333333',
						backgroundColor: '#2a2a2a',
						color: '#ffffff',
					}}
				/>
				<button
					type="submit"
					disabled={loading || !month || !year}
					style={{
						padding: '10px 20px',
						fontSize: '16px',
						backgroundColor: '#00babc',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: loading ? 'not-allowed' : 'pointer',
					}}>
					{loading ? 'Filtering...' : 'Filter'}
				</button>
			</form>

			{searched && !loading && (
				<p style={{ marginBottom: '15px', color: '#cccccc' }}>
					Found {results.length} student{results.length !== 1 ? 's' : ''}
				</p>
			)}

			<div style={{ display: 'grid', gap: '15px' }}>
				{results.map((user) => (
					<UserCard
						key={user.id}
						user={user}
						onClick={() => setSelectedUser(user)}
					/>
				))}
			</div>
			<UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
		</div>
	);
};
