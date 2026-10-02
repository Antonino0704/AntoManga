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
				{{ $t('common.titles.stats') }}
				<i class="bi bi-bar-chart"></i>
			</button>
		</p>
		<div class="stats mt-3 collapse" id="collapseStats">
			<h2 class="fs-5 font-monospace">{{ $t('common.titles.stats').toUpperCase() }}</h2>
			<div id="load" class="placeholder">
				<table class="table table-striped-columns container-sm border border-black">
					<thead>
						<tr>
							<th scope="col">{{ $t('common.titles.type', 1) }}</th>
							<th scope="col">{{ $t('common.messages.nSeries') }}</th>
							<th scope="col">{{ $t('common.messages.nSeries') }} (%)</th>
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
import { apiExpress } from '@/utils/APIExpress';
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
			try {
				this.types = await apiExpress.get<Array<Type>>(endpoints.types);
				for (let type of this.types) {
					const response = await apiExpress.get<RequestObject>(
						`${endpoints.publisherStats}${this.slug}/${type.id}/`
					);
					await this.stats.push({
						type: type,
						nSeries: response.count
					});
					document.querySelector('#load')!.classList.remove('placeholder');
				}
			} catch (err) {
				console.log(err);
			}
		},
		async next() {
			document.querySelector('#load')!.classList.add('placeholder');
			this.current++;
			document.querySelector('#load')!.classList.remove('placeholder');
		},
		previous() {
			document.querySelector('#load')!.classList.add('placeholder');
			this.current--;
			document.querySelector('#load')!.classList.remove('placeholder');
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
