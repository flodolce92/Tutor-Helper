import { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';
import type { LocationUser, UserSearch } from '../types/user';
import { OnlineUserCard } from '../components/OnlineUserCard';
import { UserModal } from '../components/UserModal';

export const OnlinePage = () => {
	const [locations, setLocations] = useState<LocationUser[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedUser, setSelectedUser] = useState<UserSearch | null>(null);

	const handleUserClick = (user: any) => {
		setSelectedUser(user as UserSearch);
	};

	useEffect(() => {
		const fetchLocations = async () => {
			try {
				const locs = await apiService.getLocations(30);
				locs.sort((a, b) => a.host.localeCompare(b.host, undefined, { numeric: true }));
				setLocations(locs);
			} catch (error) {
				console.error('Failed to fetch locations:', error);
				alert('Failed to load online students.');
			} finally {
				setLoading(false);
			}
		};

		fetchLocations();
	}, []);

	if (loading) {
		return (
			<div style={{ textAlign: 'center', marginTop: '100px' }}>
				<h2 style={{ color: '#ffffff' }}>Loading...</h2>
			</div>
		);
	}

	return (
		<div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
			<style>
				{`
					.online-grid {
						display: grid;
						grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
						gap: 20px;
					}
					@media (max-width: 768px) {
						.online-grid {
							grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
						}
					}
				`}
			</style>
			<p style={{ marginBottom: '15px', color: '#cccccc' }}>
				Found {locations.length} student{locations.length !== 1 ? 's' : ''}{' '}
				online
			</p>

			<div className="online-grid">
				{locations.map((loc) => (
					<OnlineUserCard
						key={loc.id}
						location={loc}
						onClick={() => handleUserClick(loc.user)}
					/>
				))}
			</div>
			<UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
		</div>
	);
};
