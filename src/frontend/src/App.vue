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
	<router-view />
	<toggleTheme />
</template>

<script lang="ts">
import toggleTheme from './components/ToggleTheme.vue';
import isNotAuthenticated from './components/IsNotAuthenticated.vue';
import { apiService } from './utils/APIService';
import { endpoints } from '@/@types/endpoints';

export default {
	name: 'App',
	data() {
		return {
			isNotAuthenticatedVar: true
		};
	},
	components: {
		toggleTheme,
		isNotAuthenticated
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
		}
	},
	created() {
		this.isAuthenticated();
	}
};
</script>

<style></style>
