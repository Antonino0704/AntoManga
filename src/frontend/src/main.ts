import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import VueCookies from 'vue-cookies';
import { createPinia } from 'pinia';
import { useUserStore } from '@/stores/userStore';

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(VueCookies);
app.use(pinia);

router.beforeEach(async (to, from, next) => {
	const store = useUserStore();
	if (!store.loaded) await store.userMe();

	if (to.meta.requiresAuth && !store.user.is_authenticated) return next('/not-found');
	return next();
});

app.mount('#app');
