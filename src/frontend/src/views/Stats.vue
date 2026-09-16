<template>
	<div class="stats mt-3">
		<h1 class="fs-1 font-monospace">STATS</h1>
		<div id="load" class="placeholder">
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
	</div>
</template>

<script lang="ts">
import { apiExpress } from '@/utils/APIExpress';
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
		async getStats() {
			try {
				const response = await apiExpress.get<{
					volumes_bought_tot: number;
					volumes_read_tot: number;
				}>(endpoints.seriesLength);

				this.stats = {
					type: this.types[this.current],
					volumes_bought: response.volumes_bought_tot,
					volumes_read: response.volumes_read_tot
				};
				document.querySelector('#load')!.classList.remove('placeholder');
			} catch (err) {
				console.log(err);
			}
		},
		async getTypes() {
			try {
				const response = await apiExpress.get<Array<Type>>(endpoints.types);
				await this.types.push(...response);
			} catch (err) {
				console.log(err);
			}
		},
		async next() {
			document.querySelector('#load')!.classList.add('placeholder');
			this.current++;
			await this.updateStats();
			document.querySelector('#load')!.classList.remove('placeholder');
		},
		async previous() {
			document.querySelector('#load')!.classList.add('placeholder');
			this.current--;
			if (this.current == 0) {
				await this.getStats();
			} else {
				await this.updateStats();
			}
			document.querySelector('#load')!.classList.remove('placeholder');
		},
		async updateStats() {
			try {
				const response = await apiExpress.get<{
					volumes_bought_tot: number;
					volumes_read_tot: number;
				}>(`${endpoints.seriesLength}?type=${this.types[this.current].id}`);

				this.stats = {
					type: this.types[this.current],
					volumes_bought: response.volumes_bought_tot,
					volumes_read: response.volumes_read_tot
				};
			} catch (err) {
				console.log(err);
			}
		}
	},
	created() {
		this.getStats();
		this.getTypes();
	}
};
</script>

<style>
.stats {
	text-align: center;
}
</style>
