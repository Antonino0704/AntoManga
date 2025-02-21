<template>
	<div class="HomeView row justify-content-center">
		<navbar @filterEvent="search" />
		<div
			v-if="loading"
			class="spinner-border position-absolute top-50 start-50"
			style="width: 3rem; height: 3rem"
			role="status"
		></div>
		<div class="col-auto">
			<div class="container text-center">
				<div class="fs-1">
					Series
					<i id="gridButton" class="bi bi-grid ms-2 fs-5" @click="gridClick()"></i>
				</div>
				<div>
					<span class="badge rounded-pill text-bg-info me-2">Length: {{ seriesLength }}</span>
					<span class="badge rounded-pill text-bg-info me-2"
						>Length(Vol. Read): {{ NVolumesRead }}</span
					>
					<span class="badge rounded-pill text-bg-info mt-2"
						>Length(Vol. Bought): {{ NVolumesBought }}</span
					>
				</div>
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
import { endpoints } from '@/utils/endpoints';

export default {
	name: 'HomeView',
	data() {
		return {
			series: [] as Array<SeriesViewsetInstance>,
			imagesSeries: [] as Array<string>,
			NVolumesBought: 0,
			NVolumesRead: 0,
			seriesLength: 0,
			grid: false,
			loading: true,
			next: {
				nextCard: null as string | null,
				nextImageCard: null as string | null
			}
		};
	},
	components: {
		navbar
	},
	methods: {
		moreData(dataset: number, current: number) {
			if ((current >= dataset && dataset != -1) || this.next.nextCard == null) {
				this.setLayout();
				this.loading = false;
				return;
			}
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
									this.imagesSeries.push(data.results[i].image);
								}
							})
							.then(() => {
								this.moreData(dataset, current + 1);
							});
					}
				});
		},
		getDataSeries() {
			apiService(endpoints.series + this.filter())
				.then((data: RequestObject) => {
					this.series = data.results;
					this.seriesLength = data.count;
					this.next.nextCard = data.next;
				})
				.then(() => {
					if (this.$route.query.dataset != undefined) {
						this.loading = true;
						this.moreData(Number(this.$route.query.dataset), 1);
					}
				});
		},
		getDataImageSeries() {
			apiService(endpoints.imgSeries + this.filter())
				.then((data: RequestObject) => {
					this.next.nextImageCard = data.next;
					this.imagesSeries = [];
					for (let i = 0; i < data.results.length; i++) {
						this.imagesSeries.push(data.results[i].image);
					}
				})
				.then(() => {
					this.loading = false;
					this.setLayout();
				});
		},
		getLength(typeFilter = '') {
			apiService(`${endpoints.seriesLength}${typeFilter ? `?type=${typeFilter}` : ''}`).then(
				(data: any) => {
					this.NVolumesRead = data.volumes_read_tot;
					this.NVolumesBought = data.volumes_bought_tot;
				}
			);
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
		setLayout() {
			setTimeout(() => {
				if (this.$cookies.isKey('grid-cookie')) {
					this.grid = this.$cookies.get('grid-cookie') == 'true' ? false : true;
					this.gridClick(true);
				}
			}, 500);
		},
		mouseEnter(id: string) {
			document.querySelector(`#${id}`)!.className =
				'card mt-2 border border-primary border-3 opacity-50';
		},
		mouseLeave(id: string) {
			document.querySelector(`#${id}`)!.className = 'card mt-2';
		},
		moreSeries() {
			if (this.next.nextCard != null) {
				this.loading = true;
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
										this.imagesSeries.push(data.results[i].image);
									}
								})
								.then(() => {
									this.setLayout();
									if (!isNaN(Number(this.$route.query.type)))
										this.changeUrl(Number(this.$route.query.type));
									else this.changeUrl();
									this.loading = false;
								});
						}
					});
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
			if (type == 0 && searchBarText === '') {
				this.$router.replace({
					query: {}
				});
				setTimeout(() => {
					this.getDataSeries();
					this.getDataImageSeries();
					this.getLength();
				}, 100);
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
					this.getLength(type.toString());
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
							this.setLayout();
							this.changeUrl(type, searchBarText);
							this.loading = false;
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
	created() {
		this.getDataSeries();
		this.getDataImageSeries();
		this.getLength(this.$route.query.type?.toString());
	}
};
</script>

<style>
a {
	text-decoration: none;
}
</style>
