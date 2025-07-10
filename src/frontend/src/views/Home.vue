<template>
	<div class="HomeView row justify-content-center">
		<navbar @filterEvent="search" />
		<spinnerLoading ref="spinner" />
		<div class="col-auto">
			<div class="container text-center">
				<div class="fs-1">
					Series
					<i id="gridButton" class="bi bi-grid ms-2 fs-5" @click="gridClick()"></i>
				</div>
				<div>
					<span class="badge rounded-pill me-2 placeholder">Length: {{ seriesLength }}</span>
					<router-link :to="{ name: 'StatsView' }" type="button" class="bi bi-bar-chart-line me-2">
					</router-link>
					<router-link :to="{ name: 'InfoView' }" type="button" class="bi bi-info-circle">
					</router-link>
				</div>
				<SearchNoResults message="it is so empty here" v-if="!seriesLength" class="mt-2" />
				<div class="row">
					<div colspan="2" class="list col mt-3" v-for="(serie, index) in series" :key="serie.id">
						<div
							:id="'cardid-' + serie.id"
							class="card mt-2"
							style="width: 18rem"
							@mouseenter="mouseEnter('cardid-' + serie.id)"
							@mouseleave="mouseLeave('cardid-' + serie.id)"
						>
							<router-link :to="{ name: 'SeriesDetail', params: { slug: serie.slug } }">
								<img :src="imagesSeries[index]" class="card-img-top" alt="..." height="410" />
							</router-link>

							<div class="card-body">
								<h5 class="card-title">{{ serie.name }}</h5>
								<p class="card-text fst-italic">Type: {{ serie.typology_name }}</p>

								<router-link
									:to="{
										name: 'PublisherDetail',
										params: { slug: serie.publisher_slug }
									}"
								>
									<p class="card-text fw-bold">Publisher: {{ serie.publisher_name }}</p>
								</router-link>
							</div>
						</div>
					</div>
				</div>
				<button
					v-if="next.nextCard"
					@click="moreSeries()"
					type="button"
					class="btn btn-outline-secondary mt-3"
				>
					More
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { apiService } from '../utils/APIService';
import type { SeriesViewsetInstance, RequestObject } from '../@types/interfaces';
import navbar from '../components/Navbar.vue';
import spinnerLoading from '../components/SpinnerLoading.vue';
import SearchNoResults from '../components/SearchNoResults.vue';
import { endpoints } from '@/utils/endpoints';
import { moreData, moreDataImage } from '../utils/getSeries';

export default {
	name: 'HomeView',
	data() {
		return {
			series: [] as Array<SeriesViewsetInstance>,
			imagesSeries: [] as Array<string>,
			seriesLength: 1,
			grid: false,
			next: {
				nextCard: null as string | null,
				nextImageCard: null as string | null
			}
		};
	},
	components: {
		navbar,
		spinnerLoading,
		SearchNoResults
	},
	methods: {
		async getDataSeries() {
			await apiService(endpoints.series + this.filter()).then((data: RequestObject) => {
				this.series = data.results;
				this.seriesLength = data.count;
				this.next.nextCard = data.next;
			});
			if (this.$route.query.dataset != undefined) {
				let seriesData = await moreData(Number(this.$route.query.dataset), 1, this.next.nextCard);
				this.series.push(...seriesData.series);
				this.next.nextCard = seriesData.nextCard;
			}
			return this.getDataImageSeries();
		},
		async getDataImageSeries() {
			await apiService(endpoints.imgSeries + this.filter()).then((data: RequestObject) => {
				this.next.nextImageCard = data.next;
				this.imagesSeries = [];
				for (let i = 0; i < data.results.length; i++) {
					this.imagesSeries.push(data.results[i].image);
				}
			});
			if (this.$route.query.dataset != undefined) {
				const seriesDataImg = await moreDataImage(
					Number(this.$route.query.dataset),
					1,
					this.next.nextImageCard
				);
				this.imagesSeries.push(...seriesDataImg.imageSeries);
				this.next.nextImageCard = seriesDataImg.nextImageCard;
			}
			return this.setLayout();
		},
		gridClick(load: boolean = false) {
			const listElement = document.querySelectorAll('.list');
			for (let i = 0; i < listElement.length; i++) {
				listElement[i].querySelector('a > img')!.className = !this.grid
					? 'card-img-top rounded-pill image-series mt-2'
					: 'card-img-top';
			}
			document.querySelector('#gridButton')!.className = !this.grid
				? 'bi bi-card-image ms-2 fs-5'
				: 'bi bi-grid ms-2 fs-5';
			this.grid = !this.grid;
			if (!load) this.$cookies.set('grid-cookie', this.grid, 60 * 60 * 24 * 30);
		},
		async setLayout() {
			if (this.$cookies.isKey('grid-cookie')) {
				this.grid = this.$cookies.get('grid-cookie') == 'true' ? false : true;
				this.gridClick(true);
			}
			document.querySelector('span')!.className = 'badge rounded-pill text-bg-info me-2';
			(this.$refs.spinner as InstanceType<typeof spinnerLoading>).finishLoading();
		},
		mouseEnter(id: string) {
			document.querySelector(`#${id}`)!.className =
				'card mt-2 border border-primary border-3 opacity-50';
		},
		mouseLeave(id: string) {
			document.querySelector(`#${id}`)!.className = 'card mt-2';
		},
		async moreSeries() {
			if (this.next.nextCard != null && this.next.nextImageCard != null) {
				(this.$refs.spinner as InstanceType<typeof spinnerLoading>).startLoading();
				await moreData(1, 0, this.next.nextCard).then((seriesData) => {
					this.series.push(...seriesData.series);
					this.next.nextCard = seriesData.nextCard;
				});
				await moreDataImage(1, 0, this.next.nextImageCard).then((seriesDataImg) => {
					this.imagesSeries.push(...seriesDataImg.imageSeries);
					this.next.nextImageCard = seriesDataImg.nextImageCard;
				});
				let type = undefined;
				let search =
					this.$route.query.filterbyname != null ? String(this.$route.query.filterbyname) : '';
				if (!isNaN(Number(this.$route.query.type))) type = Number(this.$route.query.type);

				this.changeUrl(type, search);
				return this.setLayout();
			}
		},
		changeUrl(type: number = 0, search: string = '') {
			if (this.next.nextCard != null) {
				this.$router.replace({
					query: {
						dataset: Number(this.next.nextCard.replace(/\S*page=/g, '').replace(/&\S*/g, '')) - 1,
						type: type != 0 ? type : undefined,
						filterbyname: search != '' ? search : undefined
					}
				});
			} else {
				this.$router.replace({
					query: {
						dataset: -1,
						type: type != 0 ? type : undefined,
						filterbyname: search != '' ? search : undefined
					}
				});
			}
		},
		async search(type: number, searchBarText: string) {
			(this.$refs.spinner as InstanceType<typeof spinnerLoading>).startLoading();
			if (type == 0 && searchBarText === '') {
				await this.$router.replace({
					query: {}
				});
				await this.getDataSeries();
				return;
			}
			let url =
				type == 0
					? `${endpoints.series}?filterbyname=${searchBarText}`
					: `${endpoints.series}?type=${type}&filterbyname=${searchBarText}`;
			let imageUrl =
				type == 0
					? `${endpoints.imgSeries}?filterbyname=${searchBarText}`
					: `${endpoints.imgSeries}?type=${type}&filterbyname=${searchBarText}`;
			apiService(url)
				.then((data: RequestObject) => {
					this.series = data.results;
					this.seriesLength = data.count;
					this.next.nextCard = data.next;
				})
				.then(() => {
					apiService(imageUrl)
						.then((data: RequestObject) => {
							this.next.nextImageCard = data.next;
							this.imagesSeries = [];
							for (let i = 0; i < data.results.length; i++) {
								this.imagesSeries.push(data.results[i].image);
							}
						})
						.then(() => {
							this.changeUrl(type, searchBarText);
							return this.setLayout();
						});
				});
		},
		filter() {
			let filter = '?';
			if (this.$route.query.type != undefined) {
				filter += 'type=' + this.$route.query.type;
				filter += '&';
			}
			if (this.$route.query.filterbyname != undefined) {
				filter += 'filterbyname=' + this.$route.query.filterbyname;
			}
			return filter;
		}
	},
	async created() {
		await this.getDataSeries();
		window.scrollTo(0, history.state?.scroll?.top || 0);
	}
};
</script>

<style>
a {
	text-decoration: none;
}
</style>
