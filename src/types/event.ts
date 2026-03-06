export interface Event {
	id: number;
	name: string;
	description: string;
	location: string;
	begin_at: string;
	end_at: string;
	nbr_subscribers: number;
	max_people?: number;
	kind: string;
}
