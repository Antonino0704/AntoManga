import type {
	Series,
	RequestObject,
	SeriesViewsetInstance,
	Type,
	Publisher
} from '@/@types/interfaces';

export function createSeriesFixture(override: Partial<Series> = {}): Series {
	return {
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
		image: '',
		...override
	};
}

export function createSeriesCompleteFixture(
	override: Partial<SeriesViewsetInstance> = {}
): SeriesViewsetInstance {
	return {
		id: 1,
		slug: 'test-series-slug',
		purchased_at: '2026-09-10',
		typology_name: 'test type',
		publisher_name: 'test publisher',
		publisher_slug: 'test-publisher-slug',
		name: 'Test series',
		n_volumes: 1,
		volumes_bought: 1,
		volumes_read: 1,
		is_discontinued: false,
		publisher: '1',
		typology: 1,
		detail: '',
		image: 'fake-image link',
		...override
	};
}

export function createRequestObject(override: Partial<RequestObject> = {}): RequestObject {
	return {
		results: [createSeriesFixture({ slug: 'test-get-series' })],
		count: 0,
		next: null,
		previous: null,
		...override
	};
}

export function createTypeFixture(override: Partial<Type> = {}): Type {
	return {
		id: 0,
		name: 'type-test',
		...override
	};
}

export function createPublisherFixture(override: Partial<Publisher> = {}): Publisher {
	return {
		id: 0,
		name: 'test pub',
		slug: 'test-pub-slug',
		description: 'test',
		image: 'fake test pub image',
		...override
	};
}
