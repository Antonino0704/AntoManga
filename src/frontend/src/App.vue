<template>
	<navbar />
	<div id="app"></div>
	<router-view />
	<toggleTheme />
</template>

<script lang="ts">
import navbar from './components/Navbar.vue';
import toggleTheme from './components/ToggleTheme.vue';

export default {
	name: 'App',
	components: {
		navbar,
		toggleTheme
	}
};
</script>

<style></style>
