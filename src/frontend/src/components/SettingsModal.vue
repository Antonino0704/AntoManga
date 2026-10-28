<template>
	<div class="settingsmodal">
		<div
			class="modal fade"
			id="settingsModal"
			tabindex="-1"
			aria-labelledby="settingsModalLabel"
			aria-hidden="true"
			data-bs-backdrop="static"
			data-bs-keyboard="false"
		>
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<h1 class="modal-title fs-5 text-secondary" id="settingsModalLabel">
							{{ $t('settingsModal.title') }}
						</h1>
						<button
							type="button"
							class="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
					</div>
					<div class="modal-body">
						<toggleTheme />
						<hr />
						<i id="gridButton" class="bi bi-card-image fs-5" @click="setGrid()"></i>
						<hr />
						<LanguageComponent />
						<hr />
						<a
							type="button"
							class="btn btn-success"
							v-if="!profile.user.is_authenticated"
							href="/account/login/"
							>LOGIN</a
						>
						<button
							id="ReadyToReadButton"
							class="btn btn-secondary"
							v-if="profile.user.is_authenticated"
							@click="setReadyToRead()"
						>
							{{ getReadyToReadButtonText }}
						</button>
						<hr v-if="profile.user.is_authenticated" />
						<a
							type="button"
							class="btn btn-secondary"
							v-if="profile.user.is_authenticated"
							href="/my-account/"
						>
							<i class="bi bi-person-fill-gear"></i> {{ $t('settingsModal.buttons.myAccount') }}</a
						>
						<hr v-if="profile.user.is_authenticated" />
						<a type="button" class="btn btn-secondary" v-if="profile.user.is_staff" href="/admin/"
							>Admin</a
						>
						<hr v-if="profile.user.is_staff" />
						<a
							type="button"
							class="btn btn-danger"
							v-if="profile.user.is_authenticated"
							@click="logout()"
							>LOGOUT</a
						>
					</div>
				</div>
			</div>
		</div>
		<i
			class="bi bi-gear-fill position-absolute top-0 end-0 pe-3 pt-2 mb-2"
			data-bs-toggle="modal"
			data-bs-target="#settingsModal"
			v-if="!profile.avatar"
		></i>
		<img
			:src="profile.avatar"
			data-bs-toggle="modal"
			data-bs-target="#settingsModal"
			class="rounded-circle avatar2 position-absolute top-0 end-0 me-3 mt-2"
			v-else
		/>
	</div>
</template>

<script lang="ts">
import toggleTheme from './ToggleTheme.vue';
import LanguageComponent from '../components/Language.vue';
import { useUserStore } from '@/stores/userStore';
import { mapState } from 'pinia';
import { apiExpress } from '@/utils/APIExpress.js';
import { endpoints } from '@/utils/endpoints.js';

export default {
	name: 'SettingsModal',
	data() {
		return {
			grid: true,
			readyToRead: false,
			ReadyToReadButtonText: 'showReadyToRead'
		};
	},
	components: {
		toggleTheme,
		LanguageComponent
	},
	computed: {
		...mapState(useUserStore, ['profile']),
		getReadyToReadButtonText() {
			return this.$t(`settingsModal.buttons.${this.ReadyToReadButtonText}`);
		}
	},
	methods: {
		gridClick() {
			if (localStorage.getItem('grid-cookie')) {
				this.grid = localStorage.getItem('grid-cookie') == 'true' ? false : true;
				document.querySelector('#gridButton')!.className = !this.grid
					? 'bi bi-grid fs-5'
					: 'bi bi-card-image fs-5';
			}
		},
		getReadyToRead() {
			if (localStorage.getItem('readytoread-cookie')) {
				this.readyToRead = localStorage.getItem('readytoread-cookie') == 'true' ? true : false;
				this.ReadyToReadButtonText = this.readyToRead ? 'hideReadyToRead' : 'showReadyToRead';
				document.querySelector('#ReadyToReadButton')!.className = this.readyToRead
					? 'btn btn-success'
					: 'btn btn-secondary';
			}
		},
		setGrid() {
			localStorage.setItem('grid-cookie', String(this.grid));
			if (this.$route.name === 'Home') {
				this.$router.go(0);
				history.replaceState(null, '', window.location.href);
			} else this.gridClick();
		},
		setReadyToRead() {
			localStorage.setItem('readytoread-cookie', String(!this.readyToRead));
			if (this.$route.name === 'Home') this.$router.go(0);
			else this.getReadyToRead();
		},
		async logout() {
			try {
				await apiExpress.post(endpoints.logout, null);
				window.location.replace('/');
			} catch (err) {
				console.log(err);
			}
		}
	},
	watch: {
		profile: {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			handler(newProfile, oldProfile) {
				if (newProfile.user.is_authenticated) {
					this.$nextTick(() => {
						this.getReadyToRead();
					});
				}
			},
			deep: true
		}
	},
	mounted() {
		this.gridClick();
	}
};
</script>

<style>
.settingsmodal {
	text-align: center;
}

.avatar2 {
	vertical-align: middle;
	width: 30px;
	height: 30px;
}
</style>
