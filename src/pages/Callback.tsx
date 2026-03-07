import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

export const Callback = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const handleCallback = async () => {
			const params = new URLSearchParams(window.location.search);
			const code = params.get('code');

			if (code) {
				try {
					await authService.getAccessToken(code);
					window.location.href = '/';
				} catch (error) {
					console.error('Authentication failed:', error);
					navigate('/');
				}
			}
		};

		handleCallback();
	}, [navigate]);

	return (
		<div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '80vh',
				}}>
				<div
					style={{
						textAlign: 'center',
						padding: '60px 80px',
						backgroundColor: '#1e1e1e',
						borderRadius: '16px',
						border: '1px solid #333333',
						maxWidth: '600px',
						width: '100%',
					}}>
					<div
						style={{
							width: '80px',
							height: '80px',
							margin: '0 auto 30px',
							border: '4px solid #00babc',
							borderTopColor: 'transparent',
							borderRadius: '50%',
							animation: 'spin 1s linear infinite',
						}}
					/>
					<style>
						{`
							@keyframes spin {
								0% { transform: rotate(0deg); }
								100% { transform: rotate(360deg); }
							}
						`}
					</style>
					<h2
						style={{
							fontSize: '32px',
							margin: '0 0 16px 0',
							color: '#ffffff',
							fontWeight: '700',
						}}>
						🔐 Authenticating...
					</h2>
					<p
						style={{
							fontSize: '18px',
							color: '#cccccc',
							lineHeight: '1.6',
							margin: 0,
						}}>
						Please wait while we securely log you in with 42.
					</p>
				</div>
			</div>
		</div>
	);
};
