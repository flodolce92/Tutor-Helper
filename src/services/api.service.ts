import axios from 'axios';
import { authService } from './auth.service';
import type { UserSearch, LocationUser } from '../types/user';

const API_BASE = 'https://api.intra.42.fr/v2';

class ApiService {
	private getHeaders() {
		const token = authService.getStoredToken();
		return {
			Authorization: `Bearer ${token}`,
		};
	}

	// Search users by login
	async searchUsers(
		query: string,
		page: number = 1,
		perPage: number = 20
	): Promise<UserSearch[]> {
		const response = await axios.get<UserSearch[]>(`${API_BASE}/users`, {
			headers: this.getHeaders(),
			params: {
				'filter[login]': query,
				page,
				per_page: perPage,
			},
		});
		return response.data;
	}

	// Get users filtered by pool
	async getUsersByPool(
		poolMonth: string,
		poolYear: string,
		page: number = 1,
		perPage: number = 100
	): Promise<UserSearch[]> {
		const response = await axios.get<UserSearch[]>(`${API_BASE}/campus/30/users`, {
			headers: this.getHeaders(),
			params: {
				'filter[pool_month]': poolMonth,
				'filter[pool_year]': poolYear,
				page,
				per_page: perPage,
			},
		});
		return response.data;
	}

	// Get users currently logged in at a campus
	async getLocations(
		campusId: number,
		page: number = 1
	): Promise<LocationUser[]> {
		const response = await axios.get<LocationUser[]>(
			`${API_BASE}/campus/${campusId}/locations`,
			{
				headers: this.getHeaders(),
				params: {
					'filter[active]': true,
					'filter[campus_id]': campusId,
					page,
					per_page: 100,
				},
			}
		);
		return response.data;
	}

	// Get specific user by ID
	async getUserById(userId: number): Promise<UserSearch> {
		const response = await axios.get<UserSearch>(
			`${API_BASE}/users/${userId}`,
			{
				headers: this.getHeaders(),
			}
		);
		return response.data;
	}

	// Get specific user by login
	async getUserByLogin(login: string): Promise<UserSearch> {
		const response = await axios.get<UserSearch>(`${API_BASE}/users/${login}`, {
			headers: this.getHeaders(),
		});
		return response.data;
	}
}

export const apiService = new ApiService();
