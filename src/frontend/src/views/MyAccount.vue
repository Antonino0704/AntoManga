<template>
	<div class="my-class container-sm">
		<spinnerLoading ref="spinner" :startWithLoadingFalse="true" />
		<div class="card mb-3 mt-5">
			<div class="row g-0">
				<img
					:src="profile.avatar"
					class="rounded-circle avatar mx-auto mt-2"
					v-if="profile.avatar"
				/>
				<i
					class="bi bi-person-circle fs-1 card-img-top col-md-4 text-center"
					v-if="!profile.avatar"
				>
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
									maxlength="150"
									v-model="profile.user.username"
								/>
							</div>

							<h1 class="text-secondary fs-6">Change PFP</h1>
							<input
								type="file"
								accept="image/*"
								class="form-control mb-1"
								@change="updateImage($event)"
								id="file-input"
							/>
							<div class="input-group">
								<p @click="updateAvatar()" class="text-success mt-2" v-if="imageUploaded">
									change pfp
								</p>
								<p @click="updateAvatar(true)" class="text-danger mt-2 ms-2" v-if="prevAvatar">
									remove pfp
								</p>
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
import { apiExpress } from '@/utils/APIExpress';
import { endpoints } from '@/utils/endpoints';
import { validateImage } from '@/utils/supportedImageExtensions';
import spinnerLoading from '../components/SpinnerLoading.vue';
import Notification from '../components/Notification.vue';
import ActionNotification from '../components/ActionNotification.vue';
import imageCompression from 'browser-image-compression';
import { useUserStore } from '@/stores/userStore';
import { mapState } from 'pinia';

export default {
	name: 'MyAccount',
	data() {
		return {
			formData: new FormData(),
			imageUploaded: false,
			prevAvatar: useUserStore().profile.avatar,
			config: {
				maxSizeMB: 1,
				maxWidthOrHeight: 100,
				useWebWorker: true
			}
		};
	},
	components: {
		spinnerLoading,
		Notification,
		ActionNotification
	},
	computed: {
		...mapState(useUserStore, ['profile'])
	},
	methods: {
		async changeUsername() {
			(this.$refs.spinner as InstanceType<typeof spinnerLoading>).startLoading();

			try {
				if (this.profile.user.username === '') throw new Error('Please enter a valid username');
				await apiExpress.put(endpoints.userMe, {
					username: this.profile.user.username
				});

				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
					'Username updated'
				);
				document.querySelector('input')!.classList.remove('is-invalid');
			} catch (err) {
				console.log(err);
				if (`${err}` === 'Error: Request failed: 409 Conflict')
					(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
						'That username is already taken'
					);
				else
					(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(`${err}`);

				document.querySelector('input')!.classList.add('is-invalid');
			} finally {
				(this.$refs.spinner as InstanceType<typeof spinnerLoading>).finishLoading();
			}
		},
		async updateImage(event: Event) {
			(this.$refs.spinner as InstanceType<typeof spinnerLoading>).startLoading();
			try {
				if (await validateImage(event.target as InstanceType<typeof HTMLInputElement>)) {
					const resizedImageBlob = await imageCompression(
						(event.target as InstanceType<typeof HTMLInputElement>).files![0],
						this.config
					);
					const resizedImage = new File(
						[resizedImageBlob],
						(event.target as InstanceType<typeof HTMLInputElement>).files![0].name
					);
					this.formData.append('avatar', resizedImage);
					this.profile.avatar = URL.createObjectURL(resizedImage);
					this.imageUploaded = true;
				} else {
					(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
						this.$t('common.errors.unsupportedImage')
					);
					document.querySelector<HTMLInputElement>('#file-input')!.value = '';
					this.profile.avatar = this.prevAvatar;
					this.imageUploaded = false;
				}
			} catch (err) {
				console.log(err);
			}
			(this.$refs.spinner as InstanceType<typeof spinnerLoading>).finishLoading();
		},
		async updateAvatar(reset = false) {
			(this.$refs.spinner as InstanceType<typeof spinnerLoading>).startLoading();
			if (reset) this.formData.set('avatar', '');

			try {
				await apiExpress.putImage(endpoints.myAvatar, this.formData);
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
					'pfp updated'
				);
				this.$router.go(0);
			} catch (err) {
				console.log(err);
			}
		},
		disableAccount() {
			(this.$refs.actionNotification as InstanceType<typeof ActionNotification>).sendNotification(
				'Are you sure?',
				'Account disabled',
				endpoints.userMe
			);
		}
	}
};
</script>

<style>
.avatar {
	vertical-align: middle;
	width: 50px;
	height: 50px;
}
</style>
