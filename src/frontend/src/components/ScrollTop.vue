<template>
	<div class="ScrollTop">
		<div class="fixed-bottom">
			<i
				@click="scrollTop()"
				class="fs-2 bi bi-arrow-up-circle-fill position-absolute bottom-0 end-0 pe-4 pb-3"
			></i>
		</div>
	</div>
</template>

<script lang="ts">
export default {
	name: 'ScrollTop',
	methods: {
		scrollTop() {
			window.scrollTo(0, 0);
		}
	}
};
</script>
