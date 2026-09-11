import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/Home.vue';
import SeriesDetail from '../views/SeriesDetail.vue';
import SeriesEditor from '../views/SeriesEditor.vue';
import AddSeries from '../views/AddSeries.vue';
import PublisherDetail from '../views/PublisherDetail.vue';
import PublisherEditor from '../views/PublisherEditor.vue';
import AddPublisher from '../views/AddPublisher.vue';
import TypeView from '../views/Types.vue';
import StatsView from '../views/Stats.vue';
import InfoView from '../views/Info.vue';
import NotFound from '../views/NotFound.vue';
import PublishersRank from '@/views/PublishersRank.vue';
import MyAccount from '@/views/MyAccount.vue';
import Ticket from '@/views/Ticket.vue';

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
			props: true,
			meta: { requiresAuth: true }
		},
		{
			path: '/add/series/',
			name: 'AddSeries',
			component: AddSeries,
			meta: { requiresAuth: true }
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
			props: true,
			meta: { requiresAuth: true }
		},
		{
			path: '/add/publisher/',
			name: 'AddPublisher',
			component: AddPublisher,
			meta: { requiresAuth: true }
		},
		{
			path: '/types/',
			name: 'TypeView',
			component: TypeView
		},
		{
			path: '/stats/',
			name: 'StatsView',
			component: StatsView
		},
		{
			path: '/info/',
			name: 'InfoView',
			component: InfoView
		},
		{
			path: '/publishers-rank/',
			name: 'PublishersRank',
			component: PublishersRank
		},
		{
			path: '/my-account/',
			name: 'MyAccount',
			component: MyAccount,
			meta: { requiresAuth: true }
		},
		{
			path: '/help/',
			name: 'Ticket',
			component: Ticket
		},
		{
			path: '/:pathMatch(.*)*',
			name: 'NotFound',
			component: NotFound
		}
	]
});

export default router;
