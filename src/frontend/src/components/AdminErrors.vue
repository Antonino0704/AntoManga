<template>
	<div class="adminErrors alert alert-danger container-sm mt-5 text-center" role="alert">
		<h1>{{ title }}</h1>
		<p v-if="!user.is_staff">{{ $t('adminErrors.errors.youAreAdmin') }}</p>
		<b>{{ action }}</b> <br /><br />
		<p v-if="!user.is_staff">
			{{ $t('adminErrors.errors.youAreNotAdmin') }}
		</p>
		<router-link :to="{ name: 'Home' }" v-if="!user.is_staff">
			{{ $t('common.messages.goToHome') }}
		</router-link>
		<a :href="adminUrl" v-else>{{ $t('common.messages.goToAdmin') }} </a>
	</div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { mapState } from 'pinia';

export default {
	name: 'AdminErrors',
	props: {
		title: {
			type: String,
			required: true
		},
		action: {
			type: String,
			required: true
		},
		adminUrl: {
			type: String,
			required: true
		}
	},
	computed: {
		...mapState(useUserStore, ['user'])
	}
};
</script>
