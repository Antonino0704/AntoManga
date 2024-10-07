<template>
	<div v-if="publisher.detail">
		<NotFound message="PUBLISHER NOT FOUND" />
	</div>
	<div v-else class="publisher-detail container-sm">
		<div class="mt-2">
			<router-link :to="{ name: 'AddPublisher' }" class="btn btn-outline-info"
				>Add New Publisher
			</router-link>
			<button @click="deletePublisher()" type="button" class="btn btn-outline-warning ms-2">
				Delete
			</button>
		</div>
		<div class="accordion pt-4">
			<div class="accordion-item">
				<h2 class="accordion-header">
					<button
						class="accordion-button collapsed"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#collapseOne"
						aria-expanded="true"
						aria-controls="collapseOne"
					>
						<strong> {{ publisher.name }} </strong>
						<div class="ms-1">
							<router-link :to="{ name: 'PublisherEditor', params: { slug: publisher.slug } }">
								<!--pen logo from bootstrap-->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									class="bi bi-pen"
									viewBox="0 0 16 16"
								>
									<path
										d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"
									/>
								</svg>
							</router-link>
						</div>
					</button>
				</h2>
				<div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordion">
					<div class="accordion-body container-sm">
						<strong class="prova"> {{ publisher.description }} </strong>
					</div>
				</div>
			</div>
			<div class="card mt-3" style="width: 18rem">
				<img :src="imagePublisher" class="card-img-top" alt="logoPublisher" />
			</div>

			<h5 class="mt-3">{{ publisher.name.toUpperCase() }}'s manga list</h5>
			<div class="vr">
				<p text-body-secondary class="ms-2">Length: {{ series.length }}</p>
			</div>
			<ul class="list-group series-group container">
				<li class="list-group-item" v-for="(serie, index) in series" :key="serie.id">
					<router-link :to="{ name: 'SeriesDetail', params: { slug: serie.slug } }">
						{{ serie.name }}
					</router-link>
					<hr class="dropdown-divider" />
					<p>Number Of Volumes: {{ serie.n_volumes }}</p>
					<hr class="dropdown-divider" />
					<img
						:src="imageSeries[index]"
						class="card-img-top rounded-pill image-series"
						alt="logoPublisher"
					/>
				</li>
			</ul>
		</div>

		<ActionNotification
			class="position-absolute top-0 start-50 translate-middle-x"
			ref="actionNotification"
		/>
	</div>
</template>

<script lang="ts">
import { apiService } from '../utils/APIService';
import ActionNotification from '../components/ActionNotification.vue';
import NotFound from '../views/NotFound.vue';
import type { Series, PublisherDetail } from '../@types/interfaces';

export default {
	name: 'PublisherDetail',
	props: {
		slug: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			publisher: {} as PublisherDetail,
			series: [] as Array<Series>,
			imagePublisher: '',
			imageSeries: [] as Array<string>
		};
	},
	components: {
		ActionNotification,
		NotFound
	},
	methods: {
		getPublisherData() {
			apiService(`publishers/${this.slug}/`).then((data: PublisherDetail) => {
				this.publisher = data;
			});
		},
		getImagePublisherData() {
			apiService(`image/publishers/${this.slug}/`).then((data: PublisherDetail) => {
				this.imagePublisher = data.image;
			});
		},
		getseriesData() {
			apiService(`series-list/${this.slug}/`).then((data: Array<Series>) => {
				this.series = data;
			});
		},
		getImageseriesData() {
			apiService(`image/series-list/${this.slug}/`).then((data: Array<Series>) => {
				for (let i = 0; i < data.length; i++) {
					this.imageSeries.push(data[i].image);
				}
			});
		},
		deletePublisher() {
			(<any>this.$refs.actionNotification).sendNotification(
				'are you sure? you will no longer be able to retrieve the data',
				'Publisher deleted',
				`publishers/${this.slug}/`
			);
		}
	},
	created() {
		this.getPublisherData();
		this.getImagePublisherData();
		this.getseriesData();
		this.getImageseriesData();
	}
};
</script>

<style>
.publisher-detail {
	text-align: justify;
}

.collapse,
.collapsing {
	overflow: auto;
	max-height: 50vh;
}

.image-series {
	width: 100px;
	height: 100px;
}

.series-group {
	text-align: center;
}
</style>
