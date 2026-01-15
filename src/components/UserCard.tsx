import type { UserSearch } from '../types/user';

interface UserCardProps {
	user: UserSearch;
	onClick?: () => void;
}

export const UserCard = ({ user, onClick }: UserCardProps) => {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: '15px',
				padding: '15px',
				backgroundColor: '#1e1e1e',
				borderRadius: '8px',
				border: '1px solid #333333',
				cursor: onClick ? 'pointer' : 'default',
			}}
			onClick={onClick}>
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
				<p style={{ margin: '3px 0', fontSize: '14px', color: '#cccccc' }}>
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
				<p style={{ margin: '3px 0', fontSize: '14px', color: '#cccccc' }}>
					⭐ {user.correction_point} pts
				</p>
				<p style={{ margin: '3px 0', fontSize: '14px', color: '#cccccc' }}>
					💰 {user.wallet}€
				</p>
			</div>
		</div>
	);
};
