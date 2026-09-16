<template>
	<div v-if="series.detail">
		<NotFound message="SERIES NOT FOUND" />
	</div>
	<div v-else class="series-editor">
		<spinnerLoading ref="spinner" />
		<form class="list-inline" @submit.prevent="Update">
			<h1 class="list-inline-item mt-2">EDIT PAGE</h1>
			<div class="list-inline-item row g-2">
				<div class="col-md">
					<div class="form-floating list-inline-item">
						<input
							maxlength="50"
							type="text"
							class="form-control"
							id="floatingInputGrid"
							v-model="series.name"
						/>
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
						@change="updateImage($event)"
					/>
					<label class="input-group-text" for="file-input">
						<i fill="currentColor" class="bi bi-images"> </i>
					</label>
					<div class="invalid-feedback">Invalid image</div>
				</div>

				<PreviewComponent class="list-inline-item" ref="preview" />
			</div>

			<div class="placeholder-glow mt-3 container-fluid">
				<select
					id="typeSelect"
					class="placeholder form-select form-select-sm"
					v-model="series.typology"
				>
					<option v-for="type in types" :key="type.id" :value="type.id" :id="'IDType-' + type.id">
						{{ type.name }}
					</option>
				</select>
			</div>

			<div class="placeholder-glow mt-3 container-fluid">
				<select
					id="publisherSelect"
					class="placeholder form-select form-select-sm"
					v-model="series.publisher"
				>
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
			<div class="checkbox-inline mt-2">
				<input
					class="form-check-input me-2"
					type="checkbox"
					value=""
					id="isDiscontinued"
					v-model="series.is_discontinued"
				/>
				<label class="form-check-label" for="isDiscontinued"> Discontinued </label>
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
import PreviewComponent from '../components/SeriesImagePreview.vue';
import spinnerLoading from '../components/SpinnerLoading.vue';
import type { SeriesViewsetInstance, Type, Publisher } from '../@types/interfaces';
import { endpoints } from '@/utils/endpoints';
import { validateImage } from '@/utils/supportedImageExtensions';

export default {
	name: 'SeriesEditor',
	props: {
		slug: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			series: {} as SeriesViewsetInstance,
			imageSeries: '',
			types: [] as Array<Type>,
			publishers: [] as Array<Publisher>,
			error: '',
			formData: new FormData(),
			imageUploaded: false
		};
	},
	components: {
		Notification,
		NotFound,
		PreviewComponent,
		spinnerLoading
	},
	methods: {
		async getSeriesData() {
			try {
				this.series = await apiExpress.get<SeriesViewsetInstance>(
					`${endpoints.series}${this.slug}/`
				);
				this.getTypes();
				this.getPublishers();
			} catch (err) {
				console.log(err);
			}
		},
		async getTypes() {
			try {
				const response = await apiExpress.get<Array<Type>>(endpoints.types);
				await this.types.push(...response);
			} catch (err) {
				console.log(err);
			}
			document.querySelector<HTMLOptionElement>(`#IDType-${this.series.typology}`)!.selected = true;
			document.querySelector<HTMLSelectElement>('#typeSelect')!.className =
				'form-select form-select-sm w-auto d-inline-block';
		},
		async getPublishers() {
			try {
				const response = await apiExpress.get<Array<Publisher>>(endpoints.publishers);
				await this.publishers.push(...response);
			} catch (err) {
				console.log(err);
			}

			document.querySelector<HTMLOptionElement>(`#IDPublisher-${this.series.publisher}`)!.selected =
				true;
			document.querySelector('#publisherSelect')!.className =
				'form-select form-select-sm w-auto d-inline-block';
		},
		async getImageSeries() {
			try {
				const response = await apiExpress.get<SeriesViewsetInstance>(
					`${endpoints.imgSeries}${this.slug}/`
				);
				this.imageSeries = response.image;
				(this.$refs.preview as InstanceType<typeof PreviewComponent>).setPreview(response.image);
			} catch (err) {
				console.log(err);
			}
		},
		async Update() {
			if (this.checkData()) {
				try {
					const response = await apiExpress.put<SeriesViewsetInstance>(
						`${endpoints.series}${this.slug}/`,
						this.series
					);

					if (this.imageUploaded) {
						await apiExpress.putImage(`${endpoints.imgSeries}${response.slug}/`, this.formData);
						(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
							'series and image updated with success'
						);
					} else {
						(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
							'series updated with success'
						);
					}
					setTimeout(
						() =>
							this.$router.push({
								name: 'SeriesDetail',
								params: { slug: response.slug }
							}),
						1000
					);
				} catch (err) {
					console.log(err);
				}
			} else {
				document.querySelector('#floatingInputGrid')!.className = 'form-control is-invalid';
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(this.error);
			}
		},
		checkData(): boolean {
			if (!this.series.name) {
				this.error = "title can't be blank";
				return false;
			}
			return true;
		},
		async updateImage(event: Event) {
			(this.$refs.spinner as InstanceType<typeof spinnerLoading>).startLoading();
			try {
				if (await validateImage(event.target as InstanceType<typeof HTMLInputElement>)) {
					this.formData.append(
						'image',
						(event.target as InstanceType<typeof HTMLInputElement>).files![0]
					);
					(this.$refs.preview as InstanceType<typeof PreviewComponent>).setPreview(
						URL.createObjectURL((event.target as InstanceType<typeof HTMLInputElement>).files![0])
					);
					this.imageUploaded = true;
				} else {
					(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
						'unsupported image '
					);
					document.querySelector<HTMLInputElement>('#file-input')!.value = '';
					(this.$refs.preview as InstanceType<typeof PreviewComponent>).setPreview(
						this.imageSeries
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
		await this.getSeriesData();
		await this.getImageSeries();
		(this.$refs.spinner as InstanceType<typeof spinnerLoading>).finishLoading();
	}
};
</script>

<style>
.series-editor {
	text-align: center;
}
</style>
