import { describe, expect, test, vi } from 'vitest';
import { moreData, moreDataImage } from '../utils/getSeries';
import { createRequestObject } from '../tests/fixtures/data';

vi.mock('../utils/csrf_token', () => ({
	csrftoken: () => 'mocked-csrf-token'
}));

describe('getSeries Tests', () => {
	test('tests moreData method', async () => {
		const seriesDataFixture = createRequestObject({
			next: '/api/v0/series/?page=2'
		});
		const response = await moreData(2, 1, seriesDataFixture.next);
		expect(response.results[0].name).toBe(seriesDataFixture.results[0].name);
	});
	test('tests moreDataImage method', async () => {
		const seriesDataFixture = createRequestObject({
			next: '/api/v0/series/?page=2'
		});
		seriesDataFixture.results[0].image = 'fake-image';
		const response = await moreDataImage(2, 1, seriesDataFixture.next);
		expect(response.results[0]).toBe(seriesDataFixture.results[0].image);
	});
});
