<template>
	<div>
		<h1 class="text-center mt-2 text-success" v-if="sent">We have received your request</h1>
		<Notification ref="notification" />
		<spinnerLoading ref="spinner" />
	</div>
	<div class="alert alert-danger container-sm mt-5 text-center" role="alert" v-if="labelError">
		Missing Labels<br />
		If you are an administrator, add a label to the database
	</div>
	<div class="ticket container-sm" v-if="!sent && !labelError">
		<h1 class="text-center mt-2 mb-3">
			<i class="bi bi-question-circle text-info"></i> AntoManga Support
		</h1>
		<form @submit.prevent="sendReport">
			<div class="form-floating mb-3">
				<input
					v-model="ticket.title"
					type="text"
					class="form-control"
					id="titleInput"
					maxlength="20"
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
					v-model="ticket.email"
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
					v-model="ticket.description"
				></textarea>
				<label for="descriptionTextArea">Describe the problem</label>
				<div id="descriptionTextArea" class="invalid-feedback">It can't be blank</div>
			</div>

			<select
				v-model="ticket.label"
				class="form-select mb-3 placeholder"
				aria-label="Default select example"
			>
				<option v-for="label in labels" :key="label.id" :value="label.id">
					{{ label.name }}
				</option>
			</select>
			<button class="btn btn-outline-success">Send</button>
		</form>
	</div>
</template>

<script lang="ts">
import { apiService } from '../utils/APIService';
import { endpoints } from '@/utils/endpoints';
import Notification from '../components/Notification.vue';
import spinnerLoading from '../components/SpinnerLoading.vue';
import type { Ticket, Label } from '../@types/interfaces';

export default {
	// eslint-disable-next-line vue/multi-word-component-names
	name: 'Ticket',
	data() {
		return {
			ticket: { title: '' } as Ticket,
			labels: [] as Array<Label>,
			sent: false,
			regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
			labelError: false
		};
	},
	components: {
		Notification,
		spinnerLoading
	},
	methods: {
		async getLabes() {
			return apiService(endpoints.labels)
				.then((labels: Array<Label>) => {
					if (!labels.length) {
						this.labelError = true;
					} else {
						this.labels.push(...labels);
						this.ticket.label = labels[0].id;
						document.querySelector('select')!.classList.remove('placeholder');
					}
				})
				.then(() => {
					(this.$refs.spinner as InstanceType<typeof spinnerLoading>).finishLoading();
				});
		},
		sendReport() {
			if (this.checkData()) {
				apiService(endpoints.createTicket, 'POST', this.ticket).then((response: any) => {
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
			if (this.ticket.title.length > 20 || this.ticket.title.length == 0) {
				return false;
			}
			if (!this.ticket.email) {
				return false;
			}
			if (!this.ticket.description) {
				return false;
			}
			return true;
		},
		showErrors() {
			if (this.ticket.title.length > 20 || this.ticket.title.length == 0) {
				document.getElementById('titleInput')!.classList.add('is-invalid');
			}
			if (!this.regex.test(this.ticket.email)) {
				document.getElementById('emailInputValue')!.classList.add('is-invalid');
			}
			if (!this.ticket.description) {
				document.getElementById('descriptionTextArea')!.classList.add('is-invalid');
			}
		},
		resetErrors() {
			if (this.ticket.title.length < 20 && this.ticket.title.length != 0) {
				document.getElementById('titleInput')!.classList.remove('is-invalid');
			}

			if (this.regex.test(this.ticket.email)) {
				document.getElementById('emailInputValue')!.classList.remove('is-invalid');
			}
			if (this.ticket.description) {
				document.getElementById('descriptionTextArea')!.classList.remove('is-invalid');
			}
		}
	},
	async created() {
		await this.getLabes();
	}
};
</script>
