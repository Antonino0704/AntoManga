import { http, HttpResponse } from 'msw';
import { endpoints } from '../../utils/endpoints';
import { createSeriesFixture, createRequestObject } from '../../tests/fixtures/data';

const seriesFixture = createSeriesFixture();
const seriesDataFixture = createRequestObject({
	next: '/api/v0/series/?page=2',
	results: [
		createSeriesFixture({
			image: 'fake-image'
		})
	]
});

const baseEndpoint = '/api/';

export const restHandlers = [
	http.get(`${baseEndpoint}${endpoints.series}${seriesFixture.slug}`, () => {
		return HttpResponse.json(seriesFixture);
	}),
	http.post(`${baseEndpoint}${endpoints.series}`, () => {
		return HttpResponse.json(seriesFixture);
	}),
	http.put(`${baseEndpoint}${endpoints.series}${seriesFixture.slug}`, () => {
		return HttpResponse.json(seriesFixture);
	}),
	http.delete(`${baseEndpoint}${endpoints.series}${seriesFixture.slug}`, () => {
		return new HttpResponse(null, { status: 204 });
	}),
	http.delete(`${baseEndpoint}${endpoints.series}${seriesFixture.slug}/error`, () => {
		// it's a fake url
		return HttpResponse.json({ protectedErrorDetail: 'fake error' }, { status: 400 });
	}),
	http.get(`${seriesDataFixture.next}`, () => {
		return HttpResponse.json(seriesDataFixture);
	})
];
