<template>
	<div class="navabar row justify-content-center">
		<div class="col-auto">
			<nav class="navbar navbar-expand-lg bg-body-tertiary">
				<a class="navbar-brand ms-3 mb-2" href="/">
					<img :src="getLogo()" width="30" height="30" alt="logo" />
				</a>
				<select
					v-if="isHome"
					id="selectType"
					name="selectType"
					class="form-select-sm mb-2 ms-2 select-style badge text-bg text-light"
					aria-label="NULL"
					@change="search()"
					v-model="statusFilter"
				>
					<option v-for="type in types" :key="type.id" :value="type.id">
						{{ type.name }}
					</option>
				</select>
				<div class="d-flex ps-2" role="search" v-if="isHome">
					<input
						id="searchBar"
						class="form-control me-2"
						type="search"
						placeholder="Search"
						aria-label="Search"
						@keydown.enter="search()"
					/>
					<button class="btn btn-outline-success" @click="search()">Search</button>
				</div>

				<router-link
					v-if="isHome"
					:to="{ name: 'TypeView' }"
					type="button"
					class="btn btn-outline-secondary me-2 ms-1 mt-2 mb-1"
					style="
						--bs-btn-padding-y: 0.25rem;
						--bs-btn-padding-x: 0.5rem;
						--bs-btn-font-size: 0.75rem;
					"
				>
					Types
				</router-link>
			</nav>
		</div>
	</div>
</template>

<script lang="ts">
import { apiService } from '../utils/APIService';
import { search } from '@/utils/search';
import type { Type } from '../@types/interfaces';

export default {
	name: 'NavBar',
	data() {
		return {
			types: [{ id: 0, name: 'null' }] as Array<Type>,
			statusFilter: 0
		};
	},
	computed: {
		isHome() {
			return this.$route.name === 'Home';
		}
	},
	methods: {
		getTypes() {
			apiService('types/').then((data: Array<Type>) => {
				for (let i = 0; i < data.length; i++) {
					this.types.push(data[i]);
				}
			});
		},
		search() {
			let nameLower = '';
			this.types.forEach((element: Type) => {
				if (this.statusFilter === element.id) {
					nameLower = element.name.toLowerCase();
				}
			});
			search(
				document.querySelector<HTMLInputElement>('#searchBar')!.value.toLowerCase(),
				nameLower
			);
		},
		getLogo() {
			return `${document.location.origin}/media/icon.png`;
		}
	},
	created() {
		this.getTypes();
	}
};
</script>

<style>
.navabar {
	list-style-type: none;
}

.select-style {
	font-family: 'Times New Roman', Times, serif;
}
</style>
