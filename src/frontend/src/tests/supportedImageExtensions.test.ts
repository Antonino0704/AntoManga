import { afterEach, describe, expect, test, vi } from 'vitest';
import { apiExpress } from '../utils/APIExpress';
import { validateImage } from '@/utils/supportedImageExtensions';

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Return True or False if teh image is soppurted or no', () => {
	test('returns true because the image is supported', async () => {
		// mock
		const spy = vi.spyOn(apiExpress, 'postImage');
		spy.mockResolvedValue({ isValid: true });

		// create file with image
		const input = document.createElement('input');
		input.type = 'file';
		const image = new File(['fake'], 'fake.png', {
			type: 'image/png'
		});
		Object.defineProperty(input, 'files', {
			value: [image],
			configurable: true
		});

		expect(spy).toHaveBeenCalledTimes(0);
		const result = await validateImage(input);
		expect(spy).toHaveBeenCalledTimes(1);
		expect(result).toBe(true);
	});
	test('returns false because length < 1', async () => {
		// mock
		const spy = vi.spyOn(apiExpress, 'postImage');
		spy.mockResolvedValue({ isValid: true });

		// create file without image
		const input = document.createElement('input');
		input.type = 'file';

		expect(spy).toHaveBeenCalledTimes(0);
		const result = await validateImage(input);
		expect(spy).toHaveBeenCalledTimes(0);
		expect(result).toBe(false);
	});
	test('returns false because length the file is not image', async () => {
		// mock
		const spy = vi.spyOn(apiExpress, 'postImage');
		spy.mockResolvedValue({ isValid: true });

		// create file with pdf file
		const input = document.createElement('input');
		input.type = 'file';
		const pdf = new File(['fake'], 'fake.pdf', {
			type: 'pdf/pdf'
		});
		Object.defineProperty(input, 'files', {
			value: [pdf],
			configurable: true
		});

		expect(spy).toHaveBeenCalledTimes(0);
		const result = await validateImage(input);
		expect(spy).toHaveBeenCalledTimes(0);
		expect(result).toBe(false);
	});
});
