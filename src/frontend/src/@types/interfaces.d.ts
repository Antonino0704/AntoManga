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
