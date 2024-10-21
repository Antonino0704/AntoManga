import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/Home.vue';
import SeriesDetail from '../views/SeriesDetail.vue';
import SeriesEditor from '../views/SeriesEditor.vue';
import AddSeries from '../views/AddSeries.vue';
import PublisherDetail from '../views/PublisherDetail.vue';
import PublisherEditor from '../views/PublisherEditor.vue';
import AddPublisher from '../views/AddPublisher.vue';
import TypeView from '../views/Types.vue';
import NotFound from '../views/NotFound.vue';

const router = createRouter({
	history: createWebHistory('/'),
	routes: [
		{
			path: '/',
			name: 'Home',
			component: HomeView
		},
		{
			path: '/series/:slug',
			name: 'SeriesDetail',
			component: SeriesDetail,
			props: true
		},
		{
			path: '/series/:slug/edit',
			name: 'SeriesEditor',
			component: SeriesEditor,
			props: true
		},
		{
			path: '/add/series/',
			name: 'AddSeries',
			component: AddSeries
		},
		{
			path: '/publisher/:slug',
			name: 'PublisherDetail',
			component: PublisherDetail,
			props: true
		},
		{
			path: '/publisher/:slug/edit',
			name: 'PublisherEditor',
			component: PublisherEditor,
			props: true
		},
		{
			path: '/add/publisher/',
			name: 'AddPublisher',
			component: AddPublisher
		},
		{
			path: '/types/',
			name: 'TypeView',
			component: TypeView
		},
		{
			path: '/:pathMatch(.*)*',
			name: 'NotFound',
			component: NotFound
		}
	],
	scrollBehavior(to, from, savedPosition) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (savedPosition) {
					return resolve(savedPosition);
				}
			}, 1200);
		});
	}
});

export default router;
