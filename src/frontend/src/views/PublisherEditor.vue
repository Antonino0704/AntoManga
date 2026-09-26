<template>
	<div v-if="publisher.detail">
		<NotFound message="PUBLISHER NOT FOUND" />
	</div>
	<div v-else class="publisher-editor container-sm mt-3">
		<spinnerLoading ref="spinner" />
		<form class="list-inline" @submit.prevent="Update">
			<h1 class="list-inline-item">EDIT PAGE</h1>
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
						@change="updateImage($event)"
					/>
					<label class="input-group-text" for="file-input">
						<i fill="currentColor" class="bi bi-images"> </i>
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
			<button class="btn btn-outline-success mt-3">Update</button>
		</form>

		<Notification ref="notification" />
	</div>
</template>

<script lang="ts">
import { apiExpress } from '@/utils/APIExpress';
import Notification from '../components/Notification.vue';
import NotFound from '../views/NotFound.vue';
import PublisherImagePreview from '../components/PublisherImagePreview.vue';
import spinnerLoading from '../components/SpinnerLoading.vue';
import type { PublisherDetail } from '../@types/interfaces';
import { endpoints } from '@/utils/endpoints';
import { validateImage } from '@/utils/supportedImageExtensions';

export default {
	name: 'PublisherEditor',
	data() {
		return {
			publisher: {} as PublisherDetail,
			imagePublisher: '',
			error: '',
			formData: new FormData(),
			imageUploaded: false
		};
	},
	components: {
		Notification,
		NotFound,
		PublisherImagePreview,
		spinnerLoading
	},
	props: {
		slug: {
			type: String,
			required: true
		}
	},
	methods: {
		async getPublisherData() {
			try {
				this.publisher = await apiExpress.get<PublisherDetail>(
					`${endpoints.publishers}${this.slug}/`
				);
				const response = await apiExpress.get<PublisherDetail>(
					`${endpoints.imgPublishers}${this.slug}/`
				);
				this.imagePublisher = response.image;
				(this.$refs.preview as InstanceType<typeof PublisherImagePreview>).setPreview(
					response.image
				);
			} catch (err) {
				console.log(err);
				this.publisher.detail = `${err}`;
			} finally {
				(this.$refs.spinner as InstanceType<typeof spinnerLoading>).finishLoading();
			}
		},
		async Update() {
			if (this.checkData()) {
				try {
					const response = await apiExpress.put<PublisherDetail>(
						`${endpoints.publishers}${this.slug}/`,
						this.publisher
					);

					if (this.imageUploaded) {
						await apiExpress.putImage(`${endpoints.imgPublishers}${response.slug}/`, this.formData);
						(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
							'publisher and image updated with success'
						);
					} else {
						(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
							'publisher updated with success'
						);
					}
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
			if (!this.publisher.name || !this.publisher.description) {
				this.error = "title or description can't be blank";
				return false;
			}
			return true;
		},
		showErrors() {
			if (!this.publisher.name) {
				document.querySelector('#floatingInputGrid')!.className = 'form-control is-invalid';
			}
			if (!this.publisher.description) {
				document.querySelector('#floatingTextarea')!.className = 'form-control is-invalid';
			}
		},
		async updateImage(event: Event) {
			(this.$refs.spinner as InstanceType<typeof spinnerLoading>).startLoading();
			try {
				if (await validateImage(event.target as InstanceType<typeof HTMLInputElement>)) {
					this.formData.append(
						'image',
						(event.target as InstanceType<typeof HTMLInputElement>).files![0]
					);
					(this.$refs.preview as InstanceType<typeof PublisherImagePreview>).setPreview(
						URL.createObjectURL((event.target as InstanceType<typeof HTMLInputElement>).files![0])
					);
					this.imageUploaded = true;
				} else {
					(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
						'unsupported image '
					);
					document.querySelector<HTMLInputElement>('#file-input')!.value = '';
					(this.$refs.preview as InstanceType<typeof PublisherImagePreview>).setPreview(
						this.imagePublisher
					);
					this.imageUploaded = false;
				}
			} catch (error) {
				console.log(error);
			}
			(this.$refs.spinner as InstanceType<typeof spinnerLoading>).finishLoading();
		}
	},
	async created() {
		await this.getPublisherData();
	}
};
</script>

<style>
.publisher-editor {
	text-align: center;
}

h1 {
	color: red;
}

textarea {
	resize: none;
}

.picture-edit > input {
	display: none;
}
</style>
