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
				v-if="user.is_authenticated"
				>Add New Publisher
			</router-link>
			<button
				@click="deletePublisher()"
				type="button"
				:class="`btn ${!seriesLength ? 'btn-outline-warning' : 'btn-outline-secondary'} ms-2`"
				:disabled="Boolean(seriesLength)"
				v-if="user.is_authenticated"
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
								v-if="user.is_authenticated"
							>
								<!--pen logo from bootstrap-->
								<i class="bi bi-pen" fill="currentColor"></i>
							</router-link>
						</div>
					</button>
				</h2>
				<div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordion">
					<div class="accordion-body container-sm">
						<strong> {{ publisher.description }} </strong>
					</div>
				</div>
			</div>
			<div class="card mt-3" style="width: 18rem">
				<img :src="imagePublisher" class="card-img-top" alt="logoPublisher" />
			</div>
			<publisherStats :slug="slug" :seriesLength="seriesLength" v-if="publisher" />
			<h5 class="mt-3">
				{{ publisher.name?.toUpperCase() }}'s list
				<a
					class="bi bi-share-fill ms-1 fs-6"
					onclick="
						navigator.clipboard.writeText(window.location.href);
						return false;
					"
					@click="copyAction()"
				></a>
			</h5>
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
import spinnerLoading from '../components/SpinnerLoading.vue';
import publisherStats from '../components/PublisherStats.vue';
import type { Series, PublisherDetail, RequestObject } from '../@types/interfaces';
import { endpoints } from '@/utils/endpoints';
import { moreData, moreDataImage } from '../utils/getSeries';
import { useUserStore } from '@/stores/userStore';
import { mapState } from 'pinia';

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
			}
		};
	},
	components: {
		ActionNotification,
		NotFound,
		spinnerLoading,
		publisherStats
	},
	beforeRouteEnter(to, from, next) {
		if (history.state)
			if (history.state.scroll) if (from.name !== 'SeriesDetail') history.state.scroll.top = 0;
		next();
	},
	computed: {
		...mapState(useUserStore, ['user'])
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
		async getseriesData() {
			await apiService(`${endpoints.seriesList}${this.slug}/`).then((data: RequestObject) => {
				this.series = data.results;
				this.seriesLength = data.count;
				this.next.nextCard = data.next;
			});

			if (this.$route.query.dataset != undefined) {
				let seriesData = await moreData(Number(this.$route.query.dataset), 1, this.next.nextCard);
				this.series.push(...seriesData.series);
				this.next.nextCard = seriesData.nextCard;
			}
			return this.getImageseriesData();
		},
		async getImageseriesData() {
			await apiService(`${endpoints.imgSeriesList}${this.slug}/`).then((data: RequestObject) => {
				this.next.nextImageCard = data.next;
				for (let i = 0; i < data.results.length; i++) {
					this.imageSeries.push(data.results[i].image);
				}
			});
			if (this.$route.query.dataset != undefined) {
				const seriesDataImg = await moreDataImage(
					Number(this.$route.query.dataset),
					1,
					this.next.nextImageCard
				);
				this.imageSeries.push(...seriesDataImg.imageSeries);
				this.next.nextImageCard = seriesDataImg.nextImageCard;
			}
			(this.$refs.spinner as InstanceType<typeof spinnerLoading>).finishLoading();
		},
		deletePublisher() {
			(this.$refs.actionNotification as InstanceType<typeof ActionNotification>).sendNotification(
				'are you sure? you will no longer be able to retrieve the data',
				'Publisher deleted',
				`${endpoints.publishers}${this.slug}/`
			);
			window.scrollTo(0, 0);
		},
		async moreSeries() {
			if (this.next.nextCard != null && this.next.nextImageCard != null) {
				(this.$refs.spinner as InstanceType<typeof spinnerLoading>).startLoading();

				const seriesData = await moreData(1, 0, this.next.nextCard);
				const seriesDataImg = await moreDataImage(1, 0, this.next.nextImageCard);
				this.series.push(...seriesData.series);
				this.next.nextCard = seriesData.nextCard;
				this.imageSeries.push(...seriesDataImg.imageSeries);
				this.next.nextImageCard = seriesDataImg.nextImageCard;

				this.changeUrl();
				(this.$refs.spinner as InstanceType<typeof spinnerLoading>).finishLoading();
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
		copyAction() {
			let shareButton = document.querySelector('.bi-share-fill') as HTMLElement;
			shareButton.className = 'bi bi-check-square-fill text-success ms-1 fs-6';
			setTimeout(() => {
				shareButton.className = 'bi bi-share-fill ms-1 fs-6';
			}, 2000);
		}
	},
	async created() {
		this.getPublisherData();
		this.getImagePublisherData();
		await this.getseriesData();
		window.scrollTo(0, history.state?.scroll?.top || 0);
	}
};
</script>

<style scoped>
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
