<template>
	<isNotAuthenticated v-if="isNotAuthenticatedVar" />
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
	<toggleTheme />
</template>

<script lang="ts">
import toggleTheme from './components/ToggleTheme.vue';
import isNotAuthenticated from './components/IsNotAuthenticated.vue';
import scrollTop from './components/ScrollTop.vue';
import { apiService } from './utils/APIService';
import { endpoints } from '@/utils/endpoints';

export default {
	name: 'App',
	data() {
		return {
			isNotAuthenticatedVar: false,
			scrollY: 0
		};
	},
	components: {
		toggleTheme,
		isNotAuthenticated,
		scrollTop
	},
	computed: {
		isHome() {
			return this.$route.name !== 'Home';
		}
	},
	methods: {
		isAuthenticated() {
			console.log('%cNothing to see here', 'color: yellow; font-size: xx-large');
			apiService(endpoints.isAuthenticated, 'GET').then((response: any) => {
				this.isNotAuthenticatedVar = !response.result;
			});
		},
		getLogo() {
			return `${document.location.origin}/media/icon.png`;
		},
		handleScroll() {
			this.scrollY = window.scrollY;
		}
	},
	created() {
		this.isAuthenticated();
		window.addEventListener('scroll', this.handleScroll);
	}
};
</script>

<style></style>
