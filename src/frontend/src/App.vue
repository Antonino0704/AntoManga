<template>
	<isNotAuthenticated v-if="isNotAuthenticatedVar" />
	<navbar />
	<div id="app"></div>
	<router-view />
	<toggleTheme />
</template>

<script lang="ts">
import navbar from './components/Navbar.vue';
import toggleTheme from './components/ToggleTheme.vue';
import isNotAuthenticated from './components/IsNotAuthenticated.vue';
import { apiService } from './utils/APIService';

export default {
	name: 'App',
	data() {
		return {
			isNotAuthenticatedVar: true
		};
	},
	components: {
		navbar,
		toggleTheme,
		isNotAuthenticated
	},
	methods: {
		isAuthenticated() {
			apiService('isAuthenticated/', 'GET', undefined, 'v2/').then((response: any) => {
				this.isNotAuthenticatedVar = !response.result;
			});
		}
	},
	created() {
		this.isAuthenticated();
	}
};
</script>

<style></style>
