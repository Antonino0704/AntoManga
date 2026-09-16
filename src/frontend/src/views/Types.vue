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
					maxlength="20"
					v-model="type.name"
					:disabled="!user.is_authenticated"
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
import { apiExpress } from '@/utils/APIExpress';
import Notification from '../components/Notification.vue';
import TypesComponent from '../components/TypesComponent.vue';
import type { Type } from '../@types/interfaces';
import { endpoints } from '@/utils/endpoints';
import { useUserStore } from '@/stores/userStore';
import { mapState } from 'pinia';

export default {
	name: 'typeView',
	data() {
		return {
			types: [] as Array<Type>
		};
	},
	components: {
		Notification,
		TypesComponent
	},
	computed: {
		...mapState(useUserStore, ['user'])
	},
	methods: {
		async getTypesData() {
			try {
				this.types = await apiExpress.get<Array<Type>>(endpoints.types);
			} catch (err) {
				console.log(err);
			}
		},
		async editType(id: number) {
			if (this.checkData(id)) {
				const type = this.types.find((t) => t.id == id);
				if (type != undefined) {
					try {
						await apiExpress.put(`${endpoints.types}${id}/`, type);
					} catch (err) {
						console.log(err);
					}

					(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
						`type: ${type.name} updated`
					);
				}
			} else {
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
					'invalid names'
				);
			}
		},
		checkData(id: number): boolean {
			const type = this.types.find((t) => t.id == id);
			if (type != undefined) {
				document.querySelector(`#typeID${type.id}`)!.className = 'form-control';
				if (!type.name || type.name.length > 20) {
					document.querySelector(`#typeID${type.id}`)!.className = 'form-control is-invalid';
					return false;
				}
				return true;
			}
			return false;
		},
		async deleteType(id: number) {
			const tmp = this.types.filter((t) => t.id != id);
			try {
				await apiExpress.delete(`${endpoints.types}${id}/`);

				const name = this.types.find((t) => t.id == id)!.name;
				this.types = tmp;
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
					`type: ${name} was deleted`
				);
			} catch (err) {
				console.log(err);
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(`${err}`);
			}
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
