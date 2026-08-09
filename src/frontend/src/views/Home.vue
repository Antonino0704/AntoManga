<template>
	<div class="HomeView row justify-content-center">
		<navbar @filterEvent="search" />
		<spinnerLoading ref="spinner" />
		<div class="col-auto">
			<div class="container text-center">
				<div class="fs-1">
					Home
					<i class="bi bi-house"></i>
					<div class="fs-6" v-if="user.is_authenticated">Welcome {{ user.username }}</div>
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
								<h5 class="card-title">
									{{ serie.name }}
									<i
										v-if="getReadyToReadClick(serie)"
										class="bi bi-exclamation-circle-fill text-warning"
									></i>
									<i
										v-if="serie.is_discontinued"
										class="bi bi-exclamation-triangle-fill text-danger ms-2"
									></i>
								</h5>
								<p class="card-text fst-italic">Type: {{ serie.typology_name }}</p>
								<p class="card-text" v-if="serie.purchased_at">
									<small class="text-body-secondary"
										>Latest purchase: {{ serie.purchased_at }}</small
									>
								</p>

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
import type { SeriesViewsetInstance, RequestObject, User } from '../@types/interfaces';
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
			readyToRead: false,
			user: {} as User,
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
				if (!this.grid) {
					listElement[i].querySelector('div')!.style.removeProperty('width');
					listElement[i].querySelector('div')!.style.setProperty('min-width', '12rem');
					listElement[i].querySelector('div')!.style.border = 'none';
					listElement[i]!.className = 'list col-6 col-md-4 col-lg-3 mt-3 me-auto';
					listElement[i].querySelector('a > img')!.removeAttribute('height');
					listElement[i].querySelector('a > img')!.classList.add('card-fit');
				} else {
					listElement[i].querySelector('div')!.style.setProperty('width', '18rem');
					listElement[i].querySelector('div')!.style.removeProperty('min-width');
					listElement[i].querySelector('div')!.style.border = '1';
					listElement[i]!.className = 'list col mt-3';
					listElement[i].querySelector('a > img')!.setAttribute('height', '410');
					listElement[i].querySelector('a > img')!.classList.remove('card-fit');
				}
			}

			this.grid = !this.grid;
			if (!load) localStorage.setItem('grid-cookie', String(this.grid));
		},
		getReadyToReadClick(serie: SeriesViewsetInstance) {
			return (
				this.readyToRead && serie.volumes_read != serie.volumes_bought && this.user.is_authenticated
			);
		},
		readReadyToReadCockie() {
			this.readyToRead = localStorage.getItem('readytoread-cookie') == 'true' ? true : false;
		},
		async setLayout() {
			if (localStorage.getItem('grid-cookie')) {
				this.grid = localStorage.getItem('grid-cookie') == 'true' ? false : true;
				this.gridClick(true);
			}
			this.readReadyToReadCockie();
			document.querySelectorAll('span')[1]!.className = 'badge rounded-pill text-bg-info me-2';
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

				let search =
					this.$route.query.filterbyname != null ? String(this.$route.query.filterbyname) : '';

				let types: number[] = [];
				if (this.$route.query.type != undefined) {
					if (Array.isArray(this.$route.query.type)) {
						types = this.$route.query.type.map((t) => Number(t)).filter((n) => !isNaN(n));
					} else {
						types = Array.of(Number(this.$route.query.type));
					}
				}

				let publishers: number[] = [];
				if (this.$route.query.publisher != undefined) {
					if (Array.isArray(this.$route.query.publisher)) {
						publishers = this.$route.query.publisher.map((t) => Number(t)).filter((n) => !isNaN(n));
					} else {
						publishers = Array.of(Number(this.$route.query.publisher));
					}
				}

				let sortByList: number[] = [];
				if (this.$route.query.purchased_at != undefined) {
					sortByList = Array.of(this.$route.query.purchased_at == 'desc' ? 1 : 2);
				}

				this.changeUrl(types, search, publishers, sortByList);
				return this.setLayout();
			}
		},
		/**
		 *
		 * This method is used to create a URL for the frontend
		 */
		changeUrl(types: number[], search: string = '', publishers: number[], sortByList: number[]) {
			if (this.next.nextCard != null) {
				this.$router.replace({
					query: {
						dataset: Number(this.next.nextCard.replace(/\S*page=/g, '').replace(/&\S*/g, '')) - 1,
						type: types.length != 0 ? types : undefined,
						filterbyname: search != '' ? search : undefined,
						publisher: publishers.length != 0 ? publishers : undefined,
						purchased_at: sortByList.length != 0 ? (sortByList[0] == 1 ? 'desc' : 'asc') : undefined
					}
				});
			} else {
				this.$router.replace({
					query: {
						dataset: -1,
						type: types.length != 0 ? types : undefined,
						filterbyname: search != '' ? search : undefined,
						publisher: publishers.length != 0 ? publishers : undefined,
						purchased_at: sortByList.length != 0 ? (sortByList[0] == 1 ? 'desc' : 'asc') : undefined
					}
				});
			}
		},
		/**
		 *
		 * This method sends the search request to the backend
		 */
		async search(
			types: number[],
			searchBarText: string,
			publishers: number[],
			sortByList: number[]
		) {
			(this.$refs.spinner as InstanceType<typeof spinnerLoading>).startLoading();

			if (
				types.length == 0 &&
				searchBarText === '' &&
				publishers.length == 0 &&
				sortByList.length == 0
			) {
				await this.$router.replace({
					query: {}
				});
				await this.getDataSeries();
				return;
			}
			let url =
				types.length == 0
					? `${endpoints.series}?filterbyname=${searchBarText}`
					: `${endpoints.series}?${this.createTypeUrl(types)}&filterbyname=${searchBarText}`;

			if (publishers.length != 0) url = `${url}&${this.createPubslisherUrl(publishers)}`;

			if (sortByList.length != 0) url = `${url}&${this.createOrderByUrl(sortByList)}`;

			let imageUrl =
				types.length == 0
					? `${endpoints.imgSeries}?filterbyname=${searchBarText}`
					: `${endpoints.imgSeries}?${this.createTypeUrl(types)}&filterbyname=${searchBarText}`;

			if (publishers.length != 0) imageUrl = `${imageUrl}&${this.createPubslisherUrl(publishers)}`;

			if (sortByList.length != 0) imageUrl = `${imageUrl}&${this.createOrderByUrl(sortByList)}`;

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
							this.changeUrl(types, searchBarText, publishers, sortByList);
							return this.setLayout();
						});
				});
		},
		/**
		 * Similar to method search,
		 * it creates the filter URL for requests to be sent to the backend
		 * when method getDataSeries is invoked at created
		 */
		filter() {
			let filter = '?';

			if (this.$route.query.type != undefined) {
				if (Array.isArray(this.$route.query.type)) {
					filter += 'type=' + this.$route.query.type.map((t) => Number(t)).filter((n) => !isNaN(n));
				} else {
					filter += 'type=' + this.$route.query.type;
				}
				filter += '&';
			}
			if (this.$route.query.filterbyname != undefined) {
				filter += 'filterbyname=' + this.$route.query.filterbyname;
			}
			if (this.$route.query.publisher != undefined) {
				filter += '&';
				if (Array.isArray(this.$route.query.publisher)) {
					filter +=
						'publisher=' +
						this.$route.query.publisher.map((p) => Number(p)).filter((n) => !isNaN(n));
				} else {
					filter += 'publisher=' + this.$route.query.publisher;
				}
			}

			if (this.$route.query.purchased_at != undefined) {
				filter += '&purchased_at=' + this.$route.query.purchased_at;
			}
			return filter;
		},
		isAuthenticated() {
			apiService(endpoints.userMe, 'GET').then((response: User) => {
				this.user = response;
			});
		},
		createTypeUrl(types: number[]) {
			let url = `type=${types[0]}`;
			let newType = types.slice(1); // create a new type array because we don't want to change the 'types' instance
			newType.forEach((type) => {
				url += `%2C${type}`;
			});
			return url;
		},
		createPubslisherUrl(publishers: number[]) {
			let url = `publisher=${publishers[0]}`;
			let newPub = publishers.slice(1);
			newPub.forEach((publisher) => {
				url += `%2C${publisher}`;
			});
			return url;
		},
		createOrderByUrl(order: number[]) {
			return `purchased_at=${order[0] == 1 ? 'desc' : 'asc'}`;
		}
	},
	async created() {
		await this.getDataSeries();
		this.isAuthenticated();
		window.scrollTo(0, history.state?.scroll?.top || 0);
	}
};
</script>

<style>
a {
	text-decoration: none;
}
.card-fit {
	width: 12rem;
	height: 12rem;
	object-fit: contain;
}
</style>
