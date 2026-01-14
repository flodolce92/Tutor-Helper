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

export interface CursusUser {
	grade: string | null;
	level: number;
	skills: Array<{
		id: number;
		name: string;
		level: number;
	}>;
	blackholed_at: string | null;
	id: number;
	begin_at: string;
	end_at: string | null;
	cursus_id: number;
	has_coalition: boolean;
	user: {
		id: number;
		login: string;
		url: string;
	};
	cursus: {
		id: number;
		created_at: string;
		name: string;
		slug: string;
	};
}

export interface UserSearch {
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
	cursus_users: CursusUser[];
}

export interface LocationUser {
	id: number;
	begin_at: string;
	end_at: string | null;
	primary: boolean;
	host: string;
	campus_id: number;
	user: {
		id: number;
		login: string;
		url: string;
	};
}
