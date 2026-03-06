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
				backgroundColor: 'rgba(0, 0, 0, 0.85)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: 1000,
				padding: '20px',
				backdropFilter: 'blur(4px)',
			}}
			onClick={onClose}>
			<div
				style={{
					backgroundColor: '#1e1e1e',
					padding: '30px',
					borderRadius: '16px',
					border: '2px solid #333333',
					maxWidth: '550px',
					width: '100%',
					maxHeight: '85vh',
					overflowY: 'auto',
					color: '#ffffff',
					position: 'relative',
					boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
				}}
				onClick={(e) => e.stopPropagation()}>
				<button
					onClick={onClose}
					style={{
						position: 'absolute',
						top: '20px',
						right: '20px',
						background: '#333333',
						border: 'none',
						color: '#ffffff',
						width: '36px',
						height: '36px',
						borderRadius: '50%',
						padding: 0,
						fontSize: '24px',
						cursor: 'pointer',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						transition: 'all 0.2s',
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.backgroundColor = '#dc3545';
						e.currentTarget.style.transform = 'rotate(90deg)';
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.backgroundColor = '#333333';
						e.currentTarget.style.transform = 'rotate(0deg)';
					}}>
					×
				</button>

				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						marginBottom: '25px',
					}}>
					<img
						src={user.image.versions.large}
						alt={user.login}
						style={{
							width: '300px',
							height: '300px',
							borderRadius: '50%',
							objectFit: 'cover',
							border: '4px solid #00babc',
							marginBottom: '15px',
							boxShadow: '0 4px 12px rgba(0, 186, 188, 0.3)',
						}}
					/>
					<h2
						style={{
							margin: '0 0 6px 0',
							color: '#ffffff',
							fontSize: '26px',
							fontWeight: '700',
							textAlign: 'center',
						}}>
						{user.usual_full_name}
					</h2>
					<p
						style={{
							margin: 0,
							color: '#999',
							fontSize: '16px',
							textAlign: 'center',
						}}>
						@{user.login}
					</p>
				</div>

				<div
					style={{
						display: 'grid',
						gap: '12px',
					}}>
					<div
						style={{
							padding: '14px',
							backgroundColor: '#2a2a2a',
							borderRadius: '10px',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}>
						<span style={{ color: '#999', fontSize: '14px' }}>📧 Email</span>
						<span
							style={{
								color: '#ffffff',
								fontSize: '14px',
								fontWeight: '500',
								textAlign: 'right',
							}}>
							{user.email}
						</span>
					</div>

					<div
						style={{
							padding: '14px',
							backgroundColor: '#2a2a2a',
							borderRadius: '10px',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}>
						<span style={{ color: '#999', fontSize: '14px' }}>📱 Phone</span>
						<span
							style={{
								color: '#ffffff',
								fontSize: '14px',
								fontWeight: '500',
							}}>
							{user.phone || 'N/A'}
						</span>
					</div>

					<div
						style={{
							padding: '14px',
							backgroundColor: '#2a2a2a',
							borderRadius: '10px',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}>
						<span style={{ color: '#999', fontSize: '14px' }}>🏊 Pool</span>
						<span
							style={{
								color: '#ffffff',
								fontSize: '14px',
								fontWeight: '500',
								textTransform: 'capitalize',
							}}>
							{user.pool_month} {user.pool_year}
						</span>
					</div>

					<div
						style={{
							padding: '14px',
							backgroundColor: user.location
								? 'rgba(0, 186, 188, 0.1)'
								: '#2a2a2a',
							borderRadius: '10px',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							border: user.location
								? '1px solid rgba(0, 186, 188, 0.3)'
								: 'none',
						}}>
						<span
							style={{
								color: user.location ? '#00babc' : '#999',
								fontSize: '14px',
							}}>
							📍 Location
						</span>
						<span
							style={{
								color: user.location ? '#00babc' : '#ffffff',
								fontSize: '14px',
								fontWeight: '500',
							}}>
							{user.location || 'Offline'}
						</span>
					</div>

					<div
						style={{
							display: 'grid',
							gridTemplateColumns: '1fr 1fr',
							gap: '12px',
						}}>
						<div
							style={{
								padding: '14px',
								backgroundColor: '#2a2a2a',
								borderRadius: '10px',
								textAlign: 'center',
							}}>
							<p
								style={{
									margin: '0 0 6px 0',
									color: '#999',
									fontSize: '13px',
								}}>
								⭐ Correction Points
							</p>
							<p
								style={{
									margin: 0,
									color: '#ffffff',
									fontSize: '20px',
									fontWeight: '700',
								}}>
								{user.correction_point}
							</p>
						</div>

						<div
							style={{
								padding: '14px',
								backgroundColor: '#2a2a2a',
								borderRadius: '10px',
								textAlign: 'center',
							}}>
							<p
								style={{
									margin: '0 0 6px 0',
									color: '#999',
									fontSize: '13px',
								}}>
								💰 Wallet
							</p>
							<p
								style={{
									margin: 0,
									color: '#ffffff',
									fontSize: '20px',
									fontWeight: '700',
								}}>
								{user.wallet}€
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
