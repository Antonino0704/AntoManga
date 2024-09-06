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

				<li v-if="isHome" class="nav-item dropdown btn btn-outline-secondary me-2 ms-1 mt-2 mb-2">
					<a
						class="nav-link dropdown-toggle"
						href="#"
						role="button"
						data-bs-toggle="dropdown"
						aria-expanded="false"
					>
						Menu
					</a>
					<ul class="dropdown-menu">
						<li>
							<router-link :to="{ name: 'TypeView' }" type="button" class="dropdown-item">
								Types
							</router-link>
						</li>
						<li><hr class="dropdown-divider" /></li>
						<li>
							<router-link
								:to="{ name: 'AddPublisher' }"
								type="button"
								class="dropdown-item bi bi-plus-circle"
							>
								New Publisher
							</router-link>
						</li>
						<li v-if="isTypesPubslihers">
							<router-link
								:to="{ name: 'AddSerie' }"
								type="button"
								class="dropdown-item bi bi-plus-circle"
							>
								New Series
							</router-link>
						</li>
					</ul>
				</li>
			</nav>
		</div>
	</div>
</template>

<script lang="ts">
import { apiService } from '../utils/APIService';
import { search } from '@/utils/search';
import type { Type, Publisher } from '../@types/interfaces';

export default {
	name: 'NavBar',
	data() {
		return {
			types: [{ id: 0, name: 'null' }] as Array<Type>,
			publishers: 0,
			statusFilter: 0
		};
	},
	computed: {
		isHome() {
			return this.$route.name === 'Home';
		},
		isTypesPubslihers() {
			return this.types.length > 1 && this.publishers > 0;
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
		getPublishersLength() {
			apiService('publishers/').then((data: Array<Publisher>) => {
				this.publishers = data.length;
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
		this.getPublishersLength();
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
