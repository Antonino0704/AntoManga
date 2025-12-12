<template>
	<div class="not-found pt-5 container-sm mx-auto" style="text-align: center">
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
