<template>
	<navbar />
	<div id="app"></div>
	<router-view />
</template>

<script lang="ts">
import navbar from './components/Navbar.vue';

export default {
	name: 'App',
	components: {
		navbar
	}
};
</script>

<style></style>
