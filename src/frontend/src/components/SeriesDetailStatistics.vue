<template>
	<div class="series-detail-stats container-sm mt-3">
		<spinnerLoading ref="spinner" />
		<div class="list-inline-item" v-if="user.is_authenticated">
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

		<ul class="list-group mt-2 pb-3">
			<!--n volumes-->
			<li class="list-group-item disabled statistics" aria-disabled="true">
				<div class="input-group flex-nowrap">
					<span class="input-group-text">{{ $t('common.messages.nVolumes') }}</span>
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
					<span class="input-group-text">{{ $t('common.messages.volBought') }}</span>
					<input
						id="inputBought"
						type="number"
						class="form-control"
						aria-label="n_volumes"
						aria-describedby="addon-wrapping"
						v-model="series.volumes_bought"
					/>
					<span class="input-group-text"> {{ getVolumesBought100 }} %</span>
				</div>
			</li>

			<!--volumes_read-->
			<li class="list-group-item disabled statistics" aria-disabled="true">
				<div class="input-group flex-nowrap">
					<span class="input-group-text">{{ $t('common.messages.volRead') }}</span>
					<input
						id="inputRead"
						type="number"
						class="form-control"
						aria-describedby="addon-wrapping"
						v-model="series.volumes_read"
					/>
					<span class="input-group-text"> {{ getVolumesReadx100 }} %</span>
				</div>
			</li>

			<!--missed_volumes-->
			<li class="list-group-item disabled statistics-x100" aria-disabled="true">
				<div class="input-group flex-nowrap">
					<span class="input-group-text">{{ $t('seriesDetail.messages.missedVolumes') }}</span>
					<span class="form-control" aria-describedby="addon-wrapping">{{ getMissedVolumes }}</span>
					<span class="input-group-text"> {{ getMissedVolumesx100 }} %</span>
				</div>
			</li>
		</ul>

		<Notification ref="notification" />
	</div>
</template>

<script lang="ts">
import { apiExpress } from '@/utils/APIExpress';
import Notification from '../components/Notification.vue';
import spinnerLoading from '../components/SpinnerLoading.vue';
import type { Series } from '../@types/interfaces';
import { endpoints } from '@/utils/endpoints';
import { checkDataStats, showErrors, resetErrors } from '@/utils/StatsErrorsChecks';
import { useUserStore } from '@/stores/userStore';
import { mapState } from 'pinia';

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
			error: ''
		};
	},
	components: {
		Notification,
		spinnerLoading
	},
	computed: {
		getVolumesReadx100(): string {
			return ((100 / this.series.n_volumes) * this.series.volumes_read).toFixed(2);
		},
		getVolumesBought100(): string {
			return ((100 / this.series.n_volumes) * this.series.volumes_bought).toFixed(2);
		},
		getMissedVolumesx100(): string {
			return ((100 / this.series.n_volumes) * this.getMissedVolumes).toFixed(2);
		},
		getMissedVolumes(): number {
			return this.series.n_volumes - this.series.volumes_bought;
		},
		...mapState(useUserStore, ['user'])
	},
	methods: {
		async getDataSeries() {
			try {
				this.series = await apiExpress.get<Series>(`${endpoints.series}${this.slug}/`);
			} catch (err) {
				console.log(err);
			}
			(this.$refs.spinner as InstanceType<typeof spinnerLoading>).finishLoading();
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
			resetErrors();
			this.edit(true);
			this.getDataSeries();
		},
		async sendData() {
			if (checkDataStats(this.series)) {
				try {
					await apiExpress.put(`${endpoints.series}${this.slug}/`, this.series);
					resetErrors();
					this.edit(true);
					this.$emit('changeStatsEvent', this.series.volumes_read, this.series.volumes_bought);
				} catch (err) {
					console.log(err);
				}
			} else {
				resetErrors();
				this.error = showErrors(this.series, this.$t);
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(this.error);
			}
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
