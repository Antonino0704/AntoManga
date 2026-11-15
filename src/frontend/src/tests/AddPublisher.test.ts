import { afterEach, describe, test, expect, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { i18n } from '@/i18n/i18n';
import { apiExpress } from '@/utils/APIExpress';
import { endpoints } from '@/utils/endpoints';
import { createPublisherFixture } from './fixtures/data';
import AddPublisher from '@/views/AddPublisher.vue';

afterEach(() => {
	vi.restoreAllMocks();
});

function mountAddPublisher() {
	return mount(AddPublisher, {
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
				PublisherImagePreview: {
					name: 'PublisherImagePreview',
					template: '<img data-test="PublisherImagePreview-stub" src="fake-url" />'
				}
			},
			mocks: {
				$route: {},
				$router: { push: vi.fn(), replace: vi.fn() }
			}
		}
	});
}

describe('Add publisher tests', () => {
	test('tests when all is not valid', async () => {
		// mount AddPublisher component
		const wrapper = mountAddPublisher();

		// wait async requests
		await flushPromises();

		const button = wrapper.find('button');
		button.trigger('click');

		// wait async requests
		await wrapper.vm.$nextTick();
		await flushPromises();

		expect(wrapper.findAll('.is-invalid').length).toBe(3);

		// fill fields, image excluded
		wrapper.find('#floatingInputGrid').setValue('test title');
		wrapper.find('#floatingTextarea').setValue('test description');

		button.trigger('click');
		await wrapper.vm.$nextTick();
		await flushPromises();

		expect(wrapper.findAll('.is-invalid').length).toBe(1);

		wrapper.unmount();
	});
	test('tests if the title is not valid', async () => {
		// mount AddPublisher component
		const wrapper = mountAddPublisher();

		// wait async requests
		await flushPromises();

		//fill fields
		wrapper.find('#floatingTextarea').setValue('test description');
		wrapper.vm.$data.imageUploaded = true;

		const button = wrapper.find('button');
		button.trigger('click');

		// wait async requests
		await wrapper.vm.$nextTick();
		await flushPromises();

		expect(wrapper.findAll('.is-invalid').length).toBe(1);
		wrapper.unmount();
	});
	test('tests if the description is not valid', async () => {
		// mount AddPublisher component
		const wrapper = mountAddPublisher();

		// wait async requests
		await flushPromises();

		//fill fields
		wrapper.find('#floatingInputGrid').setValue('test title');
		wrapper.vm.$data.imageUploaded = true;

		const button = wrapper.find('button');
		button.trigger('click');

		// wait async requests
		await wrapper.vm.$nextTick();
		await flushPromises();

		expect(wrapper.findAll('.is-invalid').length).toBe(1);
		wrapper.unmount();
	});
	test('tests if the image is not valid', async () => {
		// mount AddPublisher component
		const wrapper = mountAddPublisher();

		// wait async requests
		await flushPromises();

		//fill fields
		wrapper.find('#floatingInputGrid').setValue('test title');
		wrapper.find('#floatingTextarea').setValue('test description');

		const button = wrapper.find('button');
		button.trigger('click');

		// wait async requests
		await wrapper.vm.$nextTick();
		await flushPromises();

		expect(wrapper.findAll('.is-invalid').length).toBe(1);
		wrapper.unmount();
	});
	test('tests if all work', async () => {
		// mocks
		const spyPost = vi.spyOn(apiExpress, 'post');
		const spyPut = vi.spyOn(apiExpress, 'putImage');

		spyPost.mockImplementation(async (url: string) => {
			if (url.startsWith(endpoints.publishers)) {
				return createPublisherFixture();
			}
			throw new Error('this url is not allowed');
		});
		spyPut.mockImplementation(async (url: string) => {
			if (url.startsWith(endpoints.imgPublishers)) {
				return null;
			}
			throw new Error('this url is not allowed');
		});
		vi.useFakeTimers();

		// mount AddPublisher component
		const wrapper = mountAddPublisher();

		// wait async requests
		await flushPromises();

		//fill fields
		wrapper.find('#floatingInputGrid').setValue('test title');
		wrapper.find('#floatingTextarea').setValue('test description');
		wrapper.vm.$data.imageUploaded = true;

		expect(spyPost).toHaveBeenCalledTimes(0);
		expect(spyPut).toHaveBeenCalledTimes(0);

		const button = wrapper.find('button');
		button.trigger('click');

		// wait async requests
		await wrapper.vm.$nextTick();
		await flushPromises();

		expect(spyPost).toHaveBeenCalledTimes(1);
		expect(spyPut).toHaveBeenCalledTimes(1);

		vi.advanceTimersByTime(1000);

		expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1);
		wrapper.unmount();
	});
});
