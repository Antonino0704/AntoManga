import { beforeEach, afterEach, describe, test, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { i18n } from '@/i18n/i18n';
import App from '@/App.vue';
import { useUserStore } from '@/stores/userStore';

const pinia = createPinia();

beforeEach(() => {
	window.matchMedia = vi.fn().mockImplementation(
		(query: string): MediaQueryList =>
			({
				matches: false,
				media: query,
				onchange: null,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				addListener: vi.fn(),
				removeListener: vi.fn(),
				dispatchEvent: vi.fn()
			}) as unknown as MediaQueryList
	);
});

afterEach(() => {
	vi.restoreAllMocks();
});

function mountApp(name = '') {
	return mount(App, {
		global: {
			plugins: [pinia, i18n],
			renderStubDefaultSlot: true,
			stubs: {
				RouterLink: true,
				RouterView: true,
				isNotAuthenticated: {
					template: '<div data-test="isNotAuthenticated-stub">The user is not authenticated</div>'
				},
				SettingsModal: {
					template: '<div data-test="SettingsModal-stub" />'
				},
				FooterComponent: {
					template: '<div data-test="FooterComponent-stub" />'
				}
			},
			mocks: {
				$route: { name },
				$router: { push: vi.fn(), replace: vi.fn() }
			}
		}
	});
}

describe('App', () => {
	test('tests when user is not authenticated', () => {
		const wrapper = mountApp();
		const isNotAuthenticated = wrapper.find('[data-test="isNotAuthenticated-stub"]');
		expect(isNotAuthenticated.text()).contain('The user is not authenticated');
		wrapper.unmount();
	});
	test('tests when user is authenticated', () => {
		const store = useUserStore(pinia);
		store.profile.user = {
			username: 'fake user',
			is_authenticated: true,
			is_staff: false
		};
		const wrapper = mountApp();
		const isNotAuthenticated = wrapper.find('[data-test="isNotAuthenticated-stub"]');
		expect(isNotAuthenticated.exists()).toBe(false);
		wrapper.unmount();
	});
	test('tests navbar when name is home', () => {
		const wrapper = mountApp('Home');
		const nav = wrapper.find('nav');
		expect(nav.exists()).toBe(false);
		wrapper.unmount();
	});
	test('tests navbar when name is not home', () => {
		const wrapper = mountApp('NotHome'); // optional parameter here
		const nav = wrapper.find('nav');
		expect(nav.exists()).toBe(true);
		wrapper.unmount();
	});
});
