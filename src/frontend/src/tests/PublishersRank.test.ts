import { afterEach, describe, test, expect, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { i18n } from '@/i18n/i18n';
import { apiExpress } from '@/utils/APIExpress';
import { endpoints } from '@/utils/endpoints';
import { createPublisherFixture, createRequestObject } from './fixtures/data';
import PublishersRank from '@/views/PublishersRank.vue';

const pinia = createPinia();

afterEach(() => {
	vi.restoreAllMocks();
});

function mountPublishersRank() {
	return mount(PublishersRank, {
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

describe('Publishers rank', () => {
	test('tests if all is showed', async () => {
		// mocks
		const spy = vi.spyOn(apiExpress, 'get');
		const pub = createPublisherFixture();
		spy.mockImplementation(async (url: string) => {
			if (url.startsWith(endpoints.publishers)) {
				return [pub];
			}
			if (url.startsWith(endpoints.imgPublishers)) {
				return pub;
			}
			if (url.startsWith(endpoints.seriesList)) {
				return createRequestObject();
			}
			throw new Error('this url is not allowed');
		});

		// mount
		const wrapper = mountPublishersRank();
		expect(wrapper.findAll('.placeholder').length).toBeGreaterThan(0);

		// wait async requests
		await flushPromises();

		const series = wrapper.findAll('tbody > tr');
		expect(series.length).toBe(1);
		expect(series[0].text()).contain(pub.name);
		expect(wrapper.findAll('.placeholder').length).toBe(0);

		wrapper.unmount();
	});
});
