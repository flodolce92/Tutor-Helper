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
					// Force a full page reload to refresh the AuthContext
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
		<div style={{ textAlign: 'center', marginTop: '50px' }}>
			<h2 style={{ color: '#ffffff' }}>Authenticating...</h2>
			<p style={{ color: '#cccccc' }}>Please wait while we log you in.</p>
		</div>
	);
};
