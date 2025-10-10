<template>
	<div v-if="series.detail">
		<NotFound message="SERIES NOT FOUND" />
	</div>
	<div v-else class="series-detail container-sm mt-3">
		<router-link
			:to="{ name: 'AddSeries' }"
			class="btn btn-outline-info mb-3"
			v-if="user.is_authenticated"
			>Add A New Manga
		</router-link>
		<div class="card mb-3" style="max-width: 540px; margin-left: auto; margin-right: auto">
			<div class="row g-0">
				<div class="col-md-4">
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
									class="text-body-prmary"
									:to="{ name: 'PublisherDetail', params: { slug: series.publisher_slug } }"
								>
									{{ series.publisher_name }}</router-link
								></small
							>
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
									class="bi bi-trash list-inline-item text-warning fs-5"
									@click="deleteSeries()"
									v-if="user.is_authenticated"
								>
								</i
							></small>
						</p>
					</div>
				</div>
				<hr class="mt-3" />
				<p class="card-text"><seriesDetailStats :slug="slug" /></p>
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
import type { SeriesViewsetInstance, User } from '../@types/interfaces';
import { endpoints } from '@/utils/endpoints';

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
			imageSeries: '',
			user: {} as User
		};
	},
	components: {
		seriesDetailStats,
		ActionNotification,
		NotFound
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
		},
		isAuthenticated() {
			apiService(endpoints.userMe, 'GET').then((response: User) => {
				this.user = response;
			});
		}
	},
	created() {
		this.getSeriesData();
		this.getImageSeries();
		this.isAuthenticated();
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
