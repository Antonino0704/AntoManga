<template>
	<div class="welcome">
		<h1 class="text-center">AntoManga</h1>
		<div class="alert alert-success container mt-5" role="alert">
			{{ $t('common.messages.welcomeComponent') }}
		</div>
		<div class="d-flex justify-content-center">
			<button @click="welcomePageSeen" class="text-center btn btn-outline-success btn-lg">
				{{ $t('common.buttons.showMe') }}
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
