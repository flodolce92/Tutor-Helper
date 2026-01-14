import { useAuth } from '../contexts/AuthContext';
import { UserSearch } from '../components/UserSearch';

export const Home = () => {
	const { user, login, logout, isAuthenticated, loading } = useAuth();

	if (loading) {
		return (
			<div style={{ textAlign: 'center', marginTop: '100px' }}>
				<h2>Loading...</h2>
			</div>
		);
	}

	if (!isAuthenticated) {
		return (
			<div style={{ textAlign: 'center', marginTop: '100px' }}>
				<h1>Welcome to 42 Student Finder</h1>
				<p>Login with your 42 account to get started</p>
				<button
					onClick={login}
					style={{
						padding: '12px 24px',
						fontSize: '16px',
						backgroundColor: '#00babc',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
						marginTop: '20px',
					}}>
					Login with 42
				</button>
			</div>
		);
	}

	return (
		<div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '30px',
				}}>
				<h1>Hello, {user?.displayname}!</h1>
				<button
					onClick={logout}
					style={{
						padding: '8px 16px',
						backgroundColor: '#dc3545',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
					}}>
					Logout
				</button>
			</div>

			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: '20px',
					padding: '20px',
					backgroundColor: '#f5f5f5',
					borderRadius: '8px',
					marginBottom: '30px',
				}}>
				<img
					src={user?.image.versions.medium}
					alt={user?.login}
					style={{ width: '100px', height: '100px', borderRadius: '50%' }}
				/>
				<div>
					<h2 style={{ margin: '0 0 10px 0' }}>{user?.usual_full_name}</h2>
					<p style={{ margin: '3px 0' }}>Login: {user?.login}</p>
					<p style={{ margin: '3px 0' }}>
						Pool: {user?.pool_month} {user?.pool_year}
					</p>
					<p style={{ margin: '3px 0' }}>
						Correction Points: {user?.correction_point}
					</p>
					{user?.location && (
						<p style={{ margin: '3px 0' }}>📍 Location: {user.location}</p>
					)}
				</div>
			</div>

			<UserSearch />
		</div>
	);
};
