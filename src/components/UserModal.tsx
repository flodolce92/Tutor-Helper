import type { UserSearch } from '../types/user';

interface UserModalProps {
	user: UserSearch | null;
	onClose: () => void;
}

export const UserModal = ({ user, onClose }: UserModalProps) => {
	if (!user) return null;

	return (
		<div
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: 'rgba(0, 0, 0, 0.8)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: 1000,
			}}
			onClick={onClose}>
			<div
				style={{
					backgroundColor: '#1e1e1e',
					padding: '20px',
					borderRadius: '8px',
					border: '1px solid #333333',
					maxWidth: '500px',
					maxHeight: '80vh',
					overflowY: 'auto',
					color: '#ffffff',
				}}
				onClick={(e) => e.stopPropagation()}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: '20px',
					}}>
					<h2 style={{ margin: 0, color: '#ffffff' }}>
						{user.usual_full_name}
					</h2>
					<button
						onClick={onClose}
						style={{
							background: 'none',
							border: 'none',
							color: '#ffffff',
							fontSize: '20px',
							cursor: 'pointer',
						}}>
						×
					</button>
				</div>
				<img
					src={user.image.versions.medium}
					alt={user.login}
					style={{
						width: '100px',
						height: '100px',
						borderRadius: '50%',
						marginBottom: '20px',
					}}
				/>
				<div style={{ lineHeight: '1.6' }}>
					<p>
						<strong>Login:</strong> @{user.login}
					</p>
					<p>
						<strong>Email:</strong> {user.email}
					</p>
					<p>
						<strong>Phone:</strong> {user.phone || 'N/A'}
					</p>
					<p>
						<strong>Pool:</strong> {user.pool_month} {user.pool_year}
					</p>
					<p>
						<strong>Location:</strong> {user.location || 'Offline'}
					</p>
					<p>
						<strong>Correction Points:</strong> {user.correction_point}
					</p>
					<p>
						<strong>Wallet:</strong> {user.wallet}€
					</p>
				</div>
			</div>
		</div>
	);
};
