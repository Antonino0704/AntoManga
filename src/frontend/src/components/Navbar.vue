<template>
	<div class="navabar row justify-content-center">
		<div class="col-auto">
			<nav class="navbar navbar-expand-lg bg-body-tertiary">
				<a class="navbar-brand ms-3 mb-2" href="/">
					<img :src="getLogo()" width="30" height="30" alt="logo" />
				</a>
				<div class="btn-group me-3 dropstart">
					<button
						class="btn btn-outline-secondary dropdown-toggle"
						type="button"
						data-bs-toggle="dropdown"
						data-bs-auto-close="outside"
						aria-expanded="false"
					>
						Filters
					</button>
					<ul class="dropdown-menu">
						<li v-for="(type, index) in types" :key="type.id" @click="toggle(index)">
							<a class="dropdown-item"
								>{{ type.name }} <i class="bi bi-check-lg text-success" v-show="type.applied"></i
							></a>
						</li>
					</ul>
				</div>

				<div class="d-flex ps-2" role="search">
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

				<li class="nav-item dropdown btn btn-outline-secondary me-2 ms-1 mt-2 mb-2">
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
						<li>
							<router-link :to="{ name: 'PublishersRank' }" type="button" class="dropdown-item">
								Publishers Rank
							</router-link>
						</li>
						<li v-if="user.is_authenticated"><hr class="dropdown-divider" /></li>
						<li v-if="user.is_authenticated">
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
								:to="{ name: 'AddSeries' }"
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
import type { Type, Typev2, Publisher, User } from '../@types/interfaces';
import { endpoints } from '@/utils/endpoints';

export default {
	name: 'NavBar',
	data() {
		return {
			types: [
				{ id: 0, name: 'Clear', applied: false },
				{ id: -1, name: 'Incomplete', applied: false },
				{ id: -2, name: 'Ready To Read', applied: false },
				{ id: -3, name: 'Exclude Discontinued Series', applied: false },
				{ id: -4, name: 'Discontinued Series Only', applied: false }
			] as Array<Typev2>,
			publishers: 0,
			user: {} as User
		};
	},
	computed: {
		isTypesPubslihers() {
			return this.types.length > 5 && this.publishers > 0 && this.user.is_authenticated;
		}
	},
	methods: {
		getTypes() {
			apiService(endpoints.types)
				.then((data: Array<Type>) => {
					this.types.push(
						...data.map((t) => ({
							...t,
							applied: false
						}))
					);
				})
				.then(() => {
					if (this.$route.query.type != undefined) {
						this.types.forEach((type) => {
							type.applied = Array.isArray(this.$route.query.type)
								? this.$route.query.type!.includes(String(type.id))
								: [this.$route.query.type]!.includes(String(type.id));
						});
					}
					if (this.$route.query.filterbyname != undefined)
						document.querySelector<HTMLInputElement>('#searchBar')!.value = String(
							this.$route.query.filterbyname
						);
				});
		},
		getPublishersLength() {
			apiService(endpoints.publishers).then((data: Array<Publisher>) => {
				this.publishers = data.length;
			});
		},
		search() {
			this.$emit(
				'filterEvent',
				this.types.filter((type) => type.applied).map((t) => t.id),
				document.querySelector<HTMLInputElement>('#searchBar')!.value.toLowerCase()
			);
		},
		toggle(index: number) {
			if (index == 3) this.types[4].applied = false;
			if (index == 4) this.types[3].applied = false;

			if (index == 0) this.types.map((t) => (t.applied = false));
			else this.types[index].applied = !this.types[index].applied;
		},
		getLogo() {
			return `${document.location.origin}/media/icon.png`;
		},
		isAuthenticated() {
			apiService(endpoints.userMe, 'GET').then((response: User) => {
				this.user = response;
			});
		}
	},
	created() {
		this.getTypes();
		this.getPublishersLength();
		this.isAuthenticated();
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
