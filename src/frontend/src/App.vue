<template>
	<isNotAuthenticated v-if="!user.is_authenticated" />
	<div class="position-relative pb-5">
		<SettingsModal :user="user" />
	</div>
	<nav class="navabar row justify-content-center mt-2" v-if="isHome">
		<div class="col-auto">
			<a class="navbar-brand mb-2" href="/">
				<img :src="getLogo()" alt="logo" width="30" height="30" />
			</a>
		</div>
	</nav>

	<div id="app"></div>
	<scrollTop v-if="scrollY > 300" />
	<router-view />
	<footer class="pt-4" style="text-align: center">{{ getFooter() }}</footer>
</template>

<script lang="ts">
import isNotAuthenticated from './components/IsNotAuthenticated.vue';
import scrollTop from './components/ScrollTop.vue';
import { apiService } from './utils/APIService';
import { endpoints } from '@/utils/endpoints';
import type { User } from './@types/interfaces';
import SettingsModal from './components/SettingsModal.vue';

export default {
	name: 'App',
	data() {
		return {
			user: { is_authenticated: true } as User,
			scrollY: 0
		};
	},
	components: {
		isNotAuthenticated,
		scrollTop,
		SettingsModal
	},
	computed: {
		isHome() {
			return this.$route.name !== 'Home';
		}
	},
	methods: {
		theme() {
			let theme = localStorage.getItem('theme-cookie');
			if (theme == null) {
				theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
			}
			if (theme == 'light') {
				document.documentElement.setAttribute('data-bs-theme', 'light');
			} else {
				document.documentElement.setAttribute('data-bs-theme', 'dark');
			}
		},
		isAuthenticated() {
			console.log('%cNothing to see here', 'color: yellow; font-size: xx-large');
			apiService(endpoints.userMe, 'GET').then((response: User) => {
				this.user = response;
			});
		},
		getLogo() {
			return `${document.location.origin}/media/icon.png`;
		},
		handleScroll() {
			this.scrollY = window.scrollY;
		},
		getFooter() {
			return `© 2023 - ${new Date().getFullYear()} Antonino Buscarino`;
		}
	},
	created() {
		this.theme();
		this.isAuthenticated();
		window.addEventListener('scroll', this.handleScroll);
	}
};
</script>

<style></style>
