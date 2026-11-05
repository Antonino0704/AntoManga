import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import VueCookies from 'vue-cookies';
import { createPinia } from 'pinia';
import { useUserStore } from '@/stores/userStore';
import { i18n } from '@/i18n/i18n';

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(VueCookies);
app.use(pinia);
app.use(i18n);

router.beforeEach(async (to) => {
	const store = useUserStore();
	if (!store.loaded) await store.userMe();

	if (to.meta.requiresAuth && !store.user.is_authenticated) return '/not-found';
	return true;
});

app.mount('#app');
