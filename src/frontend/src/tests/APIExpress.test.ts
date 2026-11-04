import { describe, expect, test, vi } from 'vitest';
import { apiExpress } from '../utils/APIExpress';
import { endpoints } from '../utils/endpoints';
import { seriesFixture } from '../tests/fixtures/data';
import type { Series } from '../@types/interfaces';

vi.mock('../utils/csrf_token', () => ({
	csrftoken: () => 'mocked-csrf-token'
}));

describe('APIExpress Tests', () => {
	test('returns a series | get method', async () => {
		const series = await apiExpress.get<Series>(`${endpoints.series}${seriesFixture.slug}`);
		expect(series.name).toBe(seriesFixture.name);
	});
	test('saves a series | post method', async () => {
		const series = await apiExpress.post<Series>(`${endpoints.series}`, seriesFixture);
		expect(series.slug).toBe(seriesFixture.slug);
	});
	test('modifies a series | put method', async () => {
		const series = await apiExpress.put<Series>(
			`${endpoints.series}${seriesFixture.slug}`,
			seriesFixture
		);
		expect(series.slug).toBe(seriesFixture.slug);
	});
	test('deletes a series | delete method', async () => {
		const response = await apiExpress.delete<Series>(`${endpoints.series}${seriesFixture.slug}`);
		expect(response).toBe(undefined);
	});
	test('gets protectedErrorDetail text when it deletes a series', async () => {
		// it's a fake url
		await expect(
			apiExpress.delete<Series>(`${endpoints.series}${seriesFixture.slug}/error`)
		).rejects.toThrow('Request failed: fake error');
	});
});
