import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/Home.vue';
import SerieDetail from '../views/SerieDetail.vue';
import PublisherDetail from '../views/PublisherDetail.vue';
import PublisherEditor from '../views/PublisherEditor.vue';
import AddPublisher from '../views/AddPublisher.vue';

const router = createRouter({
	history: createWebHistory('/'),
	routes: [
		{
			path: '/',
			name: 'Home',
			component: HomeView
		},
		{
			path: '/serie/:slug',
			name: 'SerieDetail',
			component: SerieDetail
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
		}
	]
});

export default router;
