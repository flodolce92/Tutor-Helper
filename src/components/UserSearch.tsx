import { useState } from 'react';
import { apiService } from '../services/api.service';
import type { UserSearch as UserSearchType } from '../types/user';

export const UserSearch = () => {
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<UserSearchType[]>([]);
	const [loading, setLoading] = useState(false);
	const [searched, setSearched] = useState(false);

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
			<h2>Search Students</h2>
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
					<div
						key={user.id}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '15px',
							padding: '15px',
							backgroundColor: '#1e1e1e',
							borderRadius: '8px',
							border: '1px solid #333333',
						}}>
						<img
							src={user.image.versions.small}
							alt={user.login}
							style={{ width: '60px', height: '60px', borderRadius: '50%' }}
						/>
						<div style={{ flex: 1 }}>
							<h3 style={{ margin: '0 0 5px 0', color: '#ffffff' }}>
								{user.usual_full_name}
							</h3>
							<p style={{ margin: '3px 0', color: '#cccccc' }}>@{user.login}</p>
							<p
								style={{ margin: '3px 0', fontSize: '14px', color: '#cccccc' }}>
								Pool: {user.pool_month} {user.pool_year}
							</p>
							{user.location && (
								<p
									style={{
										margin: '3px 0',
										fontSize: '14px',
										color: '#00babc',
									}}>
									📍 {user.location}
								</p>
							)}
						</div>
						<div style={{ textAlign: 'right' }}>
							<p
								style={{ margin: '3px 0', fontSize: '14px', color: '#cccccc' }}>
								⭐ {user.correction_point} pts
							</p>
							<p
								style={{ margin: '3px 0', fontSize: '14px', color: '#cccccc' }}>
								💰 {user.wallet}€
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
