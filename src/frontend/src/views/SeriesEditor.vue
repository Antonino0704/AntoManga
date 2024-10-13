<template>
	<div v-if="series.detail">
		<NotFound message="SERIES NOT FOUND" />
	</div>
	<div v-else class="series-editor">
		<form class="list-inline" @submit.prevent="Update">
			<h1 class="list-inline-item mt-2">EDIT PAGE</h1>
			<div class="list-inline-item row g-2">
				<div class="col-md">
					<div class="form-floating list-inline-item">
						<input type="text" class="form-control" id="floatingInputGrid" v-model="series.name" />
						<label for="floatingInputGrid">Series's Title</label>
						<div class="invalid-feedback">Invalid title</div>
					</div>
				</div>
			</div>

			<div class="picture-edit">
				<label for="file-input">
					<img
						:src="imageSeries"
						class="list-inline-item rounded-circle mt-2"
						style="width: 200px"
					/>
				</label>
				<input type="file" accept="image/*" id="file-input" @change="updateImage($event)" />
			</div>

			<div class="placeholder-glow mt-3">
				<select
					id="typeSelect"
					class="placeholder form-select-sm"
					aria-hidden="true"
					v-model="series.typology"
				>
					<option v-for="type in types" :key="type.id" :value="type.id" :id="'IDType-' + type.id">
						{{ type.name }}
					</option>
				</select>
			</div>

			<div class="placeholder-glow mt-3">
				<select
					id="publisherSelect"
					class="placeholder form-select-sm"
					aria-hidden="true"
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

			<button class="btn btn-outline-success mt-3">Update</button>
		</form>

		<Notification ref="notification" />
	</div>
</template>

<script lang="ts">
import { apiService, imageApiService } from '../utils/APIService';
import Notification from '../components/Notification.vue';
import NotFound from '../views/NotFound.vue';
import type { SeriesViewsetInstance, Type, Publisher } from '../@types/interfaces';

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
			error: ''
		};
	},
	components: {
		Notification,
		NotFound
	},
	methods: {
		getSeriesData() {
			apiService(`v1/series/${this.slug}/`).then((data: SeriesViewsetInstance) => {
				this.series = data;
				this.getTypes();
				this.getPublishers();
			});
		},
		getTypes() {
			apiService('v1/types/').then((data: Array<any>) => {
				for (let i = 0; i < data.length; i++) {
					this.types.push(data[i]);
				}
				//wait for options to load
				setTimeout(() => {
					document.querySelector<HTMLOptionElement>(`#IDType-${this.series.typology}`)!.selected =
						true;
					document.querySelector('#typeSelect')!.className = 'form-select-sm';
				}, 500);
			});
		},
		getPublishers() {
			apiService('v1/publishers/').then((data: Array<any>) => {
				for (let i = 0; i < data.length; i++) {
					this.publishers.push(data[i]);
				}
				//wait for options to load
				setTimeout(() => {
					document.querySelector<HTMLOptionElement>(
						`#IDPublisher-${this.series.publisher}`
					)!.selected = true;
					document.querySelector('#publisherSelect')!.className = 'form-select-sm';
				}, 500);
			});
		},
		getImageSeries() {
			apiService(`v1/image/series/${this.slug}/`).then((data: SeriesViewsetInstance) => {
				this.imageSeries = data.image;
			});
		},
		Update() {
			if (this.checkData()) {
				apiService(`v1/series/${this.slug}/`, 'PUT', this.series).then(
					(response: SeriesViewsetInstance) => {
						(<any>this.$refs.notification).sendNotification('series updated with success');
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
			} else {
				document.querySelector('#floatingInputGrid')!.className = 'form-control is-invalid';
				(<any>this.$refs.notification).sendNotification(this.error);
			}
		},
		checkData(): boolean {
			if (!this.series.name) {
				this.error = "title can't be blank";
				return false;
			}
			return true;
		},
		updateImage(event: Event) {
			try {
				if ((<HTMLInputElement>event.target).files![0].type.startsWith('image/')) {
					let data = new FormData();
					data.append('image', (<HTMLInputElement>event.target).files![0]);
					imageApiService(`v1/image/series/${this.slug}/`, 'PUT', data).then(() => {
						(<any>this.$refs.notification).sendNotification("series's image updated with success");
						setTimeout(
							() =>
								this.$router.push({
									name: 'SeriesDetail',
									params: { slug: this.series.slug }
								}),
							1000
						);
					});
				} else {
					(<any>this.$refs.notification).sendNotification('unsupported image ');
				}
			} catch (error) {
				console.log(error);
			}
		}
	},
	created() {
		this.getSeriesData();
		this.getImageSeries();
	}
};
</script>

<style>
.series-editor {
	text-align: center;
}
</style>
