import { beforeEach, afterEach, describe, test, expect, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { i18n } from '@/i18n/i18n';
import { useUserStore } from '@/stores/userStore';
import { apiExpress } from '@/utils/APIExpress';
import { endpoints } from '@/utils/endpoints';
import { moreData, moreDataImage } from '@/utils/getSeries';
import { createRequestObject, createSeriesCompleteFixture } from './fixtures/data';
import HomeView from '@/views/Home.vue';
import Navbar from '../components/Navbar.vue';

const pinia = createPinia();
const store = useUserStore(pinia);

vi.mock('@/utils/getSeries', () => ({
	moreData: vi.fn(),
	moreDataImage: vi.fn()
}));

beforeEach(() => {
	window.scrollTo = vi.fn();
	store.profile.user = {
		username: 'fake user',
		is_authenticated: true,
		is_staff: false
	};
});

afterEach(() => {
	vi.restoreAllMocks();
});

function mountHome(query = {}) {
	return mount(HomeView, {
		global: {
			plugins: [pinia, i18n],
			renderStubDefaultSlot: true,
			stubs: {
				RouterLink: true,
				RouterView: true,
				Navbar: {
					template: '<nav />'
				},
				spinnerLoading: {
					name: 'SpinnerLoading',
					template: '<div data-test="spinner-stub" />',
					methods: {
						finishLoading: vi.fn(),
						startLoading: vi.fn()
					}
				},
				WelcomeComponent: {
					template: '<span data-test="welcome"> Welcome Component </span>'
				}
			},
			mocks: {
				$route: { query },
				$router: { push: vi.fn(), replace: vi.fn() }
			}
		}
	});
}

describe('HomePage', () => {
	test('Shows cards', async () => {
		// mocks
		const spy = vi.spyOn(apiExpress, 'get');
		const seriesCompleteFixtureRequestObject = createRequestObject({
			results: [createSeriesCompleteFixture()]
		});

		spy.mockImplementation(async (url: string) => {
			if (url.startsWith(endpoints.series)) {
				return { ...seriesCompleteFixtureRequestObject };
			}
			if (url.startsWith(endpoints.imgSeries)) {
				return { ...seriesCompleteFixtureRequestObject };
			}
			throw new Error('this url is not allowed');
		});

		// mount HomeView component
		const wrapper = mountHome();

		// wait async requests
		await flushPromises();

		const cards = wrapper.findAll('.card');
		expect(cards).toHaveLength(1);
		expect(cards[0].text()).contain(seriesCompleteFixtureRequestObject.results[0].name);
		expect(cards[0].text()).contain(seriesCompleteFixtureRequestObject.results[0].typology_name);
		expect(cards[0].text()).contain(seriesCompleteFixtureRequestObject.results[0].publisher_name);

		// unmount HomeView component
		wrapper.unmount();
	});
	test('Shows WelcomeComponent when user is not authenticated', async () => {
		// mocks
		const spy = vi.spyOn(apiExpress, 'get');
		const seriesCompleteFixtureRequestObject = createRequestObject({
			results: [createSeriesCompleteFixture()]
		});

		store.profile.user = {
			username: '',
			is_authenticated: false,
			is_staff: false
		};

		spy.mockImplementation(async (url: string) => {
			if (url.startsWith(endpoints.series)) {
				return { ...seriesCompleteFixtureRequestObject };
			}
			if (url.startsWith(endpoints.imgSeries)) {
				return { ...seriesCompleteFixtureRequestObject };
			}
			throw new Error('this url is not allowed');
		});

		// mount HomeView component
		const wrapper = mountHome();

		// wait async requests
		await flushPromises();

		const cards = wrapper.findAll('.card');
		const welcomeComp = wrapper.find('[data-test="welcome"]');

		expect(cards).toHaveLength(0);
		expect(welcomeComp.text()).contain('Welcome Component');

		// unmount HomeView component
		wrapper.unmount();
	});
	test('tests more button', async () => {
		// mocks
		const spy = vi.spyOn(apiExpress, 'get');
		const seriesCompleteFixtureRequestObject = createRequestObject({
			results: [createSeriesCompleteFixture()]
		});

		spy.mockImplementation(async (url: string) => {
			if (url.startsWith(endpoints.series)) {
				const series = createRequestObject({
					results: [createSeriesCompleteFixture()]
				});
				series.next = 'moreUrl';
				return series;
			}
			if (url.startsWith(endpoints.imgSeries)) {
				const series = createRequestObject({
					results: [createSeriesCompleteFixture()]
				});
				series.next = 'moreUrlImage';
				return series;
			}
			throw new Error('this url is not allowed');
		});

		const series2Fixture = createRequestObject({
			results: [createSeriesCompleteFixture()]
		});
		series2Fixture.results[0].name = 'series2';
		series2Fixture.results[0].id = 2;
		series2Fixture.results[0].image = 'series2 image';
		vi.mocked(moreData).mockResolvedValue(series2Fixture);
		vi.mocked(moreDataImage).mockResolvedValue({
			...series2Fixture,
			results: [series2Fixture.results[0].image]
		});

		// mount HomeView component
		const wrapper = mountHome();

		// wait async requests
		await flushPromises();

		let cards = wrapper.findAll('.card');
		const moreButton = wrapper.find('button');
		expect(cards).toHaveLength(1);

		// click more button
		await moreButton.trigger('click');
		cards = wrapper.findAll('.card');
		expect(cards).toHaveLength(2);
		const imageCards = wrapper.findAll('.card img');

		// name and images checks
		expect(cards[0].text()).contain(seriesCompleteFixtureRequestObject.results[0].name);
		expect(cards[1].text()).contain(series2Fixture.results[0].name);
		expect(imageCards[0].attributes('src')).toBe(
			seriesCompleteFixtureRequestObject.results[0].image
		);
		expect(imageCards[1].attributes('src')).toBe(series2Fixture.results[0].image);

		// unmount HomeView component
		wrapper.unmount();
	});
	test('tests search event', async () => {
		// mocks
		const spy = vi.spyOn(apiExpress, 'get');
		const urlFilter = 'v7/series/?type=1&filterbyname=seriesName&publisher=1&purchased_at=desc';

		spy.mockImplementation(async (url: string) => {
			if (url === urlFilter) {
				return createRequestObject({
					results: [],
					count: 0
				});
			}
			if (url.startsWith(endpoints.series)) {
				return createRequestObject({
					results: [createSeriesCompleteFixture()]
				});
			}
			if (url.startsWith(endpoints.imgSeries)) {
				return createRequestObject({
					results: [createSeriesCompleteFixture()]
				});
			}

			throw new Error('this url is not allowed');
		});

		// mount HomeView component
		const wrapper = mountHome();

		// wait async requests
		await flushPromises();

		const navbar = wrapper.findComponent(Navbar);
		navbar.vm.$emit('filterEvent', [1], 'seriesName', [1], [1]);
		// wait async requests
		await wrapper.vm.$nextTick();
		await flushPromises();

		const cards = wrapper.findAll('.card');
		expect(cards).toHaveLength(0);
		wrapper.unmount();
	});
	test('tests filters on created', async () => {
		// mocks
		const spy = vi.spyOn(apiExpress, 'get');
		const urlFilter = 'v7/series/?type=1&filterbyname=test&publisher=1&purchased_at=desc';
		const series = createSeriesCompleteFixture();

		spy.mockImplementation(async (url: string) => {
			if (url === urlFilter) {
				return createRequestObject({
					results: [series],
					count: 0
				});
			}
			if (url.startsWith(endpoints.imgSeries)) {
				return createRequestObject({
					results: [createSeriesCompleteFixture()]
				});
			}

			throw new Error('this url is not allowed');
		});

		// mount HomeView component
		const wrapper = mountHome({
			type: '1',
			filterbyname: 'test',
			publisher: '1',
			purchased_at: 'desc'
		});
		// wait async requests
		await flushPromises();

		const cards = wrapper.findAll('.card');
		expect(cards).toHaveLength(1);
		expect(cards[0].text()).contain(series.name);
		wrapper.unmount();
	});
});
