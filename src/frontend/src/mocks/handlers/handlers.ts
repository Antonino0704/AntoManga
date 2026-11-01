import { http, HttpResponse } from 'msw';
import { endpoints } from '../../utils/endpoints';
import { seriesFixture } from '../../tests/fixtures/data';

const baseEndpoint = '/api/';

export const restHandlers = [
	http.get(`${baseEndpoint}${endpoints.series}${seriesFixture.slug}`, () => {
		return HttpResponse.json(seriesFixture);
	})
];
