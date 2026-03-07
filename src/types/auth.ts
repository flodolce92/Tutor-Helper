export interface Campus {
	id: number;
	name: string;
	time_zone: string;
	language: {
		id: number;
		name: string;
		identifier: string;
	};
	users_count: number;
	vogsphere_id: number;
}

export interface User42 {
	id: number;
	email: string;
	login: string;
	first_name: string;
	last_name: string;
	usual_full_name: string;
	usual_first_name: string | null;
	url: string;
	phone: string;
	displayname: string;
	image: {
		link: string;
		versions: {
			large: string;
			medium: string;
			small: string;
			micro: string;
		};
	};
	staff?: boolean;
	correction_point: number;
	pool_month: string;
	pool_year: string;
	location: string | null;
	wallet: number;
	anonymize_date: string;
	created_at: string;
	updated_at: string;
	campus: Campus[];
}

export interface TokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
	created_at: number;
}
