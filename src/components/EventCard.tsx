import type { Event } from '../types/event';

interface EventCardProps {
	event: Event;
	onClick?: () => void;
}

export const EventCard = ({ event, onClick }: EventCardProps) => {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('it-IT', {
			weekday: 'long',
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		});
	};

	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString('it-IT', {
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const getKindColor = (kind: string) => {
		switch (kind.toLowerCase()) {
			case 'workshop':
				return '#4a9eff';
			case 'conference':
				return '#9b59b6';
			case 'hackathon':
				return '#5cb85c';
			case 'association':
				return '#f39c12';
			case 'exam':
				return '#e74c3c';
			default:
				return '#333333';
		}
	};

	const spotsLeft = event.max_people
		? event.max_people - event.nbr_subscribers
		: null;

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '12px',
				padding: '20px',
				backgroundColor: '#1e1e1e',
				borderRadius: '12px',
				border: `2px solid ${getKindColor(event.kind)}`,
				cursor: onClick ? 'pointer' : 'default',
				transition: 'transform 0.2s, box-shadow 0.2s',
				minHeight: '200px',
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
			<h3
				style={{
					margin: '0',
					color: '#ffffff',
					fontSize: '18px',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
				}}>
				{event.name}
			</h3>

			<p
				style={{
					margin: '0',
					fontSize: '14px',
					color: '#cccccc',
					flex: 1,
					overflow: 'hidden',
					display: '-webkit-box',
					WebkitLineClamp: 2,
					WebkitBoxOrient: 'vertical',
					lineHeight: '1.4',
				}}>
				{event.description}
			</p>

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
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
					<span>📍</span>
					<span>{event.location}</span>
				</p>

				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						gap: '8px',
					}}>
					<p
						style={{
							margin: '0',
							fontSize: '11px',
							color: '#999999',
							display: 'flex',
							alignItems: 'center',
							gap: '4px',
						}}>
						<span>📅</span>
						<span>{formatDate(event.begin_at)}</span>
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
						<span>{formatTime(event.begin_at)}</span>
					</p>
				</div>

				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						gap: '8px',
					}}>
					<p
						style={{
							margin: '0',
							fontSize: '12px',
							color: '#4a9eff',
							display: 'flex',
							alignItems: 'center',
							gap: '4px',
						}}>
						<span>👥</span>
						<span>
							{event.nbr_subscribers} iscritt
							{event.nbr_subscribers !== 1 ? 'i' : 'o'}
						</span>
					</p>
					{spotsLeft !== null && (
						<p
							style={{
								margin: '0',
								fontSize: '11px',
								color: spotsLeft > 0 ? '#5cb85c' : '#d9534f',
								display: 'flex',
								alignItems: 'center',
								gap: '4px',
							}}>
							{spotsLeft > 0 ? `${spotsLeft} posti` : 'Completo'}
						</p>
					)}
				</div>
			</div>
		</div>
	);
};
