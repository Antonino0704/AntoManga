<template>
	<div class="HomeView row justify-content-center">
		<div class="col-auto">
			<div class="container text-center">
				<div class="fs-1">
					Series
					<i id="gridButton" class="bi bi-grid ms-2 fs-5" @click="gridClick()"></i>
				</div>
				<div>
					<span class="badge rounded-pill text-bg-info me-2">Length: {{ series.length }}</span>
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
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { apiService } from '../utils/APIService';
import type { SeriesViewsetInstance } from '../@types/interfaces';

export default {
	name: 'HomeView',
	data() {
		return {
			series: [] as Array<SeriesViewsetInstance>,
			imagesSeries: [] as Array<string>,
			NVolumesBought: 0,
			NVolumesRead: 0,
			grid: false
		};
	},
	methods: {
		getDataSeries() {
			apiService('v2/series/').then((data: Array<SeriesViewsetInstance>) => {
				this.series = data;
				for (let i = 0; i < data.length; i++) {
					this.NVolumesBought += data[i].volumes_bought;
					this.NVolumesRead += data[i].volumes_read;
				}
			});
		},
		getDataImageSeries() {
			apiService('v2/image/series/').then((data: Array<SeriesViewsetInstance>) => {
				for (let i = 0; i < data.length; i++) {
					this.imagesSeries.push(data[i].image);
				}
			});
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
		}
	},
	created() {
		this.getDataSeries();
		this.getDataImageSeries();
	},
	mounted() {
		this.setLayout();
	}
};
</script>

<style>
a {
	text-decoration: none;
}
</style>
