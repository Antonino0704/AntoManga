import { describe, expect, test, vi } from 'vitest';
import { moreData, moreDataImage } from '../utils/getSeries';
import { seriesData } from '../tests/fixtures/data';

vi.mock('../utils/csrf_token', () => ({
	csrftoken: () => 'mocked-csrf-token'
}));

describe('getSeries Tests', () => {
	test('tests moreData method', async () => {
		const response = await moreData(2, 1, seriesData.next);
		expect(response.results[0].name).toBe(seriesData.results[0].name);
	});
	test('tests moreDataImage method', async () => {
		seriesData.results[0].image = 'fake-image';
		const response = await moreDataImage(2, 1, seriesData.next);
		expect(response.results[0]).toBe(seriesData.results[0].image);
	});
});
