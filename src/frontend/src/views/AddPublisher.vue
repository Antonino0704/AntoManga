<template>
	<div class="add-publisher container-sm">
		<spinnerLoading ref="spinner" :startWithLoadingFalse="true" />
		<form class="list-inline" @submit.prevent="addPublisher">
			<h1 class="list-inline-item">{{ $t('common.titles.addPublisher') }}</h1>
			<div class="list-inline-item row g-2">
				<div class="col-md">
					<div class="form-floating list-inline-item">
						<input
							type="text"
							class="form-control"
							id="floatingInputGrid"
							v-model="publisher.name"
							maxlength="50"
						/>
						<label for="floatingInputGrid">{{ $t('common.messages.publisherTitle') }}</label>
						<div class="invalid-feedback">{{ $t('common.messages.invalidTitle') }}</div>
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
					<div class="invalid-feedback">{{ $t('common.messages.invalidImage') }}</div>
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
				<label for="floatingTextarea">{{ $t('common.messages.description') }}</label>
				<div class="invalid-feedback">{{ $t('common.messages.invalidDescription') }}</div>
			</div>
			<button class="btn btn-outline-success mt-3">{{ $t('common.buttons.add') }}</button>
		</form>

		<Notification ref="notification" />
	</div>
</template>

<script lang="ts">
import { apiExpress } from '@/utils/APIExpress';
import Notification from '../components/Notification.vue';
import PublisherImagePreview from '../components/PublisherImagePreview.vue';
import spinnerLoading from '../components/SpinnerLoading.vue';
import type { Publisher } from '../@types/interfaces';
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
		async addPublisher() {
			if (this.checkData()) {
				(this.$refs.spinner as InstanceType<typeof spinnerLoading>).startLoading();
				try {
					const response = await apiExpress.post<Publisher>(endpoints.publishers, this.publisher);
					await apiExpress.putImage(`${endpoints.imgPublishers}${response.slug}/`, this.formData);
					(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
						'publisher added with success'
					);
					(this.$refs.spinner as InstanceType<typeof spinnerLoading>).finishLoading();
					setTimeout(
						() =>
							this.$router.push({
								name: 'PublisherDetail',
								params: { slug: response.slug }
							}),
						1000
					);
				} catch (err) {
					console.log(err);
				}
			} else {
				document.querySelector('#floatingInputGrid')!.className = 'form-control';
				document.querySelector('#floatingTextarea')!.className = 'form-control';
				this.showErrors();
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(this.error);
			}
		},
		checkData(): boolean {
			if (!this.imageUploaded) {
				this.error = this.$t('addPublisherView.errors.imageLoaded');
				return false;
			}
			if (!this.publisher.name || !this.publisher.description) {
				this.error = this.$t('addPublisherView.errors.titleOrDescription');
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
