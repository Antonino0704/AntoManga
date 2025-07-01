<template>
	<div class="settingsmodal">
		<div
			class="modal fade"
			id="settingsModal"
			tabindex="-1"
			aria-labelledby="settingsModalLabel"
			aria-hidden="true"
		>
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<h1 class="modal-title fs-5 text-secondary" id="settingsModalLabel">SETTINGS</h1>
						<button
							type="button"
							class="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
					</div>
					<div class="modal-body">
						<a type="button" class="btn btn-secondary" href="/change-password/">Change Password</a>
						<hr />
						<a type="button" class="btn btn-secondary" v-if="user.is_staff" href="/admin/">Admin</a>
						<hr v-if="user.is_staff" />
						<a type="button" class="btn btn-danger" href="/accounts/logout/">LOGOUT</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { apiService } from '../utils/APIService';
import { endpoints } from '@/utils/endpoints';
import type { User } from '../@types/interfaces';

export default {
	name: 'SettingsModal',
	data() {
		return {
			user: {} as User
		};
	},
	methods: {
		isStaff() {
			apiService(endpoints.userMe).then((user: User) => {
				this.user = user;
			});
		}
	},
	created() {
		this.isStaff();
	}
};
</script>

<style>
.settingsmodal {
	text-align: center;
}
</style>
