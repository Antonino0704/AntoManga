<template>
	<div class="my-class container-sm">
		<spinnerLoading ref="spinner" />
		<div class="card mb-3 mt-5">
			<div class="row g-0">
				<i class="bi bi-person-circle fs-1 card-img-top col-md-4 text-center">
					<p class="fs-6">Custom pfp <b class="text-danger-emphasis">coming soon</b>...</p>
				</i>
				<div class="card-body">
					<div class="card-title">
						<div class="w-auto d-inline-block">
							<h1 class="text-secondary fs-6">Username</h1>
							<div class="input-group mb-3">
								<span
									class="input-group-text bi bi-check-lg text-success"
									@click="changeUsername()"
								></span>
								<input
									type="text"
									class="form-control"
									placeholder="Username"
									aria-label="Username"
									aria-describedby="username-addon"
									v-model="user.username"
								/>
							</div>
						</div>
					</div>

					<div class="card-text">
						<a
							type="button"
							class="btn btn-secondary mb-3 me-md-2 mb-md-0"
							href="/account/two_factor/"
							>Two-factor authentication</a
						>

						<a type="button" class="btn btn-secondary me-2" href="/change-password/"
							>Change Password</a
						>
						<button type="button" class="btn btn-danger" @click="disableAccount()">
							Disable Account
						</button>
					</div>
				</div>
			</div>
		</div>

		<Notification ref="notification" />

		<ActionNotification
			class="position-absolute top-0 start-50 translate-middle-x"
			ref="actionNotification"
		/>
	</div>
</template>

<script lang="ts">
import { apiService } from '../utils/APIService';
import { endpoints } from '@/utils/endpoints';
import type { User } from '../@types/interfaces';
import spinnerLoading from '../components/SpinnerLoading.vue';
import Notification from '../components/Notification.vue';
import ActionNotification from '../components/ActionNotification.vue';

export default {
	name: 'MyAccount',
	data() {
		return {
			user: {} as User
		};
	},
	components: {
		spinnerLoading,
		Notification,
		ActionNotification
	},
	beforeRouteEnter(to, from, next) {
		apiService(endpoints.userMe, 'GET').then((response: User) => {
			if (response.is_authenticated) {
				next();
			} else {
				next('/not-found');
			}
		});
	},
	methods: {
		getUser() {
			apiService(endpoints.userMe, 'GET')
				.then((user: User) => {
					this.user = user;
				})
				.then(() => {
					(this.$refs.spinner as InstanceType<typeof spinnerLoading>).finishLoading();
				});
		},
		changeUsername() {
			(this.$refs.spinner as InstanceType<typeof spinnerLoading>).startLoading();
			apiService(endpoints.userMe, 'PUT', { username: this.user.username }).then(
				(response: any) => {
					if (response.updated) {
						(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
							'Username updated'
						);
						document.querySelector('input')!.classList.remove('is-invalid');
					} else {
						(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
							'Error'
						);
						document.querySelector('input')!.classList.add('is-invalid');
					}

					(this.$refs.spinner as InstanceType<typeof spinnerLoading>).finishLoading();
				}
			);
		},
		disableAccount() {
			(this.$refs.actionNotification as InstanceType<typeof ActionNotification>).sendNotification(
				'Are you sure?',
				'Account disabled',
				endpoints.userMe
			);
		}
	},
	created() {
		this.getUser();
	}
};
</script>
