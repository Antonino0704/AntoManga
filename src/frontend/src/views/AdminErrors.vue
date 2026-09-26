<template>
	<div class="adminErrors alert alert-danger container-sm mt-5 text-center" role="alert">
		<h1>{{ title }}</h1>
		<p v-if="!user.is_staff">If you are an administrator</p>
		<b>{{ action }}</b> <br /><br />
		<p v-if="!user.is_staff">
			If you're not an administrator, contact your administrator or wait for them to fix the issue
		</p>
		<router-link :to="{ name: 'Home' }" v-if="!user.is_staff"> GO TO HOME </router-link>
		<a href="/admin/" v-else>GO TO ADMIN</a>
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
		}
	},
	computed: {
		...mapState(useUserStore, ['user'])
	}
};
</script>
