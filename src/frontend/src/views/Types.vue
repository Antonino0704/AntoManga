<template>
	<div v-if="loading">
		<div
			class="spinner-border position-absolute top-50 start-50"
			style="width: 3rem; height: 3rem"
			role="status"
		></div>
		<span>Loading.....</span>
	</div>
	<div v-else class="typeView container-sm">
		<h1>Types</h1>

		<TypesComponent v-if="isAuthenticatedVar" />
		<!--pen logo from bootstrap-->
		<i
			class="bi bi-pen list-inline-item fs-6"
			fill="currentColor"
			v-show="!editIcon"
			v-if="isAuthenticatedVar"
			@click="edit()"
		></i>

		<!--success logo from bootstrap-->
		<i
			fill="currentColor"
			class="bi bi-check-circle-fill ms-2 text-success fs-5"
			v-show="editIcon"
			v-if="isAuthenticatedVar"
			@click="editType()"
		>
		</i>

		<!--x logo from bootstrap-->
		<i
			fill="currentColor"
			class="bi bi-x-circle-fill text-danger ms-2 fs-5"
			v-show="editIcon"
			v-if="isAuthenticatedVar"
			@click="cancelOperation()"
		>
		</i>

		<!--bin icon from bootstrap-->
		<i
			fill="currentColor"
			class="bi bi-trash list-inline-item text-warning ms-1 fs-5"
			v-show="editIcon"
			v-if="isAuthenticatedVar"
			@click="deleteType()"
		>
		</i>

		<ul class="list-group mt-2">
			<li
				class="list-group-item disabled statistics"
				aria-disabled="true"
				v-for="type in types"
				:key="type.id"
			>
				<div class="input-group flex-nowrap">
					<i
						fill="currentColor"
						class="input-group-text iconType bi bi-lock-fill text-danger"
						:id="'iconTypeId' + type.id"
						@click="toggleOn(type.id)"
					>
					</i>
					<input
						:id="'typeID' + type.id"
						type="text"
						class="form-control"
						aria-describedby="addon-wrapping"
						v-model="type.name"
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
import TypesComponent from '../components/TypesComponent.vue';
import type { Type } from '../@types/interfaces';
import { endpoints } from '@/utils/endpoints';

export default {
	name: 'typeView',
	data() {
		return {
			types: [] as Array<Type>,
			editIcon: false,
			loading: false,
			isAuthenticatedVar: false
		};
	},
	components: {
		Notification,
		TypesComponent
	},
	methods: {
		getTypesData() {
			apiService(endpoints.types).then((data: Array<Type>) => {
				this.types = data;
			});
		},
		edit(disabled = false) {
			this.changeEditIcon();
			this.toggleOffList();
			let statisticsElements = document.querySelectorAll('.statistics');
			let class_ = disabled ? 'list-group-item disabled statistics' : 'list-group-item statistics';
			for (let i = 0; i < statisticsElements.length; i++) {
				statisticsElements[i].className = class_;
			}
		},
		changeEditIcon(): undefined {
			this.editIcon = !this.editIcon;
		},
		editType() {
			if (this.checkData()) {
				let iconType = document.querySelectorAll('.iconType');

				for (let i = 0; i < iconType.length; i++) {
					const id = iconType[i].id.replace('iconTypeId', '');
					apiService(`${endpoints.types}${id}/`, 'PUT', this.types[i]);
				}
				this.edit(true);
				this.resetErrors();
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
					'types updated'
				);
			} else {
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
					'invalid names'
				);
			}
		},
		checkData(): boolean {
			let feedback = true;
			this.types.forEach((type: Type) => {
				document.querySelector(`#typeID${type.id}`)!.className = 'form-control';
				if (!type.name || type.name.length > 20) {
					document.querySelector(`#typeID${type.id}`)!.className = 'form-control is-invalid';
					feedback = false;
				}
			});
			return feedback;
		},
		cancelOperation() {
			this.edit(true);
			this.getTypesData();
			this.resetErrors();
		},
		toggleOffList() {
			let iconType = document.querySelectorAll<HTMLElement>('.iconType');
			for (let i = 0; i < iconType.length; i++) {
				iconType[i]!.className = 'input-group-text iconType bi bi-toggle2-off';
			}
		},
		toggleOn(id: number) {
			let iconType = document.querySelector<HTMLElement>(`#iconTypeId${id}`);

			if (iconType!.className === 'input-group-text iconType bi bi-toggle2-off') {
				iconType!.className = 'input-group-text iconType bi bi-toggle-on text-success';
			} else {
				iconType!.className = 'input-group-text iconType bi bi-toggle2-off';
			}
		},
		deleteType() {
			let checks = false;
			let iconType = document.querySelectorAll<HTMLElement>('.iconType');
			for (let i = 0; i < iconType.length; i++) {
				if (iconType[i]!.className === 'input-group-text iconType bi bi-toggle-on text-success') {
					const id = iconType[i].id.replace('iconTypeId', '');
					apiService(`${endpoints.types}${id}/`, 'DELETE').then((reason) => {
						if (reason.protectedErrorDetail) {
							checks = true;
							(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
								reason.protectedErrorDetail
							);
						}
						if (!checks) {
							checks = true;
							(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
								'type was deleted'
							);
						}
					});
				}
			}
			setTimeout(() => this.$router.go(0), 1000);
			if (!checks) {
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
					'nothing was selected'
				);
			}
		},
		resetErrors() {
			this.loading = true;
			setTimeout(() => (this.loading = false), 1000);
		},
		isAuthenticated() {
			apiService(endpoints.isAuthenticated, 'GET').then((response: any) => {
				this.isAuthenticatedVar = response.result;
			});
		}
	},
	created() {
		this.getTypesData();
		this.isAuthenticated();
	}
};
</script>

<style>
.typeView {
	text-align: center;
}
</style>
