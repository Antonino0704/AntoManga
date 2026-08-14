<template>
	<div class="row justify-content-center">
		<nav class="navbar navbar-expand-lg bg-body-tertiary">
			<div class="container-fluid">
				<a class="navbar-brand ms-3 mb-2" href="/">
					<img :src="getLogo()" width="30" height="30" alt="logo" />
					AntoManga
				</a>
				<MobileSearchComponent
					class="d-block d-sm-block d-md-block d-lg-none"
					@mobileSearch="search"
				/>
				<button
					class="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarSupportedContent"
					aria-controls="navbarSupportedContent"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse" id="navbarSupportedContent">
					<ul class="navbar-nav me-auto mb-2 mb-lg-0">
						<li class="nav-item me-2 mb-2">
							<router-link :to="{ name: 'TypeView' }" type="button" class="badge text-bg-secondary">
								Types
							</router-link>
						</li>
						<li class="nav-item me-2 mb-2">
							<router-link
								:to="{ name: 'PublishersRank' }"
								type="button"
								class="badge text-bg-secondary"
							>
								Publishers Rank
							</router-link>
						</li>
						<li class="nav-item me-2 mb-2" v-if="user.is_authenticated">
							<router-link
								:to="{ name: 'AddPublisher' }"
								type="button"
								class="badge text-bg-secondary bi bi-plus-circle"
							>
								New Publisher
							</router-link>
						</li>
						<li class="nav-item me-2 mb-2" v-if="isTypesPubslihers">
							<router-link
								:to="{ name: 'AddSeries' }"
								type="button"
								class="badge text-bg-secondary bi bi-plus-circle"
							>
								New Series
							</router-link>
						</li>
					</ul>
					<li class="d-flex dropdown">
						<a
							class="dropdown-toggle btn btn-outline-secondary mb-2 mb-lg-0"
							type="button"
							data-bs-toggle="dropdown"
							data-bs-auto-close="outside"
							aria-expanded="false"
							><i class="bi bi-filter"></i>
						</a>
						<ul class="dropdown-menu">
							<li>
								<i
									class="dropdown-item bi bi-x-circle text-danger"
									v-if="showClearButton"
									@click="toggle(-1)"
								>
									Clear</i
								>
							</li>
							<hr class="dropdown-divider" v-if="showClearButton" />
							<li>
								<a
									class="dropdown-item border-bottom bi bi-arrow-return-right text-primary-emphasis"
									@click="showTypes = !showTypes"
									>TYPES</a
								>
							</li>
							<li v-for="(type, index) in types" :key="type.id" @click="toggle(index)">
								<a class="dropdown-item" v-show="showTypes"
									>{{ type.name }} <i class="bi bi-check-lg text-success" v-show="type.applied"></i
								></a>
							</li>

							<li>
								<hr class="dropdown-divider" v-show="showTypes" />
								<a
									class="dropdown-item border-bottom bi bi-arrow-return-right text-primary-emphasis"
									@click="showPublishers = !showPublishers"
									>PUBLISHERS</a
								>
							</li>
							<li
								v-for="(publisher, index) in publishersList"
								:key="publisher.id"
								@click="toggle(index, true)"
							>
								<a class="dropdown-item" v-show="showPublishers"
									>{{ publisher.name }}
									<i class="bi bi-check-lg text-success" v-show="publisher.applied"></i
								></a>
							</li>
							<hr class="dropdown-divider" v-show="showPublishers" />
							<li
								v-for="(type, index) in sortByList"
								:key="type.id"
								@click="toggle(index, false, true)"
							>
								<a :class="'dropdown-item ' + type.class"
									>{{ type.name }} <i class="bi bi-check-lg text-success" v-show="type.applied"></i
								></a>
							</li>
						</ul>
						<i
							class="bi bi-funnel-fill fs-5 ms-2 d-block d-sm-block d-md-block d-lg-none"
							@click="search()"
						></i>
						<div class="d-flex ps-2 pt-2 pe-3 pt-lg-0 d-none d-md-none d-lg-flex" role="search">
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
					</li>
				</div>
			</div>
		</nav>
	</div>
</template>

<script lang="ts">
import { apiService } from '../utils/APIService';
import type { Type, Typev2, Publisher, User } from '../@types/interfaces';
import { endpoints } from '@/utils/endpoints';
import MobileSearchComponent from './MobileSearch.vue';

export default {
	name: 'NavBar',
	data() {
		return {
			types: [
				{ id: -1, name: 'Incomplete', applied: false },
				{ id: -2, name: 'Ready To Read', applied: false },
				{ id: -3, name: 'Exclude Discontinued Series', applied: false },
				{ id: -4, name: 'Discontinued Series Only', applied: false }
			] as Array<Typev2>,
			sortByList: [
				{ id: 1, name: ' Most Recent', applied: false, class: 'bi bi-sort-down' },
				{ id: 2, name: ' Least Recent', applied: false, class: 'bi bi-sort-up' }
			],
			publishersList: [] as Array<Typev2>,
			publishers: 0,
			user: {} as User,
			showTypes: false,
			showPublishers: false,
			showClearButton: false,
			test: false
		};
	},
	components: {
		MobileSearchComponent
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
					if (this.$route.query.purchased_at != undefined) {
						if (this.$route.query.purchased_at == 'desc') {
							this.sortByList[0].applied = true;
							this.sortByList[1].applied = false;
						} else {
							this.sortByList[0].applied = false;
							this.sortByList[1].applied = true;
						}
					}
				});
		},
		getPublishersList() {
			apiService(endpoints.publishersShort)
				.then((data: Array<Type>) => {
					this.publishersList.push(
						...data.map((t) => ({
							...t,
							applied: false
						}))
					);
				})
				.then(() => {
					if (this.$route.query.publisher != undefined) {
						this.publishersList.forEach((publisher) => {
							publisher.applied = Array.isArray(this.$route.query.publisher)
								? this.$route.query.publisher!.includes(String(publisher.id))
								: [this.$route.query.publisher]!.includes(String(publisher.id));
						});
					}
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
				document.querySelector<HTMLInputElement>('#searchBar')!.value.toLowerCase(),
				this.publishersList.filter((publisher) => publisher.applied).map((p) => p.id),
				this.sortByList.filter((sbl) => sbl.applied).map((s) => s.id)
			);
		},
		toggle(index: number, is_publisher = false, is_sortByList = false) {
			if (is_publisher) {
				this.publishersList[index].applied = !this.publishersList[index].applied;
				this.hideClearButtonOnCreated();
				return;
			}

			if (is_sortByList) {
				if (index == 0) this.sortByList[1].applied = false;
				if (index == 1) this.sortByList[0].applied = false;
				this.sortByList[index].applied = !this.sortByList[index].applied;
				this.hideClearButtonOnCreated();
				return;
			}

			if (index == 3) this.types[4].applied = false;
			if (index == 4) this.types[3].applied = false;

			if (index == -1) {
				this.types.map((t) => (t.applied = false));
				this.publishersList.map((p) => (p.applied = false));
				this.sortByList.map((p) => (p.applied = false));
			} else this.types[index].applied = !this.types[index].applied;
			this.hideClearButtonOnCreated();
		},
		getLogo() {
			return `${document.location.origin}/media/icon.png`;
		},
		isAuthenticated() {
			apiService(endpoints.userMe, 'GET').then((response: User) => {
				this.user = response;
			});
		},
		showClearButtonOnCreated() {
			if (
				this.$route.query.publisher != undefined ||
				this.$route.query.type != undefined ||
				this.$route.query.purchased_at != undefined
			)
				this.showClearButton = true;
		},
		hideClearButtonOnCreated() {
			this.showClearButton = this.types
				.concat(this.publishersList, this.sortByList)
				.some((a) => a.applied);
		}
	},
	created() {
		this.getTypes();
		this.getPublishersList();
		this.getPublishersLength();
		this.showClearButtonOnCreated();
		this.isAuthenticated();
	}
};
</script>

<style>
/* .navabar {
	list-style-type: none;
} */

.select-style {
	font-family: 'Times New Roman', Times, serif;
}
</style>
