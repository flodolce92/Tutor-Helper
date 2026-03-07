import axios from 'axios';
import { authService } from './auth.service';
import type { UserSearch, LocationUser } from '../types/user';
import type { Event } from '../types/event';

const API_BASE = '/api/v2';

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
		perPage: number = 20,
	): Promise<UserSearch[]> {
		query = query.trim();
		query = query.toLowerCase();
		const queryRangeEnd =
			query.slice(0, -1) +
			String.fromCharCode(query.charCodeAt(query.length - 1) + 1);
		const response = await axios.get<UserSearch[]>(
			`${API_BASE}/campus/30/users`,
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
		return response.data;
	}

	// Get users filtered by pool
	async getUsersByPool(
		poolMonth: string,
		poolYear: string,
		page: number = 1,
		perPage: number = 100,
	): Promise<UserSearch[]> {
		const response = await axios.get<UserSearch[]>(
			`${API_BASE}/campus/30/users`,
			{
				headers: this.getHeaders(),
				params: {
					'filter[pool_month]': poolMonth,
					'filter[pool_year]': poolYear,
					sort: 'login',
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
	async getLocations(
		campusId: number,
		page: number = 1,
	): Promise<LocationUser[]> {
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
	async getEvents(
		campusId: number,
		page: number = 1,
		perPage: number = 20,
	): Promise<Event[]> {
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
