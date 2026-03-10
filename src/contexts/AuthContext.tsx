import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from 'react';
import type { User42 } from '../types/auth';
import { authService } from '../services/auth.service';
import { apiService } from '../services/api.service';

interface AuthContextType {
	user: User42 | null;
	loading: boolean;
	login: () => void;
	logout: () => void;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User42 | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check if user is authenticated on mount
		const initAuth = async () => {
			if (authService.isAuthenticated()) {
				try {
					const userData = await authService.getCurrentUser();
					setUser(userData);
					if (userData.campus && userData.campus.length > 0) {
						apiService.setCampusId(userData.campus[0].id);
					}
				} catch (error) {
					console.error('Failed to get user:', error);
					authService.logout();
				}
			}
			setLoading(false);
		};

		initAuth();
	}, []);

	const login = () => {
		const authUrl = authService.getAuthUrl();
		window.location.href = authUrl;
	};

	const logout = () => {
		authService.logout();
		apiService.resetCampusId();
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				login,
				logout,
				isAuthenticated: !!user,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
