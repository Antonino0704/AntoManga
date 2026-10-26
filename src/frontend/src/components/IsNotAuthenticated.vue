<template>
	<div class="isNotAuthenticated container-sm mt-2">
		<div class="alert alert-warning alert-dismissible fade show" role="alert">
			<i18n-t keypath="isNotAuth.message" tag="div" scope="global">
				<template #highlighted>
					<strong>{{ $t('isNotAuth.anonymously') }}</strong>
				</template>
				<template #link>
					<a href="/account/login/">
						{{ $t('isNotAuth.here') }}
					</a>
				</template>
			</i18n-t>
			<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		</div>
	</div>
</template>

<script lang="ts">
export default {
	name: 'isNotAuthenticated'
};
</script>
