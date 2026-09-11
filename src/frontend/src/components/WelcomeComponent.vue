<template>
	<div class="welcome">
		<h1 class="text-center">AntoManga</h1>
		<div class="alert alert-success container mt-5" role="alert">
			Antomanga is a website that lets you manage your manga or novel collection in an easy and
			convenient way, while also allowing you to filter the contents of your collection
		</div>
		<div class="d-flex justify-content-center">
			<button @click="welcomePageSeen" class="text-center btn btn-outline-success btn-lg">
				Show me
			</button>
		</div>
	</div>
</template>

<script lang="ts">
export default {
	// eslint-disable-next-line vue/multi-word-component-names
	name: 'Welcome',
	data() {
		return {};
	},
	methods: {
		welcomePageSeen() {
			sessionStorage.setItem('welcomeSeen', 'True');
			this.$router.go(0);
		}
	}
};
</script>
