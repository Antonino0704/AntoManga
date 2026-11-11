import { afterEach, describe, test, expect, vi, beforeEach } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { i18n } from '@/i18n/i18n';
import { useUserStore } from '@/stores/userStore';
import Navbar from '@/components/Navbar.vue';
import { apiExpress } from '@/utils/APIExpress';
import { endpoints } from '@/utils/endpoints';
import { createPublisherFixture, createTypeFixture } from './fixtures/data';

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

function mountNavbar(query = {}) {
	return mount(Navbar, {
		attachTo: document.body,
		global: {
			plugins: [pinia, i18n],
			renderStubDefaultSlot: true,
			stubs: {
				RouterLink: true,
				RouterView: true,
				MobileSearchComponent: {
					template: '<div data-test="MobileSearchComponent-stub" />'
				}
			},
			mocks: {
				$route: { query },
				$router: { push: vi.fn(), replace: vi.fn() }
			}
		}
	});
}

describe('Navbar', () => {
	test('tests New publisher and new series buttons when user is not auth', async () => {
		//mocks
		const spy = vi.spyOn(apiExpress, 'get');
		spy.mockImplementation(async (url: string) => {
			const types = createTypeFixture();
			const publishers = createPublisherFixture();
			if (url.startsWith(endpoints.types)) {
				return [{ ...types }];
			}
			if (url.startsWith(endpoints.publishersShort)) {
				return [{ ...types }];
			}
			if (url.startsWith(endpoints.publishers)) {
				return [{ ...publishers }];
			}
			throw new Error(`this url is not allowed: ${url}`);
		});

		// un_authenticated user
		store.profile.user = {
			username: '',
			is_authenticated: false,
			is_staff: false
		};

		// mount navbar
		const wrapper = mountNavbar();

		// wait async requests
		await flushPromises();

		const buttons = wrapper.findAll('.bi-plus-circle');

		expect(buttons.length).toBe(0);

		// unmount NavBar component
		wrapper.unmount();
	});
	test('tests New publisher and new series buttons when user is auth', async () => {
		//mocks
		const spy = vi.spyOn(apiExpress, 'get');
		spy.mockImplementation(async (url: string) => {
			const types = createTypeFixture();
			const publishers = createPublisherFixture();
			if (url.startsWith(endpoints.types)) {
				return [{ ...types }];
			}
			if (url.startsWith(endpoints.publishersShort)) {
				return [{ ...types }];
			}
			if (url.startsWith(endpoints.publishers)) {
				return [{ ...publishers }];
			}
			throw new Error(`this url is not allowed: ${url}`);
		});

		// mount navbar
		const wrapper = mountNavbar();

		// wait async requests
		await flushPromises();

		const buttons = wrapper.findAll('.bi-plus-circle');

		expect(buttons.length).toBe(2);

		// unmount NavBar component
		wrapper.unmount();
	});
	test('tests New publisher and new series buttons when types are 0', async () => {
		//mocks
		const spy = vi.spyOn(apiExpress, 'get');
		spy.mockImplementation(async (url: string) => {
			const types = createTypeFixture();
			const publishers = createPublisherFixture();
			if (url.startsWith(endpoints.types)) {
				return [];
			}
			if (url.startsWith(endpoints.publishersShort)) {
				return [{ ...types }];
			}
			if (url.startsWith(endpoints.publishers)) {
				return [{ ...publishers }];
			}
			throw new Error(`this url is not allowed: ${url}`);
		});

		// mount navbar
		const wrapper = mountNavbar();

		// wait async requests
		await flushPromises();

		const buttons = wrapper.findAll('.bi-plus-circle');

		expect(buttons.length).toBe(1);

		// unmount NavBar component
		wrapper.unmount();
	});
	test('tests New publisher and new series buttons when publishers are 0', async () => {
		//mocks
		const spy = vi.spyOn(apiExpress, 'get');
		spy.mockImplementation(async (url: string) => {
			const types = createTypeFixture();
			if (url.startsWith(endpoints.types)) {
				return [{ ...types }];
			}
			if (url.startsWith(endpoints.publishersShort)) {
				return [];
			}
			if (url.startsWith(endpoints.publishers)) {
				return [];
			}
			throw new Error(`this url is not allowed: ${url}`);
		});

		// mount navbar
		const wrapper = mountNavbar();

		// wait async requests
		await flushPromises();

		const buttons = wrapper.findAll('.bi-plus-circle');

		expect(buttons.length).toBe(1);

		// unmount NavBar component
		wrapper.unmount();
	});
	test('tests when $route.query is defined and filterEvent', async () => {
		//mocks
		const spy = vi.spyOn(apiExpress, 'get');
		const types = createTypeFixture();
		const publishers = createPublisherFixture();
		spy.mockImplementation(async (url: string) => {
			if (url.startsWith(endpoints.types)) {
				return [{ ...types }];
			}
			if (url.startsWith(endpoints.publishersShort)) {
				const pubShort = { ...types };
				pubShort.name = 'pub';
				return [{ ...pubShort }];
			}
			if (url.startsWith(endpoints.publishers)) {
				return [{ ...publishers }];
			}
			throw new Error(`this url is not allowed: ${url}`);
		});

		// mount navbar
		const wrapper = mountNavbar({
			type: '0',
			filterbyname: 'test',
			publisher: '0',
			purchased_at: 'desc'
		});

		// wait async requests
		await flushPromises();

		const searchBar = wrapper.find('#searchBar');
		const menu = wrapper.findAll('.dropdown-menu > li');
		const text = (searchBar.element as HTMLInputElement).value;

		expect(text).toBe('test');
		expect(menu[6].text()).contain(types.name);
		expect(menu[8].text()).contain('pub');
		expect(menu[9].text()).contain('Most Recent');

		const searchButton = wrapper.find('[role="search"] > button');
		await searchButton.trigger('click');
		expect(wrapper.emitted('filterEvent')).toBeTruthy();
		expect(wrapper.emitted('filterEvent')![0][0]).toStrictEqual([0]); // types
		expect(wrapper.emitted('filterEvent')![0][1]).toBe('test'); // searchBar
		expect(wrapper.emitted('filterEvent')![0][2]).toStrictEqual([0]); // publishers
		expect(wrapper.emitted('filterEvent')![0][3]).toStrictEqual([1]); // sortByList

		// unmount NavBar component
		wrapper.unmount();
	});
	test('tests excludeDiscontinuedSeries and discontinuedSeriesOnly', async () => {
		//mocks
		const spy = vi.spyOn(apiExpress, 'get');
		spy.mockImplementation(async (url: string) => {
			if (url.startsWith(endpoints.types)) {
				return [];
			}
			if (url.startsWith(endpoints.publishersShort)) {
				return [];
			}
			if (url.startsWith(endpoints.publishers)) {
				return [];
			}
			throw new Error(`this url is not allowed: ${url}`);
		});

		// mount navbar
		const wrapper = mountNavbar({
			type: '-3' // -3 is excludeDiscontinuedSeries
		});

		// wait async requests
		await flushPromises();

		const menu = wrapper.findAll('.dropdown-menu > li');

		expect(menu[4].find('i').attributes('style')).toBe('');
		expect(menu[5].find('i').attributes('style')).toBe('display: none;');

		await menu[5].trigger('click');
		await wrapper.vm.$nextTick();
		await flushPromises();

		expect(menu[4].find('i').attributes('style')).toBe('display: none;');
		expect(menu[5].find('i').attributes('style')).toBe('');

		// unmount NavBar component
		wrapper.unmount();
	});
	test('tests mostRecent and leastRecent', async () => {
		//mocks
		const spy = vi.spyOn(apiExpress, 'get');
		spy.mockImplementation(async (url: string) => {
			if (url.startsWith(endpoints.types)) {
				return [];
			}
			if (url.startsWith(endpoints.publishersShort)) {
				return [];
			}
			if (url.startsWith(endpoints.publishers)) {
				return [];
			}
			throw new Error(`this url is not allowed: ${url}`);
		});

		// mount navbar
		const wrapper = mountNavbar({
			purchased_at: 'desc'
		});

		// wait async requests
		await flushPromises();

		const menu = wrapper.findAll('.dropdown-menu > li');

		expect(menu[7].find('i').attributes('style')).toBe('');
		expect(menu[8].find('i').attributes('style')).toBe('display: none;');

		await menu[8].trigger('click');
		await wrapper.vm.$nextTick();
		await flushPromises();

		expect(menu[7].find('i').attributes('style')).toBe('display: none;');
		expect(menu[8].find('i').attributes('style')).toBe('');

		// unmount NavBar component
		wrapper.unmount();
	});
	test('tests clear button and double click', async () => {
		//mocks
		const spy = vi.spyOn(apiExpress, 'get');
		spy.mockImplementation(async (url: string) => {
			if (url.startsWith(endpoints.types)) {
				return [];
			}
			if (url.startsWith(endpoints.publishersShort)) {
				return [];
			}
			if (url.startsWith(endpoints.publishers)) {
				return [];
			}
			throw new Error(`this url is not allowed: ${url}`);
		});

		// mount navbar
		const wrapper = mountNavbar();

		// wait async requests
		await flushPromises();

		const menu = wrapper.findAll('.dropdown-menu > li');

		expect(menu[0].find('i').exists()).toBe(false);
		expect(menu[4].find('i').attributes('style')).toBe('display: none;');

		await menu[4].trigger('click');
		await wrapper.vm.$nextTick();
		await flushPromises();

		expect(menu[0].find('i').exists()).toBe(true);
		expect(menu[4].find('i').attributes('style')).toBe('');

		await menu[4].trigger('click');
		await wrapper.vm.$nextTick();
		await flushPromises();

		expect(menu[0].find('i').exists()).toBe(false);
		expect(menu[4].find('i').attributes('style')).toBe('display: none;');

		// unmount NavBar component
		wrapper.unmount();
	});
});
