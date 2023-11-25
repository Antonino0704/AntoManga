<template>
	<div class="Notification">
		<div v-show="liveToastStatus" class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
			<div ref="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
				<div class="toast-header">
					<strong class="me-auto">AntoManga</strong>
					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="toast"
						aria-label="Close"
					></button>
				</div>
				<p class="toast-body">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-exclamation-triangle-fill"
						viewBox="0 0 16 16"
					>
						<path
							d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"
						/>
					</svg>
					{{ msgNotification }}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-exclamation-triangle-fill"
						viewBox="0 0 16 16"
					>
						<path
							d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"
						/>
					</svg>
				</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Toast } from 'bootstrap';

export default {
	name: 'Notification',
	data() {
		return {
			msgNotification: '',
			liveToast: false
		};
	},
	computed: {
		liveToastStatus() {
			return this.liveToast;
		}
	},
	methods: {
		sendNotification(message: string) {
			this.msgNotification = message;

			this.liveToast = true;
			var toast = new Toast(this.$refs.liveToast);
			toast.show();
		}
	}
};
</script>
