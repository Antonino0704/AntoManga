<template>
	<isNotAuthenticated v-if="!user.is_authenticated" />
	<div class="position-relative pb-5">
		<SettingsModal />
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
	<FooterComponent />
</template>

<script lang="ts">
import isNotAuthenticated from './components/IsNotAuthenticated.vue';
import scrollTop from './components/ScrollTop.vue';
import SettingsModal from './components/SettingsModal.vue';
import FooterComponent from './components/Footer.vue';
import { useUserStore } from '@/stores/userStore';
import { mapState } from 'pinia';

export default {
	name: 'App',
	data() {
		return {
			scrollY: 0
		};
	},
	components: {
		isNotAuthenticated,
		scrollTop,
		SettingsModal,
		FooterComponent
	},
	computed: {
		isHome() {
			return this.$route.name !== 'Home';
		},
		...mapState(useUserStore, ['user'])
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
		getLogo() {
			return `${document.location.origin}/media/icon.png`;
		},
		handleScroll() {
			this.scrollY = window.scrollY;
		}
	},
	created() {
		this.theme();
		console.log('%cNothing to see here', 'color: yellow; font-size: xx-large');
		window.addEventListener('scroll', this.handleScroll);
	}
};
</script>

<style></style>
