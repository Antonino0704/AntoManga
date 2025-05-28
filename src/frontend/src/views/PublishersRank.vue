<template>
	<div class="PublisherRank mt-3">
		<h1 class="fs-1 font-monospace">Publishers Rank</h1>
		<div>
			<table class="table container-sm">
				<thead>
					<tr>
						<th scope="col">Pos</th>
						<th scope="col">N. Series</th>
						<th scope="col">Publisher</th>
						<th scope="col">IMG</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(publisher, index) in publishers" :key="index">
						<th scope="row">
							{{ index + 1 }}
							<i v-if="index == 0" class="bi bi-trophy-fill text-warning"></i>
						</th>
						<td>{{ publisher.count }}</td>
						<td>
							<router-link
								:to="{
									name: 'PublisherDetail',
									params: { slug: publisher.slug }
								}"
							>
								{{ publisher.name }}
							</router-link>
						</td>
						<td><img :src="publisher.image" class="rounded-circle" height="50" width="50" /></td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script lang="ts">
import { apiService } from '../utils/APIService';
import type { Publisher, PublisherRank, RequestObject } from '../@types/interfaces';
import { endpoints } from '@/utils/endpoints';

export default {
	name: 'PublisherRank',
	data() {
		return {
			publishers: [] as Array<PublisherRank>
		};
	},
	methods: {
		getPublishers() {
			apiService(endpoints.publishers).then((publishers: Array<PublisherRank>) => {
				this.publishers.push(...publishers);
				this.getImageSeries();
				this.getSeriesList();
				this.sort();
			});
		},
		getImageSeries() {
			this.publishers.forEach((publisher: PublisherRank) => {
				apiService(`${endpoints.imgPublishers}${publisher.slug}/`).then(
					(imgPublisher: Publisher) => {
						publisher.image = imgPublisher.image;
					}
				);
			});
		},
		getSeriesList() {
			this.publishers.forEach((publisher: PublisherRank) => {
				apiService(`${endpoints.seriesList}${publisher.slug}/`).then((data: RequestObject) => {
					publisher.count = data.count;
				});
			});
		},
		sort() {
			this.publishers.sort((publisher: PublisherRank) => {
				return publisher.count;
			});
			this.publishers.reverse();
		}
	},
	created() {
		this.getPublishers();
	}
};
</script>

<style>
.PublisherRank {
	text-align: center;
}
</style>
