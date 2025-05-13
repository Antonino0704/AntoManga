<template>
	<div class="isNotAuthenticated container-sm mt-2">
		<div class="alert alert-warning alert-dismissible fade show" role="alert">
			You are viewing the site <strong>anonymously.</strong> Click
			<a href="/accounts/login/?next=/">here</a> to login so you can add and edit your series
			<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		</div>
	</div>
</template>

<script lang="ts">
export default {
	name: 'isNotAuthenticated'
};
</script>
