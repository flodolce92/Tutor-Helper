import axios from 'axios';
import { authService } from './auth.service';
import type { UserSearch, LocationUser } from '../types/user';
import type { Event } from '../types/event';

const API_BASE = '/api/v2';

class ApiService {
	private campusId: number | null = null;

	private getHeaders() {
		const token = authService.getStoredToken();
		return {
			Authorization: `Bearer ${token}`,
		};
	}

	// Get the primary campus ID from the authenticated user
	async getCampusId(): Promise<number> {
		if (this.campusId !== null) {
			return this.campusId;
		}

		try {
			const user = await authService.getCurrentUser();
			if (user.campus && user.campus.length > 0) {
				this.campusId = user.campus[0].id;
				return this.campusId;
			}
			console.warn('No campus found for user, using default campus 30');
			this.campusId = 30;
			return this.campusId;
		} catch (error) {
			console.error('Failed to get campus ID:', error);
			this.campusId = 30;
			return this.campusId;
		}
	}

	resetCampusId() {
		this.campusId = null;
	}

	setCampusId(campusId: number) {
		this.campusId = campusId;
	}

	// Search users
	async searchUsers(
		query: string,
		page: number = 1,
		perPage: number = 20,
		onPartialResults?: (users: UserSearch[]) => void,
	): Promise<UserSearch[]> {
		const campusId = await this.getCampusId();
		query = query.trim();
		query = query.toLowerCase();
		const queryRangeEnd =
			query.slice(0, -1) +
			String.fromCharCode(query.charCodeAt(query.length - 1) + 1);

		const [firstNameResults, lastNameResults] = await Promise.all([
			// Search by first_name
			axios.get<UserSearch[]>(`${API_BASE}/campus/${campusId}/users`, {
				headers: this.getHeaders(),
				params: {
					'filter[first_name]': `${query}`,
					sort: 'first_name',
					page,
					per_page: perPage,
				},
			}),
			// Search by last_name
			axios.get<UserSearch[]>(`${API_BASE}/campus/${campusId}/users`, {
				headers: this.getHeaders(),
				params: {
					'filter[last_name]': `${query}`,
					sort: 'last_name',
					page,
					per_page: perPage,
				},
			}),
		]);

		// Emit first batch of results (first_name + last_name)
		let currentUsers = [...firstNameResults.data, ...lastNameResults.data];
		let uniqueUsers = Array.from(
			new Map(currentUsers.map((user) => [user.id, user])).values(),
		);
		if (onPartialResults) {
			onPartialResults(
				uniqueUsers.sort((a, b) => a.first_name.localeCompare(b.first_name)),
			);
		}

		// await for rate limit
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const loginResults = await axios.get<UserSearch[]>(
			`${API_BASE}/campus/${campusId}/users`,
			{
				headers: this.getHeaders(),
				params: {
					'range[login]': `${query},${queryRangeEnd}`,
					sort: 'login',
					page,
					per_page: perPage,
				},
			},
		);

		// Combine all results and remove duplicates
		const allUsers = [
			...firstNameResults.data,
			...lastNameResults.data,
			...loginResults.data,
		];
		uniqueUsers = Array.from(
			new Map(allUsers.map((user) => [user.id, user])).values(),
		);

		// Sort by usual_full_name
		return uniqueUsers.sort((a, b) => a.usual_full_name.localeCompare(b.usual_full_name));
	}

	// Get users filtered by pool
	async getUsersByPool(
		poolMonth: string,
		poolYear: string,
		page: number = 1,
		perPage: number = 100,
	): Promise<UserSearch[]> {
		const campusId = await this.getCampusId();
		const response = await axios.get<UserSearch[]>(
			`${API_BASE}/campus/${campusId}/users`,
			{
				headers: this.getHeaders(),
				params: {
					'filter[pool_month]': poolMonth,
					'filter[pool_year]': poolYear,
					sort: 'first_name,last_name',
					page,
					per_page: perPage,
				},
			},
		);
		return response.data;
	}

	// Get all users filtered by pool
	async getAllUsersByPool(
		poolMonth: string,
		poolYear: string,
	): Promise<UserSearch[]> {
		let allUsers: UserSearch[] = [];
		let page = 1;
		let hasMore = true;

		while (hasMore) {
			const users = await this.getUsersByPool(poolMonth, poolYear, page, 100);
			allUsers = [...allUsers, ...users];
			hasMore = users.length === 100;
			page++;
		}

		return allUsers;
	}

	// Get users currently logged in at a campus
	async getLocations(page: number = 1): Promise<LocationUser[]> {
		const campusId = await this.getCampusId();
		const response = await axios.get<LocationUser[]>(
			`${API_BASE}/campus/${campusId}/locations`,
			{
				headers: this.getHeaders(),
				params: {
					'filter[active]': true,
					'filter[campus_id]': campusId,
					'range[host]': '[e3,e4]',
					page,
					per_page: 100,
				},
			},
		);
		return response.data;
	}

	// Get future events by campus and cursus sorted by start date
	async getEvents(page: number = 1, perPage: number = 20): Promise<Event[]> {
		const campusId = await this.getCampusId();
		const response = await axios.get<Event[]>(
			`${API_BASE}/campus/${campusId}/events`,
			{
				headers: this.getHeaders(),
				params: {
					'filter[future]': true,
					sort: 'begin_at',
					page,
					per_page: perPage,
				},
			},
		);
		return response.data;
	}
}

export const apiService = new ApiService();
