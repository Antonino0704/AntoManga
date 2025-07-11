<template>
	<div class="add-publisher container-sm">
		<spinnerLoading ref="spinner" :startWithLoadingFalse="true" />
		<form class="list-inline" @submit.prevent="addPublisher">
			<h1 class="list-inline-item">ADD A New Publisher</h1>
			<div class="list-inline-item row g-2">
				<div class="col-md">
					<div class="form-floating list-inline-item">
						<input
							type="text"
							class="form-control"
							id="floatingInputGrid"
							v-model="publisher.name"
						/>
						<label for="floatingInputGrid">Publisher's Title</label>
						<div class="invalid-feedback">Invalid title</div>
					</div>
				</div>
			</div>

			<div class="mt-3 list-inline-item">
				<div class="input-group mb-3">
					<input
						type="file"
						accept="image/*"
						class="form-control"
						id="file-input"
						@change="addImage($event)"
					/>
					<label class="input-group-text" for="file-input">
						<i class="bi bi-images" fill="currentColor"></i>
					</label>
					<div class="invalid-feedback">Invalid image</div>
				</div>

				<PublisherImagePreview class="list-inline-item" ref="preview" />
			</div>

			<div class="form-floating mt-3">
				<textarea
					style="height: 10rem"
					class="form-control"
					id="floatingTextarea"
					v-model="publisher.description"
				></textarea>
				<label for="floatingTextarea">Description</label>
				<div class="invalid-feedback">Invalid description</div>
			</div>
			<button class="btn btn-outline-success mt-3">Add</button>
		</form>

		<Notification ref="notification" />
	</div>
</template>

<script lang="ts">
import { apiService, imageApiService } from '../utils/APIService';
import Notification from '../components/Notification.vue';
import PublisherImagePreview from '../components/PublisherImagePreview.vue';
import spinnerLoading from '../components/SpinnerLoading.vue';
import type { Publisher, User } from '../@types/interfaces';
import { endpoints } from '@/utils/endpoints';
import { validateImage } from '@/utils/supportedImageExtensions';

export default {
	name: 'AddPublisher',
	data() {
		return {
			publisher: {
				name: '',
				description: ''
			} as Publisher,
			formData: new FormData(),
			imageUploaded: false,
			error: ''
		};
	},
	components: {
		Notification,
		PublisherImagePreview,
		spinnerLoading
	},
	beforeRouteEnter(to, from, next) {
		apiService(endpoints.userMe, 'GET').then((response: User) => {
			if (response.is_authenticated) {
				next();
			} else {
				next('/not-found');
			}
		});
	},
	methods: {
		async addImage(event: Event) {
			(this.$refs.spinner as InstanceType<typeof spinnerLoading>).startLoading();
			if (await validateImage(event.target as InstanceType<typeof HTMLInputElement>)) {
				this.formData.append(
					'image',
					(event.target as InstanceType<typeof HTMLInputElement>).files![0]
				);
				(this.$refs.preview as InstanceType<typeof PublisherImagePreview>).setPreview(
					URL.createObjectURL((event.target as InstanceType<typeof HTMLInputElement>).files![0])
				);
				document.querySelector('#file-input')!.className = 'form-control';
				this.imageUploaded = true;
			} else {
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
					'unsupported image '
				);
				document.querySelector('#file-input')!.className = 'form-control is-invalid';
				(this.$refs.preview as InstanceType<typeof PublisherImagePreview>).resetPreview();
				this.imageUploaded = false;
			}
			(this.$refs.spinner as InstanceType<typeof spinnerLoading>).finishLoading();
		},
		addPublisher() {
			if (this.checkData()) {
				apiService(endpoints.publishers, 'POST', this.publisher).then((response: Publisher) => {
					imageApiService(`${endpoints.imgPublishers}${response.slug}/`, 'PUT', this.formData).then(
						() => {
							(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
								'publisher added with success'
							);
							setTimeout(
								() =>
									this.$router.push({
										name: 'PublisherDetail',
										params: { slug: response.slug }
									}),
								1000
							);
						}
					);
				});
			} else {
				document.querySelector('#floatingInputGrid')!.className = 'form-control';
				document.querySelector('#floatingTextarea')!.className = 'form-control';
				this.showErrors();
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(this.error);
			}
		},
		checkData(): boolean {
			if (!this.imageUploaded) {
				this.error = 'image not loaded correctly';
				return false;
			}
			if (!this.publisher.name || !this.publisher.description) {
				this.error = "title or description can't be blank";
				return false;
			}
			return true;
		},
		showErrors() {
			if (!this.imageUploaded) {
				document.querySelector('#file-input')!.className = 'form-control is-invalid';
			}
			if (!this.publisher.name) {
				document.querySelector('#floatingInputGrid')!.className = 'form-control is-invalid';
			}
			if (!this.publisher.description) {
				document.querySelector('#floatingTextarea')!.className = 'form-control is-invalid';
			}
		}
	}
};
</script>

<style>
.add-publisher {
	text-align: center;
}
</style>
