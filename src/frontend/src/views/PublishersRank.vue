<template>
	<div class="PublisherRank mt-3">
		<h1 class="fs-1 font-monospace">Publishers Rank</h1>
		<div class="placeholder">
			<table class="table container-sm placeholder">
				<thead>
					<tr>
						<th scope="col">Pos</th>
						<th scope="col">N. Series</th>
						<th scope="col"><i class="bi bi-globe-americas"></i> (%)</th>
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
						<!-- <td>{{ ((publisher.count / allVol) * 100).toFixed(2) }}%</td> -->
						<td>{{ formatX100(publisher.count) }}%</td>
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
import { apiExpress } from '@/utils/APIExpress';
import type { Publisher, PublisherRank, RequestObject } from '../@types/interfaces';
import { endpoints } from '@/utils/endpoints';

export default {
	name: 'PublisherRank',
	data() {
		return {
			publishers: [] as Array<PublisherRank>,
			allVol: 0
		};
	},
	methods: {
		async getPublishers() {
			try {
				const response = await apiExpress.get<Array<PublisherRank>>(endpoints.publishers);
				this.publishers.push(...response);
				this.getImageSeries();
				this.getSeriesList();
			} catch (err) {
				console.log(err);
			}
		},
		async getImageSeries() {
			for (const publisher of this.publishers) {
				try {
					const response = await apiExpress.get<Publisher>(
						`${endpoints.imgPublishers}${publisher.slug}/`
					);
					publisher.image = response.image;
				} catch (err) {
					console.log(err);
				}
			}
		},
		async getSeriesList() {
			for (const publisher of this.publishers) {
				try {
					const response = await apiExpress.get<RequestObject>(
						`${endpoints.seriesList}${publisher.slug}/`
					);
					this.allVol += response.count;
					publisher.count = response.count;
				} catch (err) {
					console.log(err);
				}
			}

			this.sort();
			document.querySelectorAll('.placeholder').forEach((el) => {
				el.classList.remove('placeholder');
			});
		},
		sort() {
			this.publishers.sort((publisher1, publisher2) => {
				return publisher1.count - publisher2.count;
			});
			this.publishers.reverse();
		},
		formatX100(publisherCount: any) {
			return this.allVol ? ((publisherCount / this.allVol) * 100).toFixed(2) : 0;
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
