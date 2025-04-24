<template>
	<div
		class="not-found container-sm position-absolute top-50 start-50 translate-middle"
		style="text-align: center"
	>
		<i fill="currentColor" class="bi bi-emoji-frown fs-1"> </i>
		<p class="mt-2">{{ message }}</p>
		<router-link :to="{ name: 'Home' }"> GO TO HOME </router-link>
	</div>
</template>

<script lang="ts">
export default {
	name: 'NotFound',
	props: {
		message: {
			type: String,
			required: true,
			default: 'PAGE NOT FOUND'
		}
	}
};
</script>
