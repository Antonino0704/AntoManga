import { beforeEach, afterEach, describe, test, expect, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { i18n } from '@/i18n/i18n';
import { useUserStore } from '@/stores/userStore';
import { apiExpress } from '@/utils/APIExpress';
import { endpoints } from '@/utils/endpoints';
import { createTypeFixture } from './fixtures/data';
import Types from '@/views/Types.vue';

const pinia = createPinia();
const store = useUserStore(pinia);

beforeEach(() => {
	store.profile.user = {
		username: 'fake user',
		is_authenticated: true,
		is_staff: false
	};
});

afterEach(() => {
	vi.restoreAllMocks();
});

function mountTypes() {
	return mount(Types, {
		attachTo: document.body,
		global: {
			plugins: [pinia, i18n],
			renderStubDefaultSlot: true,
			stubs: {
				RouterLink: true,
				RouterView: true,
				Notification: {
					template: '<div data-test="Notification-stub" />',
					methods: {
						sendNotification: vi.fn()
					}
				},
				TypesComponent: {
					template: '<button data-test="TypesComponent"> TypesComponent </button>'
				}
			},
			mocks: {
				$route: {},
				$router: { push: vi.fn(), replace: vi.fn() }
			}
		}
	});
}

describe('Types', () => {
	test('tests types page when user is authenticated', async () => {
		// mocks
		const spy = vi.spyOn(apiExpress, 'get');
		spy.mockImplementation(async (url: string) => {
			if (url.startsWith(endpoints.types)) {
				return [createTypeFixture()];
			}
			throw new Error('this url is not allowed');
		});

		// mount Types component
		const wrapper = mountTypes();

		// wait async requests
		await flushPromises();

		const addNewTypeButton = wrapper.find("[data-test='TypesComponent']");
		const buttons = wrapper.findAll('i');
		expect(addNewTypeButton.exists()).toBe(true);
		expect(buttons.length).toBe(2);

		// unmount
		wrapper.unmount();
	});
	test('tests types page when user is unauthenticated', async () => {
		// mocks
		const spy = vi.spyOn(apiExpress, 'get');
		spy.mockImplementation(async (url: string) => {
			if (url.startsWith(endpoints.types)) {
				return [createTypeFixture()];
			}
			throw new Error('this url is not allowed');
		});

		store.profile.user = {
			username: '',
			is_authenticated: false,
			is_staff: false
		};

		// mount Types component
		const wrapper = mountTypes();

		// wait async requests
		await flushPromises();

		const addNewTypeButton = wrapper.find("[data-test='TypesComponent']");
		const buttons = wrapper.findAll('i');
		expect(addNewTypeButton.exists()).toBe(false);
		expect(buttons.length).toBe(0);

		// unmount
		wrapper.unmount();
	});
	test('tests change name type', async () => {
		// mocks
		const spyGet = vi.spyOn(apiExpress, 'get');
		const spyPut = vi.spyOn(apiExpress, 'put');
		const type = createTypeFixture();
		spyGet.mockImplementation(async (url: string) => {
			if (url.startsWith(endpoints.types)) {
				return [type];
			}
			throw new Error('this url is not allowed');
		});
		spyPut.mockImplementation(async (url: string) => {
			if (url.startsWith(endpoints.types)) {
				return null;
			}
			throw new Error('this url is not allowed');
		});

		// mount Types component
		const wrapper = mountTypes();

		// wait async requests
		await flushPromises();

		const types = wrapper.find(`#typeID${type.id}`);
		const buttons = wrapper.find('i');
		expect((types.element as HTMLInputElement).value).contain(type.name);
		expect(spyPut).toHaveBeenCalledTimes(0);
		types.setValue('name updated');
		await buttons.trigger('click');

		expect(spyPut).toHaveBeenCalledTimes(1);
		expect((types.element as HTMLInputElement).value).contain('name updated');
	});
	test('tests delete type', async () => {
		// mocks
		const spyGet = vi.spyOn(apiExpress, 'get');
		const spyDelete = vi.spyOn(apiExpress, 'delete');
		const type = createTypeFixture();
		spyGet.mockImplementation(async (url: string) => {
			if (url.startsWith(endpoints.types)) {
				return [type];
			}
			throw new Error('this url is not allowed');
		});
		spyDelete.mockImplementation(async (url: string) => {
			if (url.startsWith(endpoints.types)) {
				return null;
			}
			throw new Error('this url is not allowed');
		});

		// mount Types component
		const wrapper = mountTypes();

		// wait async requests
		await flushPromises();

		const types = wrapper.find(`#typeID${type.id}`);
		const buttons = wrapper.findAll('i');
		expect((types.element as HTMLInputElement).value).contain(type.name);
		expect(spyDelete).toHaveBeenCalledTimes(0);
		await buttons[1].trigger('click');

		expect(spyDelete).toHaveBeenCalledTimes(1);
		expect(wrapper.find(`#typeID${type.id}`).exists()).toBe(false);

		// unmount
		wrapper.unmount();
	});
});
