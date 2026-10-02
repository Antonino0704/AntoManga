<template>
	<div v-if="isTypesOrPubMissing">
		<AdminErrors
			:title="typesOrPubMissing.title"
			:action="typesOrPubMissing.action"
			:admin-url="typesOrPubMissing.adminUrl"
		/>
	</div>
	<div v-else class="add-series container-sm mt-2">
		<spinnerLoading ref="spinner" />
		<form class="list-inline" @submit.prevent="addSeries">
			<h1 class="list-inline-item">{{ $t('common.titles.addSeries') }}</h1>
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
						<label for="floatingInputGrid">{{ $t('common.messages.seriesTitle') }}</label>
						<div class="invalid-feedback">{{ $t('common.errors.invalidTitle') }}</div>
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
					<div class="invalid-feedback">{{ $t('common.errors.invalidImage') }}</div>
				</div>

				<SeriesImagePreview class="list-inline-item" ref="preview" />
			</div>

			<div class="placeholder-glow mt-3 container-fluid">
				<select
					id="typeSelect"
					class="form-select form-select-sm placeholder"
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
					class="form-select form-select-sm placeholder"
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

			<ul class="list-group mt-5">
				<li class="list-group-item statistics">
					<div class="input-group flex-nowrap">
						<span class="input-group-text" id="addon-wrapping">{{
							$t('common.messages.nVolumes')
						}}</span>
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
						<span class="input-group-text" id="addon-wrapping">{{
							$t('common.messages.volBought')
						}}</span>
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
						<span class="input-group-text" id="addon-wrapping">{{
							$t('common.messages.volRead')
						}}</span>
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

			<button class="btn btn-outline-success mt-3">{{ $t('common.buttons.add') }}</button>
		</form>

		<Notification ref="notification" />
	</div>
</template>

<script lang="ts">
import { apiExpress } from '@/utils/APIExpress';
import Notification from '../components/Notification.vue';
import SeriesImagePreview from '../components/SeriesImagePreview.vue';
import spinnerLoading from '../components/SpinnerLoading.vue';
import AdminErrors from '../components/AdminErrors.vue';
import type { Series, Type, Publisher, IAdminError } from '../@types/interfaces';
import { endpoints } from '@/utils/endpoints';
import { validateImage } from '@/utils/supportedImageExtensions';
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
			error: '',
			typesOrPubMissing: {
				isError: false,
				title: '',
				action: '',
				adminUrl: ''
			} as IAdminError
		};
	},
	components: {
		Notification,
		SeriesImagePreview,
		spinnerLoading,
		AdminErrors
	},
	computed: {
		isTypesOrPubMissing() {
			return this.typesOrPubMissing.isError;
		}
	},
	methods: {
		async getTypes() {
			try {
				const response = await apiExpress.get<Array<Type>>(endpoints.types);
				if (!response.length) {
					this.typesOrPubMissing.title = this.$t('addSeries.errors.typeTitle');
					this.typesOrPubMissing.action = this.$t('addSeries.errors.typeAction');
					this.typesOrPubMissing.adminUrl = '/admin/series/typology/add/';
					this.typesOrPubMissing.isError = true;
				} else {
					await this.types.push(...response);
				}
			} catch (err) {
				console.log(err);
			}

			this.series.typology = parseInt(
				document.querySelector<HTMLOptionElement>('#typeSelect > option')!.value
			);
			document.querySelector<HTMLOptionElement>('#typeSelect > option')!.selected = true;
			document.querySelector<HTMLSelectElement>('#typeSelect')!.className =
				'form-select form-select-sm w-auto d-inline-block';
		},
		async getPublishers() {
			try {
				const response = await apiExpress.get<Array<Publisher>>(endpoints.publishers);
				if (!response.length) {
					this.typesOrPubMissing.title = this.$t('addSeries.errors.publisherTitle');
					this.typesOrPubMissing.action = this.$t('addSeries.errors.publisherAction');
					this.typesOrPubMissing.adminUrl = '/admin/publishers/publisher/add/';
					this.typesOrPubMissing.isError = true;
				} else {
					await this.publishers.push(...response);
				}
			} catch (err) {
				console.log(err);
			}

			this.series.publisher = document.querySelector<HTMLOptionElement>(
				'#publisherSelect > option'
			)!.value;
			document.querySelector<HTMLOptionElement>('#publisherSelect > option')!.selected = true;
			document.querySelector<HTMLSelectElement>('#publisherSelect')!.className =
				'form-select form-select-sm w-auto d-inline-block';
		},
		async addImage(event: Event) {
			//doesn't add the image to the server
			(this.$refs.spinner as InstanceType<typeof spinnerLoading>).startLoading();
			if (await validateImage(event.target as InstanceType<typeof HTMLInputElement>)) {
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
					this.$t('common.errors.unsupportedImage')
				);
				(this.$refs.preview as InstanceType<typeof SeriesImagePreview>).resetPreview();
				document.querySelector('#file-input')!.className = 'form-control is-invalid';
				this.imageUploaded = false;
			}
			(this.$refs.spinner as InstanceType<typeof spinnerLoading>).finishLoading();
		},
		async addSeries() {
			if (this.checkData()) {
				(this.$refs.spinner as InstanceType<typeof spinnerLoading>).startLoading();

				try {
					const response = await apiExpress.post<Series>(endpoints.series, this.series);
					await apiExpress.putImage(`${endpoints.imgSeries}${response.slug}/`, this.formData);

					(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
						this.$t('addSeries.messages.seriesAdded')
					);
					(this.$refs.spinner as InstanceType<typeof spinnerLoading>).finishLoading();
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
			this.error = showErrors(this.series, this.$t);
			if (!this.imageUploaded) {
				this.error = this.$t('common.errors.imageNotLoaded');
				document.querySelector('#file-input')!.className = 'form-control is-invalid';
			}
			if (!this.series.name) {
				this.error = this.$t('common.errors.invalidTitle');
				document.querySelector('#floatingInputGrid')!.className = 'form-control is-invalid';
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
		(this.$refs.spinner as InstanceType<typeof spinnerLoading>).finishLoading();
	}
};
</script>

<style>
.add-series {
	text-align: center;
}
</style>
