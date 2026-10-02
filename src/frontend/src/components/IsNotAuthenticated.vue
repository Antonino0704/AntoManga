<template>
	<div class="isNotAuthenticated container-sm mt-2">
		<div class="alert alert-warning alert-dismissible fade show" role="alert">
			<div v-html="$t('isNotAuth.message')"></div>
			<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		</div>
	</div>
</template>

<script lang="ts">
export default {
	name: 'isNotAuthenticated'
};
</script>
