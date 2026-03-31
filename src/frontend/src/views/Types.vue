<template>
	<div class="typeView container-sm">
		<h1>Types</h1>

		<TypesComponent v-if="user.is_authenticated" @newTypeEvent="getTypesData()" />
		
		<ul class="list-group mt-2">
			<li
				class="list-group-item d-flex justify-content-between align-items-center"
				aria-disabled="true"
				v-for="type in types"
				:key="type.id"
			>
				<input
					:id="'typeID' + type.id"
					type="text"
					class="form-control border border-secondary-subtle border-opacity-10"
					aria-describedby="addon-wrapping"
					v-model="type.name"
				/>
				<i
					fill="currentColor"
					class="bi bi-check-circle-fill ms-2 text-success fs-5"
					v-if="user.is_authenticated"
					@click="editType(type.id)"
				>
				</i>
				<i
					fill="currentColor"
					class="bi bi-trash list-inline-item text-warning ms-2 fs-5"
					v-if="user.is_authenticated"
					@click="deleteType(type.id)"
				>
				</i>
			</li>
		</ul>

		<Notification ref="notification" />
	</div>
</template>

<script lang="ts">
import { apiService } from '../utils/APIService';
import Notification from '../components/Notification.vue';
import TypesComponent from '../components/TypesComponent.vue';
import type { Type, User } from '../@types/interfaces';
import { endpoints } from '@/utils/endpoints';

export default {
	name: 'typeView',
	data() {
		return {
			types: [] as Array<Type>,
			user: {} as User
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
		editType(id: number) {
			if (this.checkData(id)) {
				const type = this.types.find(t => t.id == id)
				if(type != undefined) {
				apiService(`${endpoints.types}${id}/`, 'PUT', type);
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
					`type: ${type.name} updated`
				); }
			} else {
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
					'invalid names'
				);
			}
		},
		checkData(id: number): boolean {
			const type = this.types.find(t => t.id == id)
			if(type != undefined) {
			document.querySelector(`#typeID${type.id}`)!.className = 'form-control';
			if (!type.name || type.name.length > 20) {
					document.querySelector(`#typeID${type.id}`)!.className = 'form-control is-invalid';
					return false;
				}
				return true
			}
			return false
		},
		deleteType(id: number) {
			const tmp = this.types.filter(t => t.id != id)
			apiService(`${endpoints.types}${id}/`, 'DELETE').then((reason) => {
						if (reason.protectedErrorDetail) {
							(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
								reason.protectedErrorDetail
							);
						}
						else  {
							const name = this.types.find(t => t.id == id)!.name
							this.types = tmp;
							(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
								`type: ${name} was deleted`
							);
						}
					});
		},
		isAuthenticated() {
			apiService(endpoints.userMe, 'GET').then((response: User) => {
				this.user = response;
			});
		},
		newTypeEventAction() {

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
