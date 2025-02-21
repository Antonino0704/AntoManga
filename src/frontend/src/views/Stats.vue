<template>
	<div class="stats mt-3">
		<h1 class="fs-1 font-monospace">STATS</h1>
		<table class="table container-sm">
			<thead>
				<tr>
					<th scope="col">Title</th>
					<th scope="col">Length(Vol. Read):</th>
					<th scope="col">Length(Vol. Bought)</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th scope="row">{{ stats?.type?.name }}</th>
					<td>{{ stats?.volumes_read }}</td>
					<td>{{ stats?.volumes_bought }}</td>
				</tr>
			</tbody>
		</table>
		<i @click="previous()" class="bi bi-arrow-left" v-if="current != 0"></i>
		<i @click="next()" class="bi bi-arrow-right ms-5" v-if="current < types.length - 1"></i>
	</div>
</template>

<script lang="ts">
import { apiService } from '../utils/APIService';
import type { Stats, Type } from '../@types/interfaces';
import { endpoints } from '@/utils/endpoints';

export default {
	name: 'StatsView.vue',
	data() {
		return {
			types: [
				{
					id: 0,
					name: 'ALL'
				}
			] as Array<Type>,
			stats: {} as Stats,
			current: 0
		};
	},
	methods: {
		getStats() {
			apiService(endpoints.seriesLength).then((data: any) => {
				this.stats = {
					type: this.types[this.current],
					volumes_bought: data.volumes_bought_tot,
					volumes_read: data.volumes_read_tot
				};
			});
			this.getTypes();
		},
		getTypes() {
			apiService(endpoints.types).then((data: Array<Type>) => {
				this.types.push(...data);
			});
		},
		next() {
			this.current++;
			apiService(`${endpoints.seriesLength}?type=${this.types[this.current].id}`).then(
				(data: any) => {
					this.stats = {
						type: this.types[this.current],
						volumes_bought: data.volumes_bought_tot,
						volumes_read: data.volumes_read_tot
					};
				}
			);
		},
		previous() {
			this.current--;
			if (this.current == 0) {
				this.getStats();
			}
			apiService(`${endpoints.seriesLength}?type=${this.types[this.current].id}`).then(
				(data: any) => {
					this.stats = {
						type: this.types[this.current],
						volumes_bought: data.volumes_bought_tot,
						volumes_read: data.volumes_read_tot
					};
				}
			);
		}
	},
	created() {
		this.getStats();
	}
};
</script>

<style>
.stats {
	text-align: center;
}
</style>
