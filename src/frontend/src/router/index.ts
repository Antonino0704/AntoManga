import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/Home.vue';
import SerieDetail from '../views/SerieDetail.vue';
import SerieEditor from '../views/SerieEditor.vue';
import AddSerie from '../views/AddSerie.vue';
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
			path: '/serie/:slug',
			name: 'SerieDetail',
			component: SerieDetail,
			props: true
		},
		{
			path: '/serie/:slug/edit',
			name: 'SerieEditor',
			component: SerieEditor,
			props: true
		},
		{
			path: '/add/serie/',
			name: 'AddSerie',
			component: AddSerie
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
	]
});

export default router;
