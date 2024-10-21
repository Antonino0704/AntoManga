<template>
	<div class="series-detail-stats container-sm mt-3">
		<div class="list-inline-item">
			<!--pen logo from bootstrap-->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				class="bi bi-pen list-inline-item"
				viewBox="0 0 16 16"
				v-show="!editIcon"
				@click="edit()"
			>
				<path
					d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"
				/>
			</svg>

			<!--success logo from bootstrap-->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="30"
				height="20"
				fill="currentColor"
				class="bi bi-check-circle-fill ms-5 text-success"
				viewBox="0 0 16 16"
				v-show="editIcon"
				@click="sendData()"
			>
				<path
					d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
				/>
			</svg>

			<!--x logo from bootstrap-->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="30"
				height="20"
				fill="currentColor"
				class="bi bi-x-circle-fill text-danger"
				viewBox="0 0 16 16"
				v-show="editIcon"
				@click="cancelOperation()"
			>
				<path
					d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"
				/>
			</svg>
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
			errors: ''
		};
	},
	components: {
		Notification
	},
	methods: {
		getDataSeries() {
			apiService(`${endpoints.series}${this.slug}/`).then((data: Series) => {
				this.series = data;
			});
		},
		getVolumesReadx100(): number {
			return (100 / this.series.n_volumes) * this.series.volumes_read;
		},
		getVolumesBought100(): number {
			return (100 / this.series.n_volumes) * this.series.volumes_bought;
		},
		getMissedVolumesx100(): number {
			return (100 / this.series.n_volumes) * this.getMissedVolumes();
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
				(<any>this.$refs.notification).sendNotification("n volumes can't be negative");
			}
			if (this.series.volumes_bought < 0) {
				document.querySelector('#inputBought')!.className = 'form-control is-invalid';
				(<any>this.$refs.notification).sendNotification("volumes bought can't be negative");
			}
			if (this.series.volumes_read < 0) {
				document.querySelector('#inputRead')!.className = 'form-control is-invalid';
				(<any>this.$refs.notification).sendNotification("volumes read can't be negative");
			}
			if (this.series.n_volumes < this.series.volumes_bought) {
				document.querySelector('#inputBought')!.className = 'form-control is-invalid';
				(<any>this.$refs.notification).sendNotification(
					"the volumes bought can't be more than total volumes"
				);
			}
			if (this.series.volumes_bought < this.series.volumes_read) {
				document.querySelector('#inputRead')!.className = 'form-control is-invalid';
				(<any>this.$refs.notification).sendNotification(
					"the volumes read can't be more than total bought"
				);
			}
			if (typeof this.series.volumes_bought != 'number') {
				document.querySelector('#inputBought')!.className = 'form-control is-invalid';
				(<any>this.$refs.notification).sendNotification("volumes bought can't be blank");
			}
			if (typeof this.series.volumes_read != 'number') {
				document.querySelector('#inputRead')!.className = 'form-control is-invalid';
				(<any>this.$refs.notification).sendNotification("volumes read can't be blank");
			}
		},
		resetErrors() {
			document.querySelector('#inputNVol')!.className = 'form-control';
			document.querySelector('#inputBought')!.className = 'form-control';
			document.querySelector('#inputRead')!.className = 'form-control';
		}
	},
	created() {
		this.getDataSeries();
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
