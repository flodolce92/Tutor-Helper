import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { User42 } from '../types/auth';
import { authService } from '../services/auth.service';
import { apiService } from '../services/api.service';

interface AuthState {
	user: User42 | null;
	loading: boolean;
	isAuthenticated: boolean;
}

const createAuthStore = () => {
	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		loading: true,
		isAuthenticated: false,
	});

	const initAuth = async () => {
		if (!browser) {
			update(state => ({ ...state, loading: false }));
			return;
		}

		if (authService.isAuthenticated()) {
			try {
				const userData = await authService.getCurrentUser();
				update(state => ({
					...state,
					user: userData,
					isAuthenticated: true,
					loading: false,
				}));
				if (userData.campus && userData.campus.length > 0) {
					apiService.setCampusId(userData.campus[0].id);
				}
			} catch (error) {
				console.error('Failed to get user:', error);
				authService.logout();
				update(state => ({ ...state, loading: false }));
			}
		} else {
			update(state => ({ ...state, loading: false }));
		}
	};

	const login = () => {
		const authUrl = authService.getAuthUrl();
		window.location.href = authUrl;
	};

	const logout = () => {
		authService.logout();
		apiService.resetCampusId();
		update(state => ({
			...state,
			user: null,
			isAuthenticated: false,
		}));
	};

	return {
		subscribe,
		initAuth,
		login,
		logout,
		set,
	};
};

export const authStore = createAuthStore();
