<template>
	<div>
		<p class="d-inline-flex gap-1 mt-3">
			<button
				class="btn btn-outline-info"
				type="button"
				data-bs-toggle="collapse"
				data-bs-target="#collapseStats"
				aria-expanded="false"
				aria-controls="collapseStats"
			>
				Stats
				<i class="bi bi-bar-chart"></i>
			</button>
		</p>
		<div class="stats mt-3 collapse" id="collapseStats">
			<h2 class="fs-5 font-monospace">STATS</h2>
			<div id="load" class="placeholder">
				<table class="table table-striped-columns container-sm border border-black">
					<thead>
						<tr>
							<th scope="col">Type</th>
							<th scope="col">N. Series</th>
							<th scope="col">N. Series (%)</th>
						</tr>
					</thead>
					<tbody>
						<tr v-if="stats[current]">
							<th scope="row">{{ stats[current].type?.name }}</th>
							<td>{{ stats[current].nSeries }}</td>
							<td>{{ formatX100 }}%</td>
						</tr>
					</tbody>
				</table>
				<i @click="previous()" class="bi bi-arrow-left" v-if="current != 0"></i>
				<i @click="next()" class="bi bi-arrow-right ms-5" v-if="current < types.length - 1"></i>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { apiService } from '../utils/APIService';
import type { PublisherStats, Type, RequestObject } from '../@types/interfaces';
import { endpoints } from '@/utils/endpoints';

export default {
	name: 'PublisherStats.vue',
	props: {
		slug: {
			type: String,
			required: true
		},
		seriesLength: {
			type: Number,
			required: true
		}
	},
	data() {
		return {
			types: [] as Array<Type>,
			stats: [] as Array<PublisherStats>,
			current: 0
		};
	},
	methods: {
		async getStats() {
			this.types = await apiService(endpoints.types);
			for (let type of this.types) {
				await apiService(`${endpoints.publisherStats}${this.slug}/${type.id}/`).then(
					(data: RequestObject) => {
						this.stats.push({
							type: type,
							nSeries: data.count
						});

						document.querySelector('#load')!.className = '';
					}
				);
			}
		},
		async next() {
			document.querySelector('#load')!.className = 'placeholder';
			this.current++;
			document.querySelector('#load')!.className = '';
		},
		previous() {
			document.querySelector('#load')!.className = 'placeholder';
			this.current--;
			document.querySelector('#load')!.className = '';
		}
	},
	computed: {
		formatX100() {
			return this.seriesLength
				? ((this.stats[this.current].nSeries / this.seriesLength) * 100).toFixed(2)
				: 0;
		}
	},
	async created() {
		await this.getStats();
	}
};
</script>

<style>
.stats {
	text-align: center;
}
</style>
