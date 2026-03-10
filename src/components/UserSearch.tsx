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
		setResults([]);
		try {
			const users = await apiService.searchUsers(
				query,
				1,
				20,
				(partialUsers) => {
					// Update results as they come in
					setResults(partialUsers);
				},
			);
			// Set final results with all three searches
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
			<style>
				{`
					.user-grid {
						display: grid;
						grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
						gap: 20px;
					}
					@media (max-width: 768px) {
						.user-grid {
							grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
						}
					}
				`}
			</style>
			<form
				onSubmit={handleSearch}
				style={{
					marginBottom: '30px',
					display: 'flex',
					flexWrap: 'wrap',
					gap: '12px',
					alignItems: 'stretch',
					backgroundColor: '#1e1e1e',
					padding: '20px',
					borderRadius: '12px',
					border: '1px solid #333333',
				}}>
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search by login or name..."
					style={{
						padding: '14px 18px',
						fontSize: '16px',
						flex: '1',
						minWidth: '250px',
						borderRadius: '8px',
						border: '2px solid #333333',
						backgroundColor: '#2a2a2a',
						color: '#ffffff',
						outline: 'none',
						transition: 'border-color 0.2s',
					}}
					onFocus={(e) => (e.target.style.borderColor = '#00babc')}
					onBlur={(e) => (e.target.style.borderColor = '#333333')}
				/>
				<button
					type="submit"
					disabled={loading || !query.trim()}
					style={{
						padding: '14px 32px',
						fontSize: '16px',
						fontWeight: '600',
						backgroundColor: loading || !query.trim() ? '#666666' : '#00babc',
						color: 'white',
						border: 'none',
						borderRadius: '8px',
						cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
						transition: 'all 0.2s',
						whiteSpace: 'nowrap',
					}}
					onMouseEnter={(e) => {
						if (!loading && query.trim()) {
							e.currentTarget.style.backgroundColor = '#00d4d6';
							e.currentTarget.style.transform = 'translateY(-2px)';
							e.currentTarget.style.boxShadow =
								'0 4px 12px rgba(0, 186, 188, 0.3)';
						}
					}}
					onMouseLeave={(e) => {
						if (!loading && query.trim()) {
							e.currentTarget.style.backgroundColor = '#00babc';
							e.currentTarget.style.transform = 'translateY(0)';
							e.currentTarget.style.boxShadow = 'none';
						}
					}}>
					{loading ? '🔍 Searching...' : '🔍 Search'}
				</button>
			</form>

			{searched && !loading && (
				<p style={{ marginBottom: '15px' }}>
					Found {results.length} student{results.length !== 1 ? 's' : ''}
				</p>
			)}

			<div className="user-grid">
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
