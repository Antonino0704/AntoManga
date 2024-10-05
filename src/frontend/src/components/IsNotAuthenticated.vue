<template>
	<div class="isNotAuthenticated container-sm mt-2">
		<div class="alert alert-warning alert-dismissible fade show" role="alert">
			you are viewing the site <strong>anonymously.</strong>
			you will be able to view all pages (even the add, edit, and delete buttons) but you consider
			that they will not work
			<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		</div>
	</div>
</template>

<script lang="ts">
export default {
	name: 'isNotAuthenticated'
};
</script>
