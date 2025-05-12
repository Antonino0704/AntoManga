<template>
	<div class="action-notification">
		<div ref="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
			<div class="toast-body">
				{{ msgNotification }}
				<div class="mt-4 pt-2 border-top">
					<button type="button" class="btn btn-outline-warning btn-sm" @click="deleteObj()">
						Confirm
					</button>
					<button type="button" class="btn btn-secondary btn-sm ms-3" data-bs-dismiss="toast">
						Close
					</button>
				</div>
			</div>
		</div>

		<Notification ref="notification" />
	</div>
</template>

<script lang="ts">
import { Toast } from 'bootstrap';
import Notification from '../components/Notification.vue';
import { apiService } from '../utils/APIService';

export default {
	name: 'ActionNotification',
	data() {
		return {
			msgNotification: '',
			confirmMessage: '',
			endpoint: '',
			liveToast: false
		};
	},
	components: {
		Notification
	},
	computed: {
		liveToastStatus() {
			return this.liveToast;
		}
	},
	methods: {
		sendNotification(message: string, confirmMessage: string, url: string) {
			this.msgNotification = message;
			this.endpoint = url;
			this.confirmMessage = confirmMessage;

			this.liveToast = true;
			var toast = new Toast(this.$refs.liveToast);
			toast.show();
		},
		deleteObj() {
			apiService(this.endpoint, 'DELETE').then((reason) => {
				if (reason.protectedErrorDetail) {
					(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
						'Cannot delete this Publisher because other users are using it'
					);
				} else {
					(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
						this.confirmMessage
					);

					setTimeout(() => {
						return this.$router.push({
							name: 'Home'
						});
					}, 1000);
				}
			});
		}
	}
};
</script>
