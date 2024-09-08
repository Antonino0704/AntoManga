<template>
	<div class="add-serie container-sm mt-2">
		<form class="list-inline" @submit.prevent="addSerie">
			<h1 class="list-inline-item">ADD A New Manga</h1>
			<div class="list-inline-item row g-2">
				<div class="col-md">
					<div class="form-floating list-inline-item">
						<input type="text" class="form-control" id="floatingInputGrid" v-model="serie.name" />
						<label for="floatingInputGrid">Serie's Title</label>
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

			<div class="placeholder-glow mt-3">
				<select
					id="typeSelect"
					class="form-select-sm placeholder"
					aria-hidden="true"
					v-model="serie.typology"
				>
					<option v-for="type in types" :key="type.id" :value="type.id" :id="'IDType-' + type.id">
						{{ type.name }}
					</option>
				</select>
			</div>

			<div class="placeholder-glow mt-3">
				<select id="publisherSelect" class="form-select-sm placeholder" v-model="serie.publisher">
					<option
						v-for="publisher in publishers"
						:key="publisher.id"
						:value="publisher.id"
						:id="'IDPublisher-' + publisher.id"
					>
						{{ publisher.name }}
					</option>
				</select>
			</div>

			<ul class="list-group mt-5">
				<li class="list-group-item statistics">
					<div class="input-group flex-nowrap">
						<span class="input-group-text" id="addon-wrapping">N. Volumes</span>
						<input
							id="inputNVol"
							type="number"
							class="form-control"
							aria-label="n_volumes"
							aria-describedby="addon-wrapping"
							v-model="serie.n_volumes"
						/>
					</div>
				</li>
				<li class="list-group-item statistics">
					<div class="input-group flex-nowrap">
						<span class="input-group-text" id="addon-wrapping">Vol. Bought</span>
						<input
							id="inputBought"
							type="number"
							class="form-control"
							aria-label="n_volumes"
							aria-describedby="addon-wrapping"
							v-model="serie.volumes_bought"
						/>
					</div>
				</li>
				<li class="list-group-item statistics">
					<div class="input-group flex-nowrap">
						<span class="input-group-text" id="addon-wrapping">Vol. Read</span>
						<input
							id="inputRead"
							type="number"
							class="form-control"
							aria-describedby="addon-wrapping"
							v-model="serie.volumes_read"
						/>
					</div>
				</li>
			</ul>

			<button class="btn btn-outline-success mt-3">Add</button>
		</form>

		<Notification ref="notification" />
	</div>
</template>

<script lang="ts">
import { apiService, imageApiService } from '../utils/APIService';
import Notification from '../components/Notification.vue';
import type { Series, Type, Publisher } from '../@types/interfaces';

export default {
	name: 'AddSerie',
	data() {
		return {
			serie: {
				n_volumes: 1,
				volumes_bought: 0,
				volumes_read: 0,
				typology: 0,
				publisher: ''
			} as Series,
			formData: new FormData(),
			imageUploaded: false,
			types: [] as Array<Type>,
			publishers: [] as Array<Publisher>,
			error: ''
		};
	},
	components: {
		Notification
	},
	methods: {
		getTypes() {
			apiService('types/').then((data: Array<Type>) => {
				for (let i = 0; i < data.length; i++) {
					this.types.push(data[i]);
				}
				//wait for options to load
				setTimeout(() => {
					this.serie.typology = parseInt(
						document.querySelector<HTMLOptionElement>('#typeSelect > option')!.value
					);
					document.querySelector<HTMLOptionElement>('#typeSelect > option')!.selected = true;
					document.querySelector<HTMLSelectElement>('#typeSelect')!.className = 'form-select-sm';
				}, 500);
			});
		},
		getPublishers() {
			apiService('publishers/').then((data: Array<any>) => {
				for (let i = 0; i < data.length; i++) {
					this.publishers.push(data[i]);
				}
				//wait for options to load
				setTimeout(() => {
					this.serie.publisher = document.querySelector<HTMLOptionElement>(
						'#publisherSelect > option'
					)!.value;
					document.querySelector<HTMLOptionElement>('#publisherSelect > option')!.selected = true;
					document.querySelector<HTMLSelectElement>('#publisherSelect')!.className =
						'form-select-sm';
				}, 500);
			});
		},
		addImage(event: Event) {
			//doesn't add the image to the server
			if ((<HTMLInputElement>event.target).files![0].type.startsWith('image/')) {
				this.formData.append('image', (<HTMLInputElement>event.target).files![0]);
				document.querySelector('#file-input')!.className = 'form-control';
				this.imageUploaded = true;
			} else {
				(<any>this.$refs.notification).sendNotification('unsupported image ');
				document.querySelector('#file-input')!.className = 'form-control is-invalid';
				this.imageUploaded = false;
			}
		},
		addSerie() {
			if (this.checkData()) {
				apiService('series/', 'POST', this.serie).then((response: Series) => {
					imageApiService(`image/series/${response.slug}/`, 'PUT', this.formData).then(() => {
						(<any>this.$refs.notification).sendNotification('Manga added with success');
						setTimeout(
							() =>
								this.$router.push({
									name: 'SerieDetail',
									params: { slug: response.slug }
								}),
							1000
						);
					});
				});
			} else {
				this.resetErrors();
				this.showErrors();
				(<any>this.$refs.notification).sendNotification(this.error);
			}
		},
		checkData() {
			if (!this.imageUploaded) {
				this.error = 'image not loaded correctly';
				return false;
			}
			if (
				!this.serie.name ||
				this.serie.n_volumes <= 0 ||
				this.serie.volumes_bought < 0 ||
				typeof this.serie.volumes_bought != 'number' ||
				this.serie.volumes_read < 0 ||
				typeof this.serie.volumes_read != 'number'
			) {
				this.error = "The fields can't be blank";
				return false;
			}
			if (
				this.serie.n_volumes < this.serie.volumes_bought ||
				this.serie.volumes_bought < this.serie.volumes_read
			) {
				this.error = 'Errors with numbering';
				return false;
			}
			if (!this.types.length) {
				this.error = 'there is no type';
				return false;
			}
			if (!this.publishers.length) {
				this.error = 'there is no publisher';
				return false;
			}
			return true;
		},
		showErrors() {
			if (!this.imageUploaded) {
				document.querySelector('#file-input')!.className = 'form-control is-invalid';
			}
			if (this.serie.n_volumes <= 0) {
				document.querySelector('#inputNVol')!.className = 'form-control is-invalid';
			}
			if (
				typeof this.serie.volumes_bought != 'number' ||
				this.serie.volumes_bought < 0 ||
				this.serie.n_volumes < this.serie.volumes_bought
			) {
				document.querySelector('#inputBought')!.className = 'form-control is-invalid';
			}
			if (
				typeof this.serie.volumes_read != 'number' ||
				this.serie.volumes_read < 0 ||
				this.serie.volumes_bought < this.serie.volumes_read
			) {
				document.querySelector('#inputRead')!.className = 'form-control is-invalid';
			}
			if (!this.serie.name) {
				document.querySelector('#floatingInputGrid')!.className = 'form-control is-invalid';
			}
			if (!this.types.length) {
				document.querySelector('#typeSelect')!.className = 'form-select-sm placeholder bg-danger';
			}
			if (!this.publishers.length) {
				document.querySelector('#publisherSelect')!.className =
					'form-select-sm placeholder bg-danger';
			}
		},
		resetErrors() {
			document.querySelector('#inputNVol')!.className = 'form-control';
			document.querySelector('#inputBought')!.className = 'form-control';
			document.querySelector('#inputRead')!.className = 'form-control';
			document.querySelector('#floatingInputGrid')!.className = 'form-control';
		}
	},
	created() {
		this.getTypes();
		this.getPublishers();
	}
};
</script>

<style>
.add-serie {
	text-align: center;
}
</style>
