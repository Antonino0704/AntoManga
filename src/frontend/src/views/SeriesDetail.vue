<template>
	<div v-if="series.detail">
		<NotFound message="SERIES NOT FOUND" />
	</div>
	<div v-else class="series-detail container-sm mt-3">
		<router-link
			:to="{ name: 'AddSeries' }"
			class="btn btn-outline-info mb-3"
			v-if="user.is_authenticated"
			>Add A New Series
		</router-link>
		<div
			class="card mb-3 card-border-sm"
			style="max-width: 540px; margin-left: auto; margin-right: auto"
		>
			<div class="row g-0">
				<div class="col-8 offset-2 col-md-4 offset-md-0 text-center">
					<img :src="imageSeries" class="img-fluid rounded-start" />
				</div>
				<div class="col-md-8">
					<div class="card-body">
						<h5 class="card-title">{{ series.name }}</h5>
						<p class="card-text">
							<small class="text-body-secondary">Type: {{ series.typology_name }}</small>
							<br />
							<small class="text-body-secondary">
								Publisher:
								<router-link
									:to="{ name: 'PublisherDetail', params: { slug: series.publisher_slug } }"
								>
									{{ series.publisher_name }}</router-link
								></small
							>
							<small class="text-body-secondary">
								<p v-if="series.purchased_at">Latest purchase: {{ series.purchased_at }}</p>
							</small>
						</p>
						<p class="card-text">
							<small class="text-body-secondary"
								><router-link
									:to="{ name: 'SeriesEditor', params: { slug: series.slug } }"
									class="list-inline-item ms-2"
									v-if="user.is_authenticated"
								>
									<!--pen logo from bootstrap-->
									<i class="bi bi-pen fs-6" fill="currentColor"></i>
								</router-link>

								<!--bin icon from bootstrap-->
								<i
									fill="currentColor"
									class="bi bi-trash list-inline-item text-warning fs-6"
									@click="deleteSeries()"
									v-if="user.is_authenticated"
								>
								</i>
								<a
									class="bi bi-share-fill fs-6"
									onclick="
										navigator.clipboard.writeText(window.location.href);
										return false;
									"
									@click="copyAction()"
								></a>
								<div class="mt-3" v-if="ReadyToRead() || series.is_discontinued">
									<div class="alert alert-warning" role="alert" v-if="ReadyToRead()">
										This series has unread volumes
									</div>
									<div class="alert alert-danger" role="alert" v-if="series.is_discontinued">
										This series is discontinued
									</div>
								</div>
							</small>
						</p>
					</div>
				</div>
				<hr class="mt-3" />
				<p class="card-text"><seriesDetailStats :slug="slug" @changeStatsEvent="updateData" /></p>
			</div>
		</div>

		<ActionNotification
			class="position-absolute top-0 start-50 translate-middle-x"
			ref="actionNotification"
		/>
	</div>
</template>

<script lang="ts">
import { apiService } from '../utils/APIService';
import seriesDetailStats from '../components/SeriesDetailStatistics.vue';
import ActionNotification from '../components/ActionNotification.vue';
import NotFound from '../views/NotFound.vue';
import type { SeriesViewsetInstance } from '../@types/interfaces';
import { endpoints } from '@/utils/endpoints';
import { useUserStore } from '@/stores/userStore';
import { mapState } from 'pinia';

export default {
	name: 'SeriesDetail',
	props: {
		slug: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			series: {} as SeriesViewsetInstance,
			imageSeries: ''
		};
	},
	components: {
		seriesDetailStats,
		ActionNotification,
		NotFound
	},
	computed: {
		...mapState(useUserStore, ['user'])
	},
	methods: {
		getSeriesData() {
			apiService(`${endpoints.series}${this.slug}/`).then((data: SeriesViewsetInstance) => {
				this.series = data;
			});
		},
		getImageSeries() {
			apiService(`${endpoints.imgSeries}${this.slug}/`).then((data: SeriesViewsetInstance) => {
				this.imageSeries = data.image;
			});
		},
		deleteSeries() {
			(this.$refs.actionNotification as InstanceType<typeof ActionNotification>).sendNotification(
				'are you sure? you will no longer be able to retrieve the data',
				`${this.series.name} deleted`,
				`${endpoints.series}${this.slug}/`
			);
			window.scrollTo(0, 0);
		},
		updateData(volumes_read: number, volumes_bought: number) {
			if (volumes_bought > this.series.volumes_bought)
				this.series.purchased_at = new Date().toISOString().slice(0, 10);
			else if (volumes_bought < this.series.volumes_bought) this.series.purchased_at = '';

			this.series.volumes_read = volumes_read;
			this.series.volumes_bought = volumes_bought;
		},
		copyAction() {
			let shareButton = document.querySelector('.bi-share-fill') as HTMLElement;
			shareButton.className = 'bi bi-check-square-fill text-success fs-6';
			setTimeout(() => {
				shareButton.className = 'bi bi-share-fill fs-6';
			}, 2000);
		},
		ReadyToRead() {
			return this.series.volumes_read != this.series.volumes_bought && this.user.is_authenticated;
		}
	},
	created() {
		this.getSeriesData();
		this.getImageSeries();
	}
};
</script>

<style>
.image-series {
	display: block;
	margin-left: auto;
	margin-right: auto;
	width: 50%;
}
</style>
