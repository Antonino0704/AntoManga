import { afterEach, describe, test, expect, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { i18n } from '@/i18n/i18n';
import { apiExpress } from '@/utils/APIExpress';
import { endpoints } from '@/utils/endpoints';
import { createTypeFixture } from './fixtures/data';
import Stats from '@/views/Stats.vue';

const pinia = createPinia();

afterEach(() => {
	vi.restoreAllMocks();
});

function mountStats() {
	return mount(Stats, {
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

describe('Stats', () => {
	test('tests Stats', async () => {
		// mocks
		const spy = vi.spyOn(apiExpress, 'get');
		const type = createTypeFixture();
		spy.mockImplementation(async (url: string) => {
			if (url.startsWith(endpoints.seriesLength)) {
				return {
					volumes_bought_tot: 1,
					volumes_read_tot: 1
				};
			}
			if (url.startsWith(endpoints.types)) {
				return [type];
			}
			throw new Error('this url is not allowed');
		});

		// mount
		const wrapper = mountStats();

		expect(wrapper.findAll('.placeholder').length).toBeGreaterThan(0);

		// wait async requests
		await flushPromises();

		let tbody_th = wrapper.find('tbody > tr > th');
		let tbody_td = wrapper.findAll('tbody > tr > td');
		expect(tbody_th.text()).contain('ALL');
		expect(tbody_td[0].text()).contain('1');
		expect(tbody_td[1].text()).contain('1');
		expect(wrapper.findAll('.placeholder').length).toBe(0);

		await wrapper.findAll('i')[0].trigger('click'); // right arrow

		// wait async requests
		await flushPromises();

		tbody_th = wrapper.find('tbody > tr > th');
		tbody_td = wrapper.findAll('tbody > tr > td');
		expect(tbody_th.text()).contain(type.name);
		expect(tbody_td[0].text()).contain('1');
		expect(tbody_td[1].text()).contain('1');

		await wrapper.findAll('i')[0].trigger('click'); // left arrow

		tbody_th = wrapper.find('tbody > tr > th');
		tbody_td = wrapper.findAll('tbody > tr > td');
		expect(tbody_th.text()).contain('ALL');
		expect(tbody_td[0].text()).contain('1');
		expect(tbody_td[1].text()).contain('1');

		// onmount
		wrapper.unmount();
	});
});
