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
import { APIExpress } from '../utils/APIExpress';
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
		async getPublisherData() {
			try {
				this.publisher = await APIExpress.get<PublisherDetail>(
					`${endpoints.publishers}${this.slug}/`
				);
				this.imagePublisher = (
					await APIExpress.get<PublisherDetail>(`${endpoints.imgPublishers}${this.slug}/`)
				).image;
			} catch (err) {
				console.log(err);
			}
		},
		async getseriesData() {
			try {
				const response = await APIExpress.get<RequestObject>(
					`${endpoints.seriesList}${this.slug}/`
				);
				this.series = response.results;
				this.seriesLength = response.count;
				this.next.nextCard = response.next;
			} catch (err) {
				console.log(err);
			}

			if (this.$route.query.dataset != undefined) {
				try {
					let seriesData = await moreData(Number(this.$route.query.dataset), 1, this.next.nextCard);
					this.series.push(...seriesData.results);
					this.next.nextCard = seriesData.next;
				} catch (err) {
					console.log(err);
				}
			}
			this.getImageseriesData();
		},
		async getImageseriesData() {
			try {
				const response = await APIExpress.get<RequestObject>(
					`${endpoints.imgSeriesList}${this.slug}/`
				);
				this.next.nextImageCard = response.next;
				await response.results.forEach((data: { image: string }) =>
					this.imageSeries.push(data.image)
				);
			} catch (err) {
				console.log(err);
			}

			if (this.$route.query.dataset != undefined) {
				try {
					const seriesDataImg = await moreDataImage(
						Number(this.$route.query.dataset),
						1,
						this.next.nextImageCard
					);
					this.imageSeries.push(...seriesDataImg.results);
					this.next.nextImageCard = seriesDataImg.next;
				} catch (err) {
					console.log(err);
				}
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

				try {
					const seriesData = await moreData(1, 0, this.next.nextCard);
					const seriesDataImg = await moreDataImage(1, 0, this.next.nextImageCard);
					this.series.push(...seriesData.results);
					this.next.nextCard = seriesData.next;
					this.imageSeries.push(...seriesDataImg.results);
					this.next.nextImageCard = seriesDataImg.next;
				} catch (err) {
					console.log(err);
				}

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
