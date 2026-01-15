import type { LocationUser } from '../types/user';

interface OnlineUserCardProps {
	location: LocationUser;
	onClick?: () => void;
}

export const OnlineUserCard = ({ location, onClick }: OnlineUserCardProps) => {
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
			<div style={{ flex: 1 }}>
				<h3 style={{ margin: '0 0 5px 0', color: '#ffffff' }}>
					@{location.user.login}
				</h3>
				<p style={{ margin: '3px 0', fontSize: '14px', color: '#cccccc' }}>
					🖥️ {location.host}
				</p>
				<p style={{ margin: '3px 0', fontSize: '14px', color: '#cccccc' }}>
					🕒 Logged in: {new Date(location.begin_at).toLocaleString()}
				</p>
			</div>
		</div>
	);
};
