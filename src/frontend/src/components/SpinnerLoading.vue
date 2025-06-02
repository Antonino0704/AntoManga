<template>
	<div class="Spinner">
		<div class="fixed-top">
			<div
				v-if="loading"
				class="spinner-border position-absolute top-50 start-50 mt-5"
				style="width: 3rem; height: 3rem"
				role="status"
			></div>
		</div>
	</div>
</template>

<script lang="ts">
export default {
	name: 'SpinnerLoading',
	data() {
		return {
			loading: true
		};
	},
	methods: {
		startLoading() {
			this.loading = true;
		},
		finishLoading() {
			this.loading = false;
		}
	}
};
</script>
