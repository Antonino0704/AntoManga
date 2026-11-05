import { beforeEach, afterEach, describe, expect, test, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useUserStore } from '@/stores/userStore';
import { apiExpress } from '@/utils/APIExpress';
import { endpoints } from '@/utils/endpoints';

beforeEach(() => {
	setActivePinia(createPinia());
});
afterEach(() => {
	vi.restoreAllMocks();
});

describe('user store tests', () => {
	test('tests init state', () => {
		const store = useUserStore();

		expect(store.profile).toEqual({ user: {} });
		expect(store.profile.user).toEqual({});
		expect(store.loaded).toBe(false);
	});
	test('tests user getter', () => {
		const store = useUserStore();
		store.profile.user = {
			username: 'fake user',
			is_authenticated: true,
			is_staff: false
		};

		expect(store.user).toBe(store.profile.user);
	});
	test('tests userMe action', async () => {
		// mock
		const spy = vi.spyOn(apiExpress, 'get');
		const fakeUser = {
			username: 'fake user',
			is_authenticated: true,
			is_staff: false
		};
		const fakeProfile = {
			user: fakeUser,
			avatar: 'fake avatar url'
		};
		spy.mockImplementation(async (url: string) => {
			if (url === endpoints.userMe) {
				return fakeUser;
			}
			if (url === endpoints.myAvatar) {
				return fakeProfile;
			}
			throw new Error('this url is not allowed');
		});

		const store = useUserStore();

		expect(store.loaded).toBe(false);
		await store.userMe();

		expect(store.profile.user).toStrictEqual(fakeUser);
		expect(store.profile.avatar).toBe(fakeProfile.avatar);
		expect(store.loaded).toBe(true);
	});
	test('tests userMe action, error to load user', async () => {
		// mock
		const spy = vi.spyOn(apiExpress, 'get');
		spy.mockImplementation(async () => {
			throw new Error('this url is not allowed');
		});

		const store = useUserStore();

		expect(store.loaded).toBe(false);
		await store.userMe();

		expect(store.profile.user).toEqual({});
		expect(store.profile.avatar).toBe('');
		expect(store.loaded).toBe(false);
	});
});
