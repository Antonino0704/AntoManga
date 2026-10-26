<template>
	<div v-if="publisher.detail">
		<NotFound :message="$t('common.messages.publisherNotFound')" />
	</div>
	<div v-else class="publisher-detail container-sm">
		<spinnerLoading ref="spinner" />
		<div class="mt-3">
			<router-link
				:to="{ name: 'AddPublisher' }"
				class="btn btn-outline-info"
				v-if="user.is_authenticated"
				>{{ $t('common.titles.addPublisher') }}
			</router-link>
			<button
				@click="deletePublisher()"
				type="button"
				:class="`btn ${!seriesLength ? 'btn-outline-warning' : 'btn-outline-secondary'} ms-2`"
				:disabled="Boolean(seriesLength)"
				v-if="user.is_authenticated"
			>
				{{ $t('common.buttons.delete') }}
			</button>
		</div>
		<div class="accordion pt-4">
			<div class="accordion-item">
				<h2 class="accordion-header">
					<button
						class="accordion-button collapsed"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#collapseOne"
						aria-expanded="true"
						aria-controls="collapseOne"
					>
						<strong> {{ publisher.name }} </strong>
						<div class="ms-1">
							<router-link
								:to="{ name: 'PublisherEditor', params: { slug: publisher.slug } }"
								v-if="user.is_authenticated"
							>
								<!--pen logo from bootstrap-->
								<i class="bi bi-pen" fill="currentColor"></i>
							</router-link>
						</div>
					</button>
				</h2>
				<div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordion">
					<div class="accordion-body container-sm">
						<strong> {{ publisher.description }} </strong>
					</div>
				</div>
			</div>
			<div class="card mt-3" style="width: 18rem">
				<img :src="imagePublisher" class="card-img-top" alt="logoPublisher" />
			</div>
			<publisherStats :slug="slug" :seriesLength="seriesLength" v-if="publisher" />
			<h5 class="mt-3">
				{{ $t('common.messages.share') }}
				<a
					class="bi bi-share-fill ms-1 fs-6"
					onclick="
						navigator.clipboard.writeText(window.location.href);
						return false;
					"
					@click="copyAction()"
				></a>
				<p text-body-secondary class="mt-2"><i class="bi bi-book"></i> {{ seriesLength }}</p>
			</h5>
		</div>

		<ActionNotification
			class="position-absolute top-0 start-50 translate-middle-x"
			ref="actionNotification"
		/>
	</div>
</template>

<script lang="ts">
import { apiExpress } from '@/utils/APIExpress';
import ActionNotification from '../components/ActionNotification.vue';
import NotFound from '../views/NotFound.vue';
import spinnerLoading from '../components/SpinnerLoading.vue';
import publisherStats from '../components/PublisherStats.vue';
import type { Series, PublisherDetail, RequestObject } from '../@types/interfaces';
import { endpoints } from '@/utils/endpoints';
import { useUserStore } from '@/stores/userStore';
import { mapState } from 'pinia';

export default {
	name: 'PublisherDetail',
	props: {
		slug: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			publisher: {} as PublisherDetail,
			series: [] as Array<Series>,
			imagePublisher: '',
			seriesLength: 0,
			loading: true
		};
	},
	components: {
		ActionNotification,
		NotFound,
		spinnerLoading,
		publisherStats
	},
	computed: {
		...mapState(useUserStore, ['user'])
	},
	methods: {
		async getPublisherData() {
			try {
				this.publisher = await apiExpress.get<PublisherDetail>(
					`${endpoints.publishers}${this.slug}/`
				);
				this.imagePublisher = (
					await apiExpress.get<PublisherDetail>(`${endpoints.imgPublishers}${this.slug}/`)
				).image;
			} catch (err) {
				console.log(err);
				this.publisher.detail = `${err}`;
			}
		},
		async getseriesLength() {
			try {
				const response = await apiExpress.get<RequestObject>(
					`${endpoints.seriesList}${this.slug}/`
				);
				this.seriesLength = response.count;
			} catch (err) {
				console.log(err);
			} finally {
				(this.$refs.spinner as InstanceType<typeof spinnerLoading>).finishLoading();
			}
		},
		deletePublisher() {
			(this.$refs.actionNotification as InstanceType<typeof ActionNotification>).sendNotification(
				this.$t('common.messages.ConfirmDeleteMessage'),
				this.$t('common.messages.deleteMessageConfirmed', { objectToDelete: this.publisher.name }),
				`${endpoints.publishers}${this.slug}/`
			);
			window.scrollTo(0, 0);
		},

		copyAction() {
			const shareButton = document.querySelector('.bi-share-fill') as HTMLElement;
			shareButton.className = 'bi bi-check-square-fill text-success ms-1 fs-6';
			setTimeout(() => {
				shareButton.className = 'bi bi-share-fill ms-1 fs-6';
			}, 2000);
		}
	},
	async created() {
		this.getPublisherData();
		await this.getseriesLength();
	}
};
</script>

<style scoped>
.publisher-detail {
	text-align: justify;
}

.collapse,
.collapsing {
	overflow: auto;
	max-height: 50vh;
}

.image-series {
	width: 100px;
	height: 100px;
}

.series-group {
	text-align: center;
}
</style>
