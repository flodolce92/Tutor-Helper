import axios from 'axios';
import type { TokenResponse, User42 } from '../types/auth';

const API_BASE = 'https://api.intra.42.fr';
const CLIENT_ID = import.meta.env.VITE_42_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_42_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_42_REDIRECT_URI;

class AuthService {
	private tokenKey = '42_access_token';
	private refreshTokenKey = '42_refresh_token';
	private tokenExpiryKey = '42_token_expiry';

	// Generate the OAuth URL to redirect user to 42 login
	getAuthUrl(): string {
		const params = new URLSearchParams({
			client_id: CLIENT_ID,
			redirect_uri: REDIRECT_URI,
			response_type: 'code',
			scope: 'public',
		});
		return `${API_BASE}/oauth/authorize?${params.toString()}`;
	}

	// Exchange authorization code for access token
	async getAccessToken(code: string): Promise<TokenResponse> {
		const response = await axios.post<TokenResponse>(
			`${API_BASE}/oauth/token`,
			{
				grant_type: 'authorization_code',
				client_id: CLIENT_ID,
				client_secret: CLIENT_SECRET,
				code,
				redirect_uri: REDIRECT_URI,
			}
		);

		this.saveToken(response.data);
		return response.data;
	}

	// Save token to localStorage
	private saveToken(tokenData: TokenResponse): void {
		localStorage.setItem(this.tokenKey, tokenData.access_token);
		localStorage.setItem(this.refreshTokenKey, tokenData.refresh_token);

		// Calculate expiry time (current time + expires_in seconds)
		const expiryTime = Date.now() + tokenData.expires_in * 1000;
		localStorage.setItem(this.tokenExpiryKey, expiryTime.toString());
	}

	// Get stored access token
	getStoredToken(): string | null {
		return localStorage.getItem(this.tokenKey);
	}

	// Check if user is authenticated
	isAuthenticated(): boolean {
		const token = this.getStoredToken();
		const expiry = localStorage.getItem(this.tokenExpiryKey);

		if (!token || !expiry) return false;

		// Check if token is expired
		return Date.now() < parseInt(expiry);
	}

	// Logout - clear tokens
	logout(): void {
		localStorage.removeItem(this.tokenKey);
		localStorage.removeItem(this.refreshTokenKey);
		localStorage.removeItem(this.tokenExpiryKey);
	}

	// Get current user info
	async getCurrentUser(): Promise<User42> {
		const token = this.getStoredToken();
		const response = await axios.get<User42>(`${API_BASE}/v2/me`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	}
}

export const authService = new AuthService();
