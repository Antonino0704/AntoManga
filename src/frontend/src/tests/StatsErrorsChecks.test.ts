import { describe, expect, test } from 'vitest';
import { checkDataStats, showErrors } from '@/utils/StatsErrorsChecks';
import { seriesFixture } from './fixtures/data';
import { i18n } from '@/i18n/i18n';

const t = i18n.global.t;

describe('tests Stats Errors Checks', () => {
	test('works', () => {
		const seriesTest = { ...seriesFixture };

		const response_checkDataStats = checkDataStats(seriesTest);
		expect(response_checkDataStats).toBe(true);
		const response_showErrors = showErrors(seriesTest, t);
		expect(response_showErrors).toBe('');
	});
});

describe('Stats Errors Checks for n_volumes | tests', () => {
	test('tests n_volumes < 0', () => {
		const seriesTest = { ...seriesFixture };
		seriesTest.n_volumes = 0;
		seriesTest.volumes_bought = 0;
		seriesTest.volumes_read = 0;

		const input = document.createElement('input');
		input.id = 'inputNVol';
		input.className = 'form-input';
		document.body.appendChild(input);

		const response_checkDataStats = checkDataStats(seriesTest);
		expect(response_checkDataStats).toBe(false);
		const response_showErrors = showErrors(seriesTest, t);
		expect(response_showErrors).toBe(t('common.errors.nVolumes0'));
	});
});

describe('Stats Errors Checks for volumes_bought | tests', () => {
	test('tests volumes_bought > n_volumes', () => {
		const seriesTest = { ...seriesFixture };
		seriesTest.n_volumes = 0;
		seriesTest.volumes_bought = 1;
		seriesTest.volumes_read = 0;

		const input = document.createElement('input');
		input.id = 'inputBought';
		input.className = 'form-input';
		document.body.appendChild(input);

		const response_checkDataStats = checkDataStats(seriesTest);
		expect(response_checkDataStats).toBe(false);
		const response_showErrors = showErrors(seriesTest, t);
		expect(response_showErrors).toBe(t('common.errors.volBoughtThanNVolumes'));
	});
});

describe('Stats Errors Checks for volumes_read | tests', () => {
	test('tests volumes_read < 0', () => {
		const seriesTest = { ...seriesFixture };
		seriesTest.volumes_read = -1;

		const input = document.createElement('input');
		input.id = 'inputRead';
		input.className = 'form-input';
		document.body.appendChild(input);

		const response_checkDataStats = checkDataStats(seriesTest);
		expect(response_checkDataStats).toBe(false);
		const response_showErrors = showErrors(seriesTest, t);
		expect(response_showErrors).toBe(t('common.errors.volReadNegative'));
	});
	test('tests volumes_read > volumes_bought', () => {
		const seriesTest = { ...seriesFixture };
		seriesTest.n_volumes = 0;
		seriesTest.volumes_bought = 1;
		seriesTest.volumes_read = 1;

		const input = document.createElement('input');
		input.id = 'inputRead';
		input.className = 'form-input';
		document.body.appendChild(input);

		const response_checkDataStats = checkDataStats(seriesTest);
		expect(response_checkDataStats).toBe(false);
		const response_showErrors = showErrors(seriesTest, t);
		expect(response_showErrors).toBe(t('common.errors.volBoughtThanNVolumes'));
	});
	test('tests volumes_read > volumes_bought', () => {
		const seriesTest = { ...seriesFixture };
		seriesTest.n_volumes = 0;
		seriesTest.volumes_bought = 0;
		seriesTest.volumes_read = 1;

		const input = document.createElement('input');
		input.id = 'inputRead';
		input.className = 'form-input';
		document.body.appendChild(input);

		const response_checkDataStats = checkDataStats(seriesTest);
		expect(response_checkDataStats).toBe(false);
		const response_showErrors = showErrors(seriesTest, t);
		expect(response_showErrors).toBe(t('common.errors.volReadThanVolBought'));
	});
});
