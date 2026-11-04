import type { Series, RequestObject } from '@/@types/interfaces';

export const seriesFixture: Series = {
	id: 1,
	slug: 'test-slug',
	purchased_at: '2026-09-10',
	name: 'Test Series',
	n_volumes: 1,
	volumes_bought: 1,
	volumes_read: 1,
	is_discontinued: false,
	publisher: '2',
	typology: 1,
	image: ''
};

export const seriesData: RequestObject = {
	results: [{ ...seriesFixture, slug: 'test-get-series' }],
	count: 0,
	next: 'http://127.0.0.1/api/v0/series/?page=2',
	previous: null
};
