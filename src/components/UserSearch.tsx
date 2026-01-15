import { useState } from 'react';
import { apiService } from '../services/api.service';
import type { UserSearch as UserSearchType } from '../types/user';
import { UserCard } from './UserCard';
import { UserModal } from './UserModal';

export const UserSearch = () => {
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<UserSearchType[]>([]);
	const [loading, setLoading] = useState(false);
	const [searched, setSearched] = useState(false);
	const [selectedUser, setSelectedUser] = useState<UserSearchType | null>(null);

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!query.trim()) return;

		setLoading(true);
		setSearched(true);
		try {
			const users = await apiService.searchUsers(query);
			setResults(users);
		} catch (error) {
			console.error('Search failed:', error);
			alert('Search failed. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{ marginTop: '30px' }}>
			<form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search by login or name..."
					style={{
						padding: '10px',
						fontSize: '16px',
						width: '100%',
						maxWidth: '400px',
						borderRadius: '4px',
						border: '1px solid #333333',
						backgroundColor: '#2a2a2a',
						color: '#ffffff',
					}}
				/>
				<button
					type="submit"
					disabled={loading}
					style={{
						padding: '10px 20px',
						fontSize: '16px',
						marginLeft: '10px',
						backgroundColor: '#00babc',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: loading ? 'not-allowed' : 'pointer',
					}}>
					{loading ? 'Searching...' : 'Search'}
				</button>
			</form>

			{searched && !loading && (
				<p style={{ marginBottom: '15px' }}>
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
