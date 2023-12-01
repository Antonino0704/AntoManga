<template>
	<div v-if="serie.detail">
		<NotFound message="SERIE NOT FOUND" />
	</div>
	<div v-else class="serie-editor">
		<form class="list-inline" @submit.prevent="Update">
			<h1 class="list-inline-item mt-2">EDIT PAGE</h1>
			<div class="list-inline-item row g-2">
				<div class="col-md">
					<div class="form-floating list-inline-item">
						<input type="text" class="form-control" id="floatingInputGrid" v-model="serie.name" />
						<label for="floatingInputGrid">Serie's Title</label>
						<div class="invalid-feedback">Invalid title</div>
					</div>
				</div>
			</div>

			<div class="picture-edit">
				<label for="file-input">
					<img
						:src="imageSerie"
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
					v-model="serie.typology"
				>
					<option v-for="type in types" :key="type.id" :value="type.id" :id="type.id + type.name">
						{{ type.name }}
					</option>
				</select>
			</div>

			<div class="placeholder-glow mt-3">
				<select
					id="publisherSelect"
					class="placeholder form-select-sm"
					aria-hidden="true"
					v-model="serie.publisher"
				>
					<option
						v-for="publisher in publishers"
						:key="publisher.id"
						:value="publisher.id"
						:id="publisher.id + publisher.name"
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
import slugify from 'slugify';
import NotFound from '../views/NotFound.vue';

export default {
	name: 'SerieEditor',
	props: {
		slug: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			serie: {},
			imageSerie: '',
			SlugsSeries: [],
			types: [],
			publishers: [],
			error: ''
		};
	},
	components: {
		Notification,
		NotFound
	},
	methods: {
		getSerieData() {
			apiService(`series/${this.slug}/`).then((data: object) => {
				this.serie = data;
				this.getSlugsSeries();
				this.getTypes();
				this.getPublishers();
			});
		},
		getSlugsSeries() {
			apiService('series/').then((data: Array<Object>) => {
				data.forEach((element: Object) => {
					if (element.slug !== this.serie.slug) {
						this.SlugsSeries.push(element.slug);
					}
				});
			});
		},
		getTypes() {
			apiService('types/').then((data: Array<any>) => {
				for (let i = 0; i < data.length; i++) {
					this.types.push(data[i]);
				}
				//wait for options to load
				setTimeout(() => {
					document.getElementById(this.serie.typology + this.serie.typology_name).selected = true;
					document.getElementById('typeSelect').className = 'form-select-sm';
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
					document.getElementById(this.serie.publisher + this.serie.publisher_name).selected = true;
					document.getElementById('publisherSelect').className = 'form-select-sm';
				}, 500);
			});
		},
		getImageSerie() {
			apiService(`image/series/${this.slug}/`).then((data: object) => {
				this.imageSerie = data.image;
			});
		},
		Update() {
			if (this.checkData()) {
				apiService(`series/${this.slug}/`, 'PUT', this.serie).then((response: object) => {
					this.$refs.notification.sendNotification('serie updated with success');
					setTimeout(
						() =>
							this.$router.push({
								name: 'SerieDetail',
								params: { slug: response.slug }
							}),
						1000
					);
				});
			} else {
				document.getElementById('floatingInputGrid').className = 'form-control is-invalid';
				this.$refs.notification.sendNotification(this.error);
			}
		},
		checkData(): boolean {
			if (!this.serie.name) {
				this.error = "title can't be blank";
				return false;
			}
			this.error = 'title already exists';
			return !this.SlugsSeries.includes(slugify(this.serie.name, { lower: true }));
		},
		updateImage(event: Event) {
			try {
				if (event.target.files[0].type.startsWith('image/')) {
					let data = new FormData();
					data.append('image', event.target.files[0]);
					imageApiService(`image/series/${this.slug}/`, 'PUT', data).then(() => {
						this.$refs.notification.sendNotification("serie's image updated with success");
						setTimeout(
							() =>
								this.$router.push({
									name: 'SerieDetail',
									params: { slug: this.serie.slug }
								}),
							1000
						);
					});
				} else {
					this.$refs.notification.sendNotification('unsupported image ');
				}
			} catch (error) {
				console.log(error);
			}
		}
	},
	created() {
		this.getSerieData();
		this.getImageSerie();
	}
};
</script>

<style>
.serie-editor {
	text-align: center;
}
</style>
