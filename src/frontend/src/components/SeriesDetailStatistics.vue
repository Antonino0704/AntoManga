<template>
	<div class="series-detail-stats container-sm mt-3">
		<spinnerLoading ref="spinner" />
		<div class="list-inline-item" v-if="isAuthenticatedVar">
			<!--pen logo from bootstrap-->
			<i
				class="bi bi-pen list-inline-item fs-6"
				fill="currentColor"
				v-show="!editIcon"
				@click="edit()"
			></i>

			<!--success logo from bootstrap-->
			<i
				fill="currentColor"
				class="bi bi-check-circle-fill ms-5 text-success fs-5"
				v-show="editIcon"
				@click="sendData()"
			>
			</i>

			<!--x logo from bootstrap-->
			<i
				fill="currentColor"
				class="bi bi-x-circle-fill text-danger ms-2 fs-5"
				v-show="editIcon"
				@click="cancelOperation()"
			>
			</i>
		</div>

		<ul class="list-group mt-2">
			<!--n volumes-->
			<li class="list-group-item disabled statistics" aria-disabled="true">
				<div class="input-group flex-nowrap">
					<span class="input-group-text" id="addon-wrapping">N. Volumes</span>
					<input
						id="inputNVol"
						type="number"
						class="form-control"
						aria-label="n_volumes"
						aria-describedby="addon-wrapping"
						v-model="series.n_volumes"
					/>
				</div>
			</li>

			<!--volumes_bought-->
			<li class="list-group-item disabled statistics" aria-disabled="true">
				<div class="input-group flex-nowrap">
					<span class="input-group-text" id="addon-wrapping">Vol. Bought</span>
					<input
						id="inputBought"
						type="number"
						class="form-control"
						aria-label="n_volumes"
						aria-describedby="addon-wrapping"
						v-model="series.volumes_bought"
					/>
				</div>
			</li>

			<!--volumes_read-->
			<li class="list-group-item disabled statistics" aria-disabled="true">
				<div class="input-group flex-nowrap">
					<span class="input-group-text" id="addon-wrapping">Vol. Read</span>
					<input
						id="inputRead"
						type="number"
						class="form-control"
						aria-describedby="addon-wrapping"
						v-model="series.volumes_read"
					/>
				</div>
			</li>

			<!--missed_volumes-->
			<li class="list-group-item disabled statistics-x100" aria-disabled="true">
				<div class="input-group flex-nowrap">
					<span class="input-group-text" id="addon-wrapping">Missed Volumes</span>
					<input
						type="number"
						class="form-control"
						aria-describedby="addon-wrapping"
						:value="getMissedVolumes()"
					/>
				</div>
			</li>

			<!--volumes_read %-->
			<li class="list-group-item disabled statistics-x100" aria-disabled="true">
				<div class="input-group flex-nowrap">
					<span class="input-group-text" id="addon-wrapping">Vol. Read %</span>
					<input
						type="text"
						class="form-control"
						aria-describedby="addon-wrapping"
						:value="getVolumesReadx100() + '%'"
					/>
				</div>
			</li>

			<!--volumes_bought %-->
			<li class="list-group-item disabled statistics-x100" aria-disabled="true">
				<div class="input-group flex-nowrap">
					<span class="input-group-text" id="addon-wrapping">Vol. Bought %</span>
					<input
						type="text"
						class="form-control"
						aria-describedby="addon-wrapping"
						:value="getVolumesBought100() + '%'"
					/>
				</div>
			</li>

			<!--missed_volumes %-->
			<li class="list-group-item disabled statistics-x100" aria-disabled="true">
				<div class="input-group flex-nowrap">
					<span class="input-group-text" id="addon-wrapping">Missed Volumes %</span>
					<input
						type="text"
						class="form-control"
						aria-describedby="addon-wrapping"
						:value="getMissedVolumesx100() + '%'"
					/>
				</div>
			</li>
		</ul>
		<Notification ref="notification" />
	</div>
</template>

<script lang="ts">
import { apiService } from '../utils/APIService';
import Notification from '../components/Notification.vue';
import spinnerLoading from '../components/SpinnerLoading.vue';
import type { Series } from '../@types/interfaces';
import { endpoints } from '@/utils/endpoints';

export default {
	name: 'seriesDetailStats',
	props: {
		slug: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			series: {} as Series,
			editIcon: false,
			errors: '',
			isAuthenticatedVar: false
		};
	},
	components: {
		Notification,
		spinnerLoading
	},
	methods: {
		async getDataSeries() {
			return apiService(`${endpoints.series}${this.slug}/`).then((data: Series) => {
				this.series = data;
				return this.isAuthenticated();
			});
		},
		getVolumesReadx100(): string {
			return ((100 / this.series.n_volumes) * this.series.volumes_read).toFixed(2);
		},
		getVolumesBought100(): string {
			return ((100 / this.series.n_volumes) * this.series.volumes_bought).toFixed(2);
		},
		getMissedVolumesx100(): string {
			return ((100 / this.series.n_volumes) * this.getMissedVolumes()).toFixed(2);
		},
		getMissedVolumes(): number {
			return this.series.n_volumes - this.series.volumes_bought;
		},
		edit(disabled = false) {
			this.changeEditIcon();
			let statisticsElements = document.getElementsByClassName('statistics');
			let class_ = disabled ? 'list-group-item disabled statistics' : 'list-group-item statistics';
			for (let i = 0; i < statisticsElements.length; i++) {
				statisticsElements[i].className = class_;
			}
		},
		changeEditIcon() {
			this.editIcon = !this.editIcon;
		},
		cancelOperation() {
			this.resetErrors();
			this.edit(true);
			this.getDataSeries();
		},
		sendData() {
			if (this.checkData()) {
				apiService(`${endpoints.series}${this.slug}/`, 'PUT', this.series).then(() => {
					this.resetErrors();
					this.edit(true);
				});
			} else {
				this.resetErrors();
				this.showErrors();
			}
		},
		checkData(): boolean {
			if (
				this.series.n_volumes <= 0 ||
				this.series.volumes_bought < 0 ||
				typeof this.series.volumes_bought != 'number' ||
				this.series.volumes_read < 0 ||
				typeof this.series.volumes_read != 'number'
			) {
				return false;
			}
			if (
				this.series.n_volumes < this.series.volumes_bought ||
				this.series.volumes_bought < this.series.volumes_read
			) {
				return false;
			}
			return true;
		},
		showErrors() {
			if (this.series.n_volumes <= 0) {
				document.querySelector('#inputNVol')!.className = 'form-control is-invalid';
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
					"n volumes can't be negative"
				);
			}
			if (this.series.volumes_bought < 0) {
				document.querySelector('#inputBought')!.className = 'form-control is-invalid';
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
					"volumes bought can't be negative"
				);
			}
			if (this.series.volumes_read < 0) {
				document.querySelector('#inputRead')!.className = 'form-control is-invalid';
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
					"volumes read can't be negative"
				);
			}
			if (this.series.n_volumes < this.series.volumes_bought) {
				document.querySelector('#inputBought')!.className = 'form-control is-invalid';
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
					"the volumes bought can't be more than total volumes"
				);
			}
			if (this.series.volumes_bought < this.series.volumes_read) {
				document.querySelector('#inputRead')!.className = 'form-control is-invalid';
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
					"the volumes read can't be more than total bought"
				);
			}
			if (typeof this.series.volumes_bought != 'number') {
				document.querySelector('#inputBought')!.className = 'form-control is-invalid';
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
					"volumes bought can't be blank"
				);
			}
			if (typeof this.series.volumes_read != 'number') {
				document.querySelector('#inputRead')!.className = 'form-control is-invalid';
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
					"volumes read can't be blank"
				);
			}
		},
		resetErrors() {
			document.querySelector('#inputNVol')!.className = 'form-control';
			document.querySelector('#inputBought')!.className = 'form-control';
			document.querySelector('#inputRead')!.className = 'form-control';
		},
		async isAuthenticated() {
			return apiService(endpoints.isAuthenticated, 'GET').then((response: any) => {
				this.isAuthenticatedVar = response.result;
				(this.$refs.spinner as InstanceType<typeof spinnerLoading>).finishLoading();
			});
		}
	},
	async created() {
		await this.getDataSeries();
	}
};
</script>

<style>
.statistics {
	border: 0;
}

.statistics-x100 {
	border: 0;
}
</style>
