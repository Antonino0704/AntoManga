<template>
	<div class="add-series container-sm mt-2">
		<form class="list-inline" @submit.prevent="addSeries">
			<h1 class="list-inline-item">ADD A New Manga</h1>
			<div class="list-inline-item row g-2">
				<div class="col-md">
					<div class="form-floating list-inline-item">
						<input type="text" class="form-control" id="floatingInputGrid" v-model="series.name" />
						<label for="floatingInputGrid">Series's Title</label>
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
						<i fill="currentColor" class="bi bi-images"> </i>
					</label>
					<div class="invalid-feedback">Invalid image</div>
				</div>

				<SeriesImagePreview class="list-inline-item" ref="preview" />
			</div>

			<div class="placeholder-glow mt-3">
				<select id="typeSelect" class="form-select-sm placeholder" v-model="series.typology">
					<option v-for="type in types" :key="type.id" :value="type.id" :id="'IDType-' + type.id">
						{{ type.name }}
					</option>
				</select>
			</div>

			<div class="placeholder-glow mt-3">
				<select id="publisherSelect" class="form-select-sm placeholder" v-model="series.publisher">
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
							v-model="series.n_volumes"
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
							v-model="series.volumes_bought"
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
							v-model="series.volumes_read"
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
import SeriesImagePreview from '../components/SeriesImagePreview.vue';
import type { Series, Type, Publisher, User } from '../@types/interfaces';
import { endpoints } from '@/utils/endpoints';
import { checkDataStats, showErrors, resetErrors } from '@/utils/StatsErrorsChecks';

export default {
	name: 'AddSeries',
	data() {
		return {
			series: {
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
		Notification,
		SeriesImagePreview
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
		async getTypes() {
			return apiService(endpoints.types)
				.then((data: Array<Type>) => {
					for (let i = 0; i < data.length; i++) {
						this.types.push(data[i]);
					}
				})
				.then(() => {
					this.series.typology = parseInt(
						document.querySelector<HTMLOptionElement>('#typeSelect > option')!.value
					);
					document.querySelector<HTMLOptionElement>('#typeSelect > option')!.selected = true;
					document.querySelector<HTMLSelectElement>('#typeSelect')!.className = 'form-select-sm';
				});
		},
		async getPublishers() {
			return apiService(endpoints.publishers)
				.then((data: Array<any>) => {
					for (let i = 0; i < data.length; i++) {
						this.publishers.push(data[i]);
					}
				})
				.then(() => {
					this.series.publisher = document.querySelector<HTMLOptionElement>(
						'#publisherSelect > option'
					)!.value;
					document.querySelector<HTMLOptionElement>('#publisherSelect > option')!.selected = true;
					document.querySelector<HTMLSelectElement>('#publisherSelect')!.className =
						'form-select-sm';
				});
		},
		addImage(event: Event) {
			//doesn't add the image to the server
			if (
				(event.target as InstanceType<typeof HTMLInputElement>).files![0].type.startsWith('image/')
			) {
				this.formData.append(
					'image',
					(event.target as InstanceType<typeof HTMLInputElement>).files![0]
				);
				(this.$refs.preview as InstanceType<typeof SeriesImagePreview>).setPreview(
					URL.createObjectURL((event.target as InstanceType<typeof HTMLInputElement>).files![0])
				);
				document.querySelector('#file-input')!.className = 'form-control';
				this.imageUploaded = true;
			} else {
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
					'unsupported image '
				);
				(this.$refs.preview as InstanceType<typeof SeriesImagePreview>).resetPreview();
				document.querySelector('#file-input')!.className = 'form-control is-invalid';
				this.imageUploaded = false;
			}
		},
		addSeries() {
			if (this.checkData()) {
				apiService(endpoints.series, 'POST', this.series).then((response: Series) => {
					imageApiService(`${endpoints.imgSeries}${response.slug}/`, 'PUT', this.formData).then(
						() => {
							(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
								'Manga added with success'
							);
							setTimeout(
								() =>
									this.$router.push({
										name: 'SeriesDetail',
										params: { slug: response.slug }
									}),
								1000
							);
						}
					);
				});
			} else {
				this.resetErrors();
				this.showErrors();
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(this.error);
			}
		},
		checkData() {
			if (!this.imageUploaded) return false;

			if (!this.series.name) return false;

			if (!this.types.length) return false;

			if (!this.publishers.length) return false;

			return checkDataStats(this.series);
		},
		showErrors() {
			if (!this.imageUploaded) {
				this.error = 'image not loaded correctly';
				document.querySelector('#file-input')!.className = 'form-control is-invalid';
			}
			this.error = showErrors(this.series);
			if (!this.series.name) {
				this.error = "The fields can't be blank";
				document.querySelector('#floatingInputGrid')!.className = 'form-control is-invalid';
			}
			if (!this.types.length) {
				this.error = 'there is no type';
				document.querySelector('#typeSelect')!.className = 'form-select-sm placeholder bg-danger';
			}
			if (!this.publishers.length) {
				this.error = 'there is no publisher';
				document.querySelector('#publisherSelect')!.className =
					'form-select-sm placeholder bg-danger';
			}
		},
		resetErrors() {
			resetErrors();
			document.querySelector('#floatingInputGrid')!.className = 'form-control';
		}
	},
	async created() {
		await this.getTypes();
		await this.getPublishers();
	}
};
</script>

<style>
.add-series {
	text-align: center;
}
</style>
