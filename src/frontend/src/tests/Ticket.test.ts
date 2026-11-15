import { afterEach, describe, test, expect, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { i18n } from '@/i18n/i18n';
import { apiExpress } from '@/utils/APIExpress';
import { endpoints } from '@/utils/endpoints';
import { createLabel } from './fixtures/data';
import Ticket from '@/views/Ticket.vue';

const t = i18n.global.t;

afterEach(() => {
	vi.restoreAllMocks();
});

function mountTicket() {
	return mount(Ticket, {
		attachTo: document.body,
		global: {
			plugins: [i18n],
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
				spinnerLoading: {
					name: 'SpinnerLoading',
					template: '<div data-test="spinner-stub" />',
					methods: {
						finishLoading: vi.fn(),
						startLoading: vi.fn()
					}
				},
				AdminErrors: {
					name: 'AdminErrors',
					template: '<div data-test="AdminErrors-stub" />'
				}
			},
			mocks: {
				$route: {},
				$router: { push: vi.fn(), replace: vi.fn() }
			}
		}
	});
}

describe('Ticket page tests', () => {
	test('tests when the db has 0 labels', async () => {
		// mocks
		const spy = vi.spyOn(apiExpress, 'get');
		spy.mockImplementation(async (url: string) => {
			if (url.startsWith(endpoints.labels)) {
				return [];
			}
			throw new Error('this url is not allowed');
		});

		// mount Ticket component
		const wrapper = mountTicket();

		// wait async requests
		await flushPromises();

		const ticket = wrapper.find('[data-test="AdminErrors-stub"]');
		expect(ticket.exists()).toBe(true);

		wrapper.unmount();
	});
	test('tests when the db has 1 or more labels', async () => {
		// mocks
		const spy = vi.spyOn(apiExpress, 'get');
		spy.mockImplementation(async (url: string) => {
			if (url.startsWith(endpoints.labels)) {
				return [createLabel()];
			}
			throw new Error('this url is not allowed');
		});

		// mount Ticket component
		const wrapper = mountTicket();

		// wait async requests
		await flushPromises();

		const ticket = wrapper.find('[data-test="AdminErrors-stub"]');
		const button = wrapper.find('button');
		expect(ticket.exists()).toBe(false);
		expect(button.text()).contain(t('common.buttons.send'));

		wrapper.unmount();
	});
	test('tests errors', async () => {
		// mocks
		const spy = vi.spyOn(apiExpress, 'get');
		spy.mockImplementation(async (url: string) => {
			if (url.startsWith(endpoints.labels)) {
				return [createLabel()];
			}
			throw new Error('this url is not allowed');
		});

		// mount Ticket component
		const wrapper = mountTicket();

		// wait async requests
		await flushPromises();

		const button = wrapper.find('button');
		button.trigger('click');

		const errors = wrapper.findAll('.is-invalid');
		expect(errors.length).toBe(3);

		wrapper.unmount();
	});
	test('tests if the title is not valid', async () => {
		// mocks
		const spy = vi.spyOn(apiExpress, 'get');
		spy.mockImplementation(async (url: string) => {
			if (url.startsWith(endpoints.labels)) {
				return [createLabel()];
			}
			throw new Error('this url is not allowed');
		});

		// mount Ticket component
		const wrapper = mountTicket();

		// wait async requests
		await flushPromises();

		// fill fields
		wrapper.find('#emailInputValue').setValue('testmail@mail.com');
		wrapper.find('#descriptionTextArea').setValue('test description');

		const button = wrapper.find('button');
		button.trigger('click');

		const errors = wrapper.findAll('.is-invalid');
		expect(errors.length).toBe(1);

		wrapper.unmount();
	});
	test('tests if email is not valid', async () => {
		// mocks
		const spy = vi.spyOn(apiExpress, 'get');
		spy.mockImplementation(async (url: string) => {
			if (url.startsWith(endpoints.labels)) {
				return [createLabel()];
			}
			throw new Error('this url is not allowed');
		});

		// mount Ticket component
		const wrapper = mountTicket();

		// wait async requests
		await flushPromises();

		// fill fields
		wrapper.find('#titleInput').setValue('test title');
		wrapper.find('#descriptionTextArea').setValue('test description');

		const button = wrapper.find('button');
		button.trigger('click');

		const errors = wrapper.findAll('.is-invalid');
		expect(errors.length).toBe(1);

		wrapper.unmount();
	});
	test('tests if the description is not valid', async () => {
		// mocks
		const spy = vi.spyOn(apiExpress, 'get');
		spy.mockImplementation(async (url: string) => {
			if (url.startsWith(endpoints.labels)) {
				return [createLabel()];
			}
			throw new Error('this url is not allowed');
		});

		// mount Ticket component
		const wrapper = mountTicket();

		// wait async requests
		await flushPromises();

		// fill fields
		wrapper.find('#emailInputValue').setValue('testmail@mail.com');
		wrapper.find('#titleInput').setValue('test title');

		const button = wrapper.find('button');
		button.trigger('click');

		const errors = wrapper.findAll('.is-invalid');
		expect(errors.length).toBe(1);

		wrapper.unmount();
	});
	test('tests the report sending', async () => {
		// mocks
		const spyGet = vi.spyOn(apiExpress, 'get');
		const spyPost = vi.spyOn(apiExpress, 'post');

		spyGet.mockImplementation(async (url: string) => {
			if (url.startsWith(endpoints.labels)) {
				return [createLabel()];
			}
			throw new Error('this url is not allowed');
		});

		spyPost.mockImplementation(async (url: string) => {
			if (url.startsWith(endpoints.createTicket)) {
				return {
					id: 1
				};
			}
			throw new Error('this url is not allowed');
		});

		// mount Ticket component
		const wrapper = mountTicket();

		// wait async requests
		await flushPromises();

		// fill fields
		wrapper.find('#titleInput').setValue('test title');
		wrapper.find('#emailInputValue').setValue('testmail@mail.com');
		wrapper.find('#descriptionTextArea').setValue('test description');

		const button = wrapper.find('button');
		expect(spyPost).toHaveBeenCalledTimes(0);
		button.trigger('click');

		// wait async requests
		await wrapper.vm.$nextTick();
		await flushPromises();

		expect(spyPost).toHaveBeenCalledTimes(1);
		expect(wrapper.find('h1').text()).contain(t('help.messages.sentRequest'));

		wrapper.unmount();
	});
});
