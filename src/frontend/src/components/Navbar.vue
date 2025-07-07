<template>
	<div class="navabar row justify-content-center">
		<div v-if="user.is_authenticated" class="position-relative pb-5">
			<SettingsModal
				:user="user"
				class="bi bi-gear-fill position-absolute top-0 end-0 pe-3 pt-2 mb-2"
				data-bs-toggle="modal"
				data-bs-target="#settingsModal"
			/>
		</div>
		<div class="col-auto">
			<nav class="navbar navbar-expand-lg bg-body-tertiary">
				<a class="navbar-brand ms-3 mb-2" href="/">
					<img :src="getLogo()" width="30" height="30" alt="logo" />
				</a>

				<select
					id="selectType"
					name="selectType"
					class="form-select-sm mb-2 ms-2 select-style badge"
					aria-label="NULL"
					@change="search()"
					v-model="statusFilter"
				>
					<option v-for="type in types" :key="type.id" :value="type.id">
						{{ type.name }}
					</option>
				</select>
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
import type { Type, Publisher, User } from '../@types/interfaces';
import { endpoints } from '@/utils/endpoints';
import SettingsModal from './SettingsModal.vue';

export default {
	name: 'NavBar',
	data() {
		return {
			types: [
				{ id: 0, name: 'null' },
				{ id: -1, name: 'incomplete' }
			] as Array<Type>,
			publishers: 0,
			statusFilter: 0,
			user: {} as User
		};
	},
	components: {
		SettingsModal
	},
	computed: {
		isTypesPubslihers() {
			return this.types.length > 2 && this.publishers > 0 && this.user.is_authenticated;
		}
	},
	methods: {
		getTypes() {
			apiService(endpoints.types)
				.then((data: Array<Type>) => {
					for (let i = 0; i < data.length; i++) {
						this.types.push(data[i]);
					}
				})
				.then(() => {
					if (this.$route.query.type != undefined)
						this.statusFilter = Number(this.$route.query.type);
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
				this.statusFilter,
				document.querySelector<HTMLInputElement>('#searchBar')!.value.toLowerCase()
			);
		},
		getLogo() {
			return `${document.location.origin}/media/icon.png`;
		},
		isAuthenticated() {
			apiService(endpoints.userMe, 'GET').then((response: User) => {
				this.user = response;
			});
		},
		setSelectTheme() {
			if (this.$cookies.isKey('theme-cookie') && this.$cookies.get('theme-cookie') == 'light') {
				document.querySelector('#selectType')!.classList.add('text-bg-light');
			} else document.querySelector('#selectType')!.classList.add('text-bg-dark');
		}
	},
	mounted() {
		this.setSelectTheme();
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
