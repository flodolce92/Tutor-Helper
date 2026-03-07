import type { LocationUser } from '../types/user';
import Bob from '/bob.webp';

interface OnlineUserCardProps {
	location: LocationUser;
	onClick?: () => void;
}

export const OnlineUserCard = ({ location, onClick }: OnlineUserCardProps) => {
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
			{location.user.image && (
				<img
					src={location.user.image.versions.medium ? location.user.image.versions.medium : Bob}
					alt={location.user.login}
					style={{
						width: '160px',
						height: '160px',
						borderRadius: '50%',
						objectFit: 'cover',
						border: '4px solid #333333',
					}}
				/>
			)}
			<h3
				style={{
					margin: '0',
					color: '#ffffff',
					fontSize: '18px',
					textAlign: 'center',
					width: '100%',
				}}>
				@{location.user.login}
			</h3>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					width: '100%',
					marginTop: 'auto',
					gap: '8px',
				}}>
				<p
					style={{
						margin: '0',
						fontSize: '13px',
						color: '#cccccc',
						display: 'flex',
						alignItems: 'center',
						gap: '4px',
					}}>
					<span>🖥️</span>
					<span>{location.host}</span>
				</p>
				<p
					style={{
						margin: '0',
						fontSize: '11px',
						color: '#999999',
						display: 'flex',
						alignItems: 'center',
						gap: '4px',
					}}>
					<span>🕒</span>
					<span>{new Date(location.begin_at).toLocaleTimeString()}</span>
				</p>
			</div>
		</div>
	);
};
