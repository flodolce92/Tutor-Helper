import { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';
import type { UserSearch as UserSearchType } from '../types/user';
import { UserCard } from '../components/UserCard';
import { UserModal } from '../components/UserModal';

const getCookie = (name: string): string => {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
	return '';
};

const setCookie = (name: string, value: string, days: number = 365) => {
	const expires = new Date();
	expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
	document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

export const FilterPage = () => {
	const [month, setMonth] = useState('');
	const [year, setYear] = useState('');
	const [results, setResults] = useState<UserSearchType[]>([]);
	const [loading, setLoading] = useState(false);
	const [searched, setSearched] = useState(false);
	const [selectedUser, setSelectedUser] = useState<UserSearchType | null>(null);

	useEffect(() => {
		const savedMonth = getCookie('filterMonth');
		const savedYear = getCookie('filterYear');
		if (savedMonth) setMonth(savedMonth);
		if (savedYear) setYear(savedYear);
	}, []);

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

		setCookie('filterMonth', month);
		setCookie('filterYear', year);

		setLoading(true);
		setSearched(true);
		try {
			const users = await apiService.getAllUsersByPool(month, year);
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
				onSubmit={handleFilter}
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
				<select
					value={month}
					onChange={(e) => setMonth(e.target.value)}
					style={{
						padding: '14px 18px',
						fontSize: '16px',
						minWidth: '180px',
						borderRadius: '8px',
						border: '2px solid #333333',
						backgroundColor: '#2a2a2a',
						color: '#ffffff',
						outline: 'none',
						transition: 'border-color 0.2s',
						cursor: 'pointer',
					}}
					onFocus={(e) => (e.target.style.borderColor = '#00babc')}
					onBlur={(e) => (e.target.style.borderColor = '#333333')}>
					<option value="">📅 Select Month</option>
					{months.map((m) => (
						<option key={m} value={m}>
							{m.charAt(0).toUpperCase() + m.slice(1)}
						</option>
					))}
				</select>
				<input
					type="text"
					value={year}
					onChange={(e) => setYear(e.target.value)}
					placeholder="📆 Year"
					style={{
						padding: '14px 18px',
						fontSize: '16px',
						width: '120px',
						minWidth: '70px',
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
					disabled={loading || !month || !year}
					style={{
						padding: '14px 32px',
						fontSize: '16px',
						fontWeight: '600',
						backgroundColor: loading || !month || !year ? '#666666' : '#00babc',
						color: 'white',
						border: 'none',
						borderRadius: '8px',
						cursor: loading || !month || !year ? 'not-allowed' : 'pointer',
						transition: 'all 0.2s',
						whiteSpace: 'nowrap',
					}}
					onMouseEnter={(e) => {
						if (!loading && month && year) {
							e.currentTarget.style.backgroundColor = '#00d4d6';
							e.currentTarget.style.transform = 'translateY(-2px)';
							e.currentTarget.style.boxShadow =
								'0 4px 12px rgba(0, 186, 188, 0.3)';
						}
					}}
					onMouseLeave={(e) => {
						if (!loading && month && year) {
							e.currentTarget.style.backgroundColor = '#00babc';
							e.currentTarget.style.transform = 'translateY(0)';
							e.currentTarget.style.boxShadow = 'none';
						}
					}}>
					{loading ? '🔍 Filtering...' : '🔍 Filter'}
				</button>
			</form>

			{searched && !loading && (
				<p style={{ marginBottom: '15px', color: '#cccccc' }}>
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
