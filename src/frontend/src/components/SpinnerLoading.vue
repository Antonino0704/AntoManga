<template>
	<div class="Spinner">
		<div class="fixed-top d-flex justify-content-center">
			<div
				v-if="loading"
				class="spinner-border mt-5"
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
