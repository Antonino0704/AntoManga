<template>
	<WelcomeComponent v-if="!welcomePage && !user.is_authenticated" />
	<div v-else class="HomeView row justify-content-center">
		<navbar @filterEvent="search" />
		<spinnerLoading ref="spinner" />
		<div id="dNoneId" class="col-auto d-none">
			<div class="container text-center">
				<div class="fs-1">
					Home
					<i class="bi bi-house"></i>
					<div class="fs-6" v-if="user.is_authenticated">
						{{ $t('common.messages.welcome', { user: user.username }) }}<i class="bi bi-person"></i>
					</div>
				</div>
				<div>
					<span class="badge rounded-pill me-2 placeholder"
						>{{ series.length }} / {{ seriesLength }}</span
					>
				</div>
				<SearchNoResults
					:message="$t('common.messages.searchNoResults')"
					v-if="!seriesLength"
					class="mt-2"
				/>
				<div :class="`row ${getLayoutClasses} g-4 mt-3 me-2 ms-2`" id="cardGroup`">
					<div class="col" v-for="(serie, index) in series" :key="serie.id">
						<div
							:id="'cardid-' + serie.id"
							class="card card-border-sm"
							@mouseenter="mouseEnter('cardid-' + serie.id)"
							@mouseleave="mouseLeave('cardid-' + serie.id)"
						>
							<router-link :to="{ name: 'SeriesDetail', params: { slug: serie.slug } }">
								<div class="ratio ratio-1x1">
									<img
										:src="imagesSeries[index]"
										class="card-img-top card-fit object-fit-contain object-fit-md-cover"
										:alt="serie.name"
									/>
								</div>
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
								<p class="card-text fst-italic">
									{{ $t('common.titles.type', 1) }}: {{ serie.typology_name }}
								</p>
								<p class="card-text" v-if="serie.purchased_at">
									<small class="text-body-secondary"
										>{{ $t('common.messages.latestPurchase') }}: {{ serie.purchased_at }}</small
									>
								</p>

								<router-link
									:to="{
										name: 'PublisherDetail',
										params: { slug: serie.publisher_slug }
									}"
								>
									<p class="card-text fw-bold">
										{{ $t('common.titles.publisher', 1) }}: {{ serie.publisher_name }}
									</p>
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
					{{ $t('common.buttons.more') }}
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { apiExpress } from '@/utils/APIExpress';
import type { SeriesViewsetInstance, RequestObject } from '../@types/interfaces';
import navbar from '../components/Navbar.vue';
import spinnerLoading from '../components/SpinnerLoading.vue';
import SearchNoResults from '../components/SearchNoResults.vue';
import WelcomeComponent from '../components/WelcomeComponent.vue';
import { endpoints } from '@/utils/endpoints';
import { moreData, moreDataImage } from '../utils/getSeries';
import { useUserStore } from '@/stores/userStore';
import { mapState } from 'pinia';

export default {
	name: 'HomeView',
	data() {
		return {
			series: [] as Array<SeriesViewsetInstance>,
			imagesSeries: [] as Array<string>,
			seriesLength: 1,
			grid: false,
			readyToRead: false,
			next: {
				nextCard: null as string | null,
				nextImageCard: null as string | null
			},
			numberOfCol: [2, 3, 4]
		};
	},
	components: {
		navbar,
		spinnerLoading,
		SearchNoResults,
		WelcomeComponent
	},
	computed: {
		getLayoutClasses() {
			return `row-cols-${this.numberOfCol[0]} row-cols-md-${this.numberOfCol[1]} row-cols-lg-${this.numberOfCol[2]}`;
		},
		welcomePage() {
			if (sessionStorage.getItem('welcomeSeen')) return true;
			return false;
		},
		...mapState(useUserStore, ['user'])
	},
	methods: {
		async getDataSeries() {
			try {
				const response = await apiExpress.get<RequestObject>(endpoints.series + this.filter());
				this.series = response.results;
				this.seriesLength = response.count;
				this.next.nextCard = response.next;
			} catch (err) {
				console.error(err);
			}

			if (this.$route.query.dataset != undefined) {
				try {
					const seriesData = await moreData(
						Number(this.$route.query.dataset),
						1,
						this.next.nextCard
					);
					this.series.push(...seriesData.results);
					this.next.nextCard = seriesData.next;
				} catch (err) {
					console.log(err);
				}
			}
			this.getDataImageSeries();
		},
		async getDataImageSeries() {
			try {
				const response = await apiExpress.get<RequestObject>(endpoints.imgSeries + this.filter());
				this.next.nextImageCard = response.next;
				this.imagesSeries = [];
				for (let i = 0; i < response.results.length; i++) {
					this.imagesSeries.push(response.results[i].image);
				}
			} catch (err) {
				console.error(err);
			}

			if (this.$route.query.dataset != undefined) {
				try {
					const seriesDataImg = await moreDataImage(
						Number(this.$route.query.dataset),
						1,
						this.next.nextImageCard
					);
					this.imagesSeries.push(...seriesDataImg.results);
					this.next.nextImageCard = seriesDataImg.next;
				} catch (err) {
					console.log(err);
				}
			}
			await this.setLayout();
			window.scrollTo(0, history.state?.scroll?.top || 0);
		},
		gridClick() {
			const nCard = this.series.length;
			const max = [2, 3, 4];

			if (localStorage.getItem('grid-cookie') && localStorage.getItem('grid-cookie') == 'true')
				max.forEach((v, i) => (max[i] = v - 1));

			max.forEach((v, i) => (this.numberOfCol[i] = nCard >= v ? v : nCard));
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
			this.gridClick();
			this.readReadyToReadCockie();
			document.querySelectorAll('span')[1]!.className = 'badge rounded-pill text-bg-info me-2';
			(this.$refs.spinner as InstanceType<typeof spinnerLoading>).finishLoading();
			document.querySelector('#dNoneId')!.classList.remove('d-none');
		},
		mouseEnter(id: string) {
			document
				.querySelector(`#${id}`)!
				.classList.add('border', 'border-primary', 'border-3', 'opacity-50');
		},
		mouseLeave(id: string) {
			document
				.querySelector(`#${id}`)!
				.classList.remove('border', 'border-primary', 'border-3', 'opacity-50');
		},
		async moreSeries() {
			if (this.next.nextCard != null && this.next.nextImageCard != null) {
				(this.$refs.spinner as InstanceType<typeof spinnerLoading>).startLoading();

				try {
					const seriesData = await moreData(1, 0, this.next.nextCard);
					this.series.push(...seriesData.results);
					this.next.nextCard = seriesData.next;

					const seriesDataImg = await moreDataImage(1, 0, this.next.nextImageCard);
					this.imagesSeries.push(...seriesDataImg.results);
					this.next.nextImageCard = seriesDataImg.next;
				} catch (err) {
					console.log(err);
				}

				const search =
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
				this.setLayout();
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

			try {
				const response = await apiExpress.get<RequestObject>(url);
				this.series = response.results;
				this.seriesLength = response.count;
				this.next.nextCard = response.next;
			} catch (err) {
				console.error(err);
			}

			try {
				const responseImage = await apiExpress.get<RequestObject>(imageUrl);
				this.next.nextImageCard = responseImage.next;
				this.imagesSeries = [];
				for (let i = 0; i < responseImage.results.length; i++) {
					this.imagesSeries.push(responseImage.results[i].image);
				}
			} catch (err) {
				console.error(err);
			}
			this.changeUrl(types, searchBarText, publishers, sortByList);
			this.setLayout();
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
		createTypeUrl(types: number[]) {
			let url = `type=${types[0]}`;
			const newType = types.slice(1); // create a new type array because we don't want to change the 'types' instance
			newType.forEach((type) => {
				url += `%2C${type}`;
			});
			return url;
		},
		createPubslisherUrl(publishers: number[]) {
			let url = `publisher=${publishers[0]}`;
			const newPub = publishers.slice(1);
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
	}
};
</script>

<style>
a {
	text-decoration: none;
}

@media (min-width: 768px) {
	.card-fit {
		object-position: top;
	}
}
@media (max-width: 767.98px) {
	.card-border-sm {
		border: none;
	}
}
</style>
