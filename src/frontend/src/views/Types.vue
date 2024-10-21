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

		<TypesComponent />
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
			@click="editType()"
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

		<!--bin icon from bootstrap-->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			fill="currentColor"
			class="bi bi-trash list-inline-item text-warning ms-1"
			viewBox="0 0 16 16"
			v-show="editIcon"
			@click="deleteType()"
		>
			<path
				d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
			/>
			<path
				d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
			/>
		</svg>

		<ul class="list-group mt-2">
			<li
				class="list-group-item disabled statistics"
				aria-disabled="true"
				v-for="type in types"
				:key="type.id"
			>
				<div class="input-group flex-nowrap">
					<span
						class="input-group-text iconType"
						:id="'iconTypeId' + type.id"
						@click="toggleOn(type.id)"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							class="bi bi-lock-fill text-danger"
							viewBox="0 0 16 16"
						>
							<path
								d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"
							/>
						</svg>
					</span>
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
			loading: false
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
				(<any>this.$refs.notification).sendNotification('types updated');
			} else {
				(<any>this.$refs.notification).sendNotification('invalid names');
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
			let iconType = document.querySelectorAll<HTMLSpanElement>('.iconType');
			for (let i = 0; i < iconType.length; i++) {
				iconType[i].innerHTML =
					`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-toggle2-off" viewBox="0 0 16 16">
                    <path d="M9 11c.628-.836 1-1.874 1-3a4.978 4.978 0 0 0-1-3h4a3 3 0 1 1 0 6z"/>
                    <path d="M5 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8m0 1A5 5 0 1 0 5 3a5 5 0 0 0 0 10"/>
                    </svg>`;
			}
		},
		toggleOn(id: number) {
			let iconType = document.querySelector<HTMLSpanElement>(`#iconTypeId${id}`);
			if ((<any>iconType!.childNodes)[0].className.baseVal === 'bi bi-toggle2-off') {
				iconType!.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-toggle-on text-success" viewBox="0 0 16 16">
                <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8"/>
                </svg>`;
			} else {
				iconType!.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-toggle2-off" viewBox="0 0 16 16">
                    <path d="M9 11c.628-.836 1-1.874 1-3a4.978 4.978 0 0 0-1-3h4a3 3 0 1 1 0 6z"/>
                    <path d="M5 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8m0 1A5 5 0 1 0 5 3a5 5 0 0 0 0 10"/>
                    </svg>`;
			}
		},
		deleteType() {
			let checks = false;
			let iconType = document.querySelectorAll<HTMLSpanElement>('.iconType');
			for (let i = 0; i < iconType.length; i++) {
				if (
					(<any>iconType[i]!.childNodes)[0].className.baseVal === 'bi bi-toggle-on text-success'
				) {
					const id = iconType[i].id.replace('iconTypeId', '');
					apiService(`${endpoints.types}${id}/`, 'DELETE').then(() => {
						checks = true;
						(<any>this.$refs.notification).sendNotification('type was deleted');
					});
				}
			}
			setTimeout(() => this.$router.go(0), 1000);
			if (!checks) {
				(<any>this.$refs.notification).sendNotification('nothing was selected');
			}
		},
		resetErrors() {
			this.loading = true;
			setTimeout(() => (this.loading = false), 1000);
		}
	},
	created() {
		this.getTypesData();
	}
};
</script>

<style>
.typeView {
	text-align: center;
}
</style>
