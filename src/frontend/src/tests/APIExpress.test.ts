import { describe, expect, test, vi } from 'vitest';
import { apiExpress } from '../utils/APIExpress';
import type { Series } from '../@types/interfaces';
import { endpoints } from '../utils/endpoints';
import { seriesFixture } from '../tests/fixtures/data';

vi.mock('../utils/csrf_token', () => ({
	csrftoken: () => 'mocked-csrf-token'
}));

describe('APIExpress Tests', () => {
	test('returns a series | get method', async () => {
		const series = await apiExpress.get<Series>(`${endpoints.series}${seriesFixture.slug}`);
		expect(series.name).toBe(seriesFixture.name);
	});
});
