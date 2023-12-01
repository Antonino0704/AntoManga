<template>
	<div class="add-publisher container-sm">
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

			<div class="mt-3">
				<div class="input-group mb-3">
					<input
						type="file"
						accept="image/*"
						class="form-control"
						id="file-input"
						@change="addImage($event)"
					/>
					<label class="input-group-text" for="file-input">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							class="bi bi-images"
							viewBox="0 0 16 16"
						>
							<path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
							<path
								d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2M14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1M2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10"
							/>
						</svg>
					</label>
					<div class="invalid-feedback">Invalid image</div>
				</div>
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

export default {
	name: 'AddPublisher',
	data() {
		return {
			publisher: {
				name: '',
				description: ''
			},
			formData: new FormData(),
			imageUploaded: false,
			error: ''
		};
	},
	components: {
		Notification
	},
	methods: {
		addImage(event: Event) {
			//doesn't add the image to the server
			if (event.target.files[0].type.startsWith('image/')) {
				this.formData.append('image', event.target.files[0]);
				document.getElementById('file-input').className = 'form-control';
				this.imageUploaded = true;
			} else {
				this.$refs.notification.sendNotification('unsupported image ');
				document.getElementById('file-input').className = 'form-control is-invalid';
				this.imageUploaded = false;
			}
		},
		addPublisher() {
			if (this.checkData()) {
				apiService('publishers/', 'POST', this.publisher).then((response: object) => {
					imageApiService(`image/publishers/${response.slug}/`, 'PUT', this.formData).then(() => {
						this.$refs.notification.sendNotification('publisher added with success');
						setTimeout(
							() =>
								this.$router.push({
									name: 'PublisherDetail',
									params: { slug: response.slug }
								}),
							1000
						);
					});
				});
			} else {
				document.getElementById('floatingInputGrid').className = 'form-control';
				document.getElementById('floatingTextarea').className = 'form-control';
				this.showErrors();
				this.$refs.notification.sendNotification(this.error);
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
				document.getElementById('file-input').className = 'form-control is-invalid';
			}
			if (!this.publisher.name) {
				document.getElementById('floatingInputGrid').className = 'form-control is-invalid';
			}
			if (!this.publisher.description) {
				document.getElementById('floatingTextarea').className = 'form-control is-invalid';
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
