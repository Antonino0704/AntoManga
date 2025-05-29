<template>
	<div v-if="publisher.detail">
		<NotFound message="PUBLISHER NOT FOUND" />
	</div>
	<div v-else class="publisher-detail container-sm">
		<spinnerLoading ref="spinner" />
		<div class="mt-3">
			<router-link
				:to="{ name: 'AddPublisher' }"
				class="btn btn-outline-info"
				v-if="isAuthenticatedVar"
				>Add New Publisher
			</router-link>
			<button
				@click="deletePublisher()"
				type="button"
				class="btn btn-outline-warning ms-2"
				v-if="isAuthenticatedVar"
			>
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
							<router-link
								:to="{ name: 'PublisherEditor', params: { slug: publisher.slug } }"
								v-if="isAuthenticatedVar"
							>
								<!--pen logo from bootstrap-->
								<i class="bi bi-pen" fill="currentColor"></i>
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

			<h5 class="mt-3">{{ publisher.name?.toUpperCase() }}'s manga list</h5>
			<div class="vr">
				<p text-body-secondary class="ms-2">Length: {{ seriesLength }}</p>
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
				<button
					v-if="next.nextCard"
					@click="moreSeries()"
					type="button"
					class="btn btn-outline-secondary mt-3"
				>
					More
				</button>
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
import spinnerLoading from '../components/SpinnerLoading.vue'
import type { Series, PublisherDetail, RequestObject } from '../@types/interfaces';
import { endpoints } from '@/utils/endpoints';

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
			imageSeries: [] as Array<string>,
			seriesLength: 0,
			loading: true,
			next: {
				nextCard: null as string | null,
				nextImageCard: null as string | null
			},
			isAuthenticatedVar: false
		};
	},
	components: {
		ActionNotification,
		NotFound,
		spinnerLoading
	},
	beforeRouteEnter(to, from, next) {
		if (history.state)
			if (history.state.scroll) if (from.name !== 'SeriesDetail') history.state.scroll.top = 0;
		next();
	},
	methods: {
		async moreData(dataset: number, current: number): Promise<any> {
			if ((current >= dataset && dataset != -1) || this.next.nextCard == null) {
				(this.$refs.spinner as InstanceType<typeof spinnerLoading>).finishLoading();
				return;
			}
			return apiService(this.next.nextCard.replace(/\S*\/api\//g, ''))
				.then((data: RequestObject) => {
					this.series.push(...data.results);
					this.next.nextCard = data.next;
				})
				.then(() => {
					if (this.next.nextImageCard != null) {
						return apiService(this.next.nextImageCard.replace(/\S*\/api\//g, ''))
							.then((data: RequestObject) => {
								this.next.nextImageCard = data.next;
								for (let i = 0; i < data.results.length; i++) {
									this.imageSeries.push(data.results[i].image);
								}
							})
							.then(() => {
								return this.moreData(dataset, current + 1);
							});
					}
				});
		},
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
		async getseriesData() {
			return apiService(`${endpoints.seriesList}${this.slug}/`)
				.then((data: RequestObject) => {
					this.series = data.results;
					this.seriesLength = data.count;
					this.next.nextCard = data.next;
				})
				.then(() => {
					return this.getImageseriesData();
				});
		},
		async getImageseriesData() {
			return apiService(`${endpoints.imgSeriesList}${this.slug}/`).then((data: RequestObject) => {
				this.next.nextImageCard = data.next;
				for (let i = 0; i < data.results.length; i++) {
					this.imageSeries.push(data.results[i].image);
				}
				if (this.$route.query.dataset != undefined) {
					return this.moreData(Number(this.$route.query.dataset), 1);
				}
				(this.$refs.spinner as InstanceType<typeof spinnerLoading>).finishLoading();
			});
		},
		deletePublisher() {
			(this.$refs.actionNotification as InstanceType<typeof ActionNotification>).sendNotification(
				'are you sure? you will no longer be able to retrieve the data',
				'Publisher deleted',
				`${endpoints.publishers}${this.slug}/`
			);
		},
		moreSeries() {
			if (this.next.nextCard != null) {
				(this.$refs.spinner as InstanceType<typeof spinnerLoading>).startLoading();
				apiService(this.next.nextCard.replace(/\S*\/api\//g, ''))
					.then((data: RequestObject) => {
						this.series.push(...data.results);
						this.next.nextCard = data.next;
					})
					.then(() => {
						if (this.next.nextImageCard != null) {
							apiService(this.next.nextImageCard.replace(/\S*\/api\//g, ''))
								.then((data: RequestObject) => {
									this.next.nextImageCard = data.next;
									for (let i = 0; i < data.results.length; i++) {
										this.imageSeries.push(data.results[i].image);
									}
								})
								.then(() => {
									this.changeUrl();
									(this.$refs.spinner as InstanceType<typeof spinnerLoading>).finishLoading();
								});
						}
					});
			}
		},
		changeUrl() {
			if (this.next.nextCard != null) {
				this.$router.replace({
					query: {
						dataset: Number(this.next.nextCard.replace(/\S*page=/g, '').replace(/&\S*/g, '')) - 1
					}
				});
			} else {
				this.$router.replace({
					query: {
						dataset: -1
					}
				});
			}
		},
		isAuthenticated() {
			apiService(endpoints.isAuthenticated, 'GET').then((response: any) => {
				this.isAuthenticatedVar = response.result;
			});
		}
	},
	async created() {
		this.getPublisherData();
		this.getImagePublisherData();
		await this.getseriesData();
		this.isAuthenticated();
		window.scrollTo(0, history.state?.scroll?.top || 0);
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
