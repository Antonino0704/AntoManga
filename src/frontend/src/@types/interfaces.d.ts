export interface Type {
	id: number;
	name: string;
}

export interface Series {
	id: number;
	name: string;
	slug: string;
	n_volumes: number;
	volumes_bought: number;
	volumes_read: number;
	image: string;
	typology: number;
	publisher: string;
	is_discontinued: Boolean;
	purchased_at: String;
}

export interface SeriesViewsetInstance extends Series {
	typology_name: string;
	publisher_slug: string;
	publisher_name: string;
	detail: string;
}

export interface Publisher {
	id: number;
	name: string;
	slug: string;
	description: string;
	image: string;
}

export interface PublisherDetail extends Publisher {
	detail: string;
}

export interface PublisherRank extends Publisher {
	count: number;
}

export interface RequestObject {
	results: Array;
	count: number;
	next: string | null;
	previous: string | null;
}

export interface Stats {
	type: Type;
	volumes_bought: number;
	volumes_read: number;
}

export interface User {
	username: string;
	is_authenticated: boolean;
	is_staff: boolean;
}

export interface PublisherStats {
	type: Type;
	nSeries: number;
}

export interface Typev2 extends Type {
	applied: Boolean;
}

export interface Ticket {
	title: string;
	email: string;
	description: string;
	label: number;
}

export interface Label {
	id: number;
	name: string;
	color: string;
}
