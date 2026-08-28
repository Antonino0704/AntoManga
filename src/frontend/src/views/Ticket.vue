<template>
	<div>
		<h1 class="text-center mt-2 text-success" v-if="sent">We have received your request</h1>
		<Notification ref="notification" />
	</div>
	<div class="ticket container-sm" v-if="!sent">
		<h1 class="text-center mt-2 mb-3">
			<i class="bi bi-question-circle text-info"></i> AntoManga Support
		</h1>
		<form>
			<div class="form-floating mb-3">
				<input
					v-model="request.title"
					type="text"
					class="form-control"
					id="titleInput"
					placeholder="there is a bug..."
				/>
				<label for="titleInput">Title</label>
				<div id="titleInput" class="invalid-feedback">It can't be blank or max 20 char</div>
			</div>

			<div class="form-floating mb-3">
				<input
					type="email"
					class="form-control"
					id="emailInputValue"
					placeholder="name@example.com"
					v-model="request.email"
				/>
				<label for="emailInputValue">Email</label>
				<div id="emailInputValue" class="invalid-feedback">
					Please include an @ in the email address
				</div>
			</div>
			<div class="form-floating mb-3">
				<textarea
					class="form-control"
					placeholder="Leave a comment here"
					id="descriptionTextArea"
					style="height: 100px"
					v-model="request.description"
				></textarea>
				<label for="descriptionTextArea">Describe the problem</label>
				<div id="descriptionTextArea" class="invalid-feedback">It can't be blank</div>
			</div>

			<select v-model="request.label" class="form-select mb-3" aria-label="Default select example">
				<option value="bug">Bug</option>
				<option value="feature">Feature</option>
			</select>
			<button type="button" class="btn btn-success" @click="sendReport()">Send</button>
		</form>
	</div>
</template>

<script lang="ts">
import { apiService } from '../utils/APIService';
import { endpoints } from '@/utils/endpoints';
import Notification from '../components/Notification.vue';

export default {
	// eslint-disable-next-line vue/multi-word-component-names
	name: 'Ticket',
	data() {
		return {
			request: {
				title: '',
				email: '',
				description: '',
				label: 'bug'
			},
			sent: false,
			regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		};
	},
	components: {
		Notification
	},
	methods: {
		sendReport() {
			if (this.checkData()) {
				apiService(endpoints.createTicket, 'POST', this.request).then((response: any) => {
					if (response.id) {
						(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
							'Report sent'
						);
						this.sent = true;
					}
				});
			} else {
				this.resetErrors();
				this.showErrors();
			}
		},
		checkData() {
			if (this.request.title.length > 20 || this.request.title.length == 0) {
				return false;
			}
			if (!this.request.email) {
				return false;
			}
			if (!this.request.description) {
				return false;
			}
			return true;
		},
		showErrors() {
			if (this.request.title.length > 20 || this.request.title.length == 0) {
				document.getElementById('titleInput')!.classList.add('is-invalid');
			}
			if (!this.regex.test(this.request.email)) {
				document.getElementById('emailInputValue')!.classList.add('is-invalid');
			}
			if (!this.request.description) {
				document.getElementById('descriptionTextArea')!.classList.add('is-invalid');
			}
		},
		resetErrors() {
			if (this.request.title.length < 20 && this.request.title.length != 0) {
				document.getElementById('titleInput')!.classList.remove('is-invalid');
			}

			if (this.regex.test(this.request.email)) {
				document.getElementById('emailInputValue')!.classList.remove('is-invalid');
			}
			if (this.request.description) {
				document.getElementById('descriptionTextArea')!.classList.remove('is-invalid');
			}
		}
	}
};
</script>
