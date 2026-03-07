import type { UserSearch } from '../types/user';
import Bob from '/bob.webp';

interface UserCardProps {
	user: UserSearch;
	onClick?: () => void;
}

export const UserCard = ({ user, onClick }: UserCardProps) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: '12px',
				padding: '20px',
				backgroundColor: '#1e1e1e',
				borderRadius: '12px',
				border: '1px solid #333333',
				cursor: onClick ? 'pointer' : 'default',
				transition: 'transform 0.2s, box-shadow 0.2s',
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.transform = 'translateY(-4px)';
				e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.transform = 'translateY(0)';
				e.currentTarget.style.boxShadow = 'none';
			}}
			onClick={onClick}>
			<img
				src={user.image.versions.medium ? user.image.versions.medium : Bob}
				alt={user.login}
				style={{
					width: '140px',
					height: '140px',
					borderRadius: '50%',
					objectFit: 'cover',
					border: '4px solid #333333',
				}}
			/>
			<div style={{ textAlign: 'center', width: '100%' }}>
				<h3
					style={{
						margin: '0 0 4px 0',
						color: '#ffffff',
						fontSize: '17px',
					}}>
					{user.usual_full_name}
				</h3>
				<p style={{ margin: '0 0 8px 0', color: '#999', fontSize: '14px' }}>
					{user.login}
				</p>
				<p
					style={{
						margin: '4px 0',
						fontSize: '13px',
						color: '#cccccc',
					}}>
					🎓 {user.pool_month} {user.pool_year}
				</p>
				{user.location && (
					<p
						style={{
							margin: '4px 0',
							fontSize: '13px',
							color: '#00babc',
						}}>
						📍 {user.location}
					</p>
				)}
			</div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					width: '100%',
					marginTop: 'auto',
					gap: '8px',
					paddingTop: '8px',
					borderTop: '1px solid #333333',
				}}>
				<p style={{ margin: '0', fontSize: '12px', color: '#cccccc' }}>
					⭐ {user.correction_point}
				</p>
				<p style={{ margin: '0', fontSize: '12px', color: '#cccccc' }}>
					💰 {user.wallet}
				</p>
			</div>
		</div>
	);
};
