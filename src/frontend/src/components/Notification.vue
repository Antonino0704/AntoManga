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
					<i class="bi bi-exclamation-triangle-fill" fill="currentColor"></i>
					{{ msgNotification }}
					<i class="bi bi-exclamation-triangle-fill" fill="currentColor"></i>
				</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Toast } from 'bootstrap';

export default {
	// eslint-disable-next-line vue/multi-word-component-names
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
