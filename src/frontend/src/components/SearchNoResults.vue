<template>
	<div class="SearchNoResults text-center mt-3 fs-1">
		{{ message }}
		<i class="bi bi-emoji-frown"></i>
		<div>
			<i class="fs-4 bi bi-search"></i>
		</div>
	</div>
</template>

<script lang="ts">
export default {
	name: 'SearchNoResults',
	props: {
		message: {
			type: String,
			required: true
		}
	}
};
</script>
