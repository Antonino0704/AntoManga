<template>
	<div v-if="publisher.detail">
		<NotFound message="PUBLISHER NOT FOUND" />
	</div>
	<div v-else class="publisher-editor container-sm mt-3">
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
						/>
						<label for="floatingInputGrid">Publisher's Title</label>
						<div class="invalid-feedback">Invalid title</div>
					</div>
				</div>
			</div>

			<div class="picture-edit">
				<label for="file-input">
					<img
						:src="imagePublisher"
						class="list-inline-item rounded-circle mt-2"
						style="width: 200px"
					/>
				</label>
				<input type="file" accept="image/*" id="file-input" @change="updateImage($event)" />
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
import { apiService, imageApiService } from '../utils/APIService';
import Notification from '../components/Notification.vue';
import NotFound from '../views/NotFound.vue';
import type { PublisherDetail } from '../@types/interfaces';
import { endpoints } from '@/utils/endpoints';

export default {
	name: 'PublisherEditor',
	data() {
		return {
			publisher: {} as PublisherDetail,
			imagePublisher: '',
			error: ''
		};
	},
	components: {
		Notification,
		NotFound
	},
	props: {
		slug: {
			type: String,
			required: true
		}
	},
	beforeRouteEnter(to, from, next) {
		apiService(endpoints.isAuthenticated, 'GET').then((response: any) => {
			if (response.result) {
				next();
			} else {
				next('/not-found');
			}
		});
	},
	methods: {
		getPublisherData() {
			apiService(`${endpoints.publishers}${this.slug}/`).then((data: PublisherDetail) => {
				this.publisher = data;
			});
		},
		getImagePublisherData() {
			apiService(`${endpoints.imgPublishers}${this.slug}/`).then((data: PublisherDetail) => {
				this.imagePublisher = data.image;
			});
		},
		Update() {
			if (this.checkData()) {
				apiService(`${endpoints.publishers}${this.slug}/`, 'PUT', this.publisher).then(
					(response: PublisherDetail) => {
						(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
							'publisher updated with success'
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
		updateImage(event: Event) {
			try {
				if (
					(event.target as InstanceType<typeof HTMLInputElement>).files![0].type.startsWith(
						'image/'
					)
				) {
					let data = new FormData();
					data.append('image', (event.target as InstanceType<typeof HTMLInputElement>).files![0]);
					imageApiService(`v1/image/publishers/${this.slug}/`, 'PUT', data).then(() => {
						(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
							"publisher's image updated with success"
						);
						setTimeout(
							() =>
								this.$router.push({
									name: 'PublisherDetail',
									params: { slug: this.publisher.slug }
								}),
							1000
						);
					});
				} else {
					(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
						'unsupported image '
					);
				}
			} catch (error) {
				console.log(error);
			}
		}
	},
	created() {
		this.getPublisherData();
		this.getImagePublisherData();
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
