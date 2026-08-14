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
						<h1 class="modal-title fs-5 text-secondary" id="settingsModalLabel">SETTINGS</h1>
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
						<a
							type="button"
							class="btn btn-success"
							v-if="!user.is_authenticated"
							href="/account/login/"
							>LOGIN</a
						>
						<button
							id="ReadyToReadButton"
							class="btn btn-secondary"
							v-if="user.is_authenticated"
							@click="setReadyToRead()"
						>
							{{ ReadyToReadButtonText }}
						</button>
						<hr v-if="user.is_authenticated" />
						<a
							type="button"
							class="btn btn-secondary"
							v-if="user.is_authenticated"
							href="/account/two_factor/"
							>Two-factor authentication</a
						>
						<hr v-if="user.is_authenticated" />
						<a
							type="button"
							class="btn btn-secondary"
							v-if="user.is_authenticated"
							href="/change-password/"
							>Change Password</a
						>
						<hr v-if="user.is_authenticated" />
						<a type="button" class="btn btn-secondary" v-if="user.is_staff" href="/admin/">Admin</a>
						<hr v-if="user.is_staff" />
						<a
							type="button"
							class="btn btn-danger"
							v-if="user.is_authenticated"
							href="/accounts/logout/"
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
		></i>
	</div>
</template>

<script lang="ts">
import toggleTheme from './ToggleTheme.vue';
export default {
	name: 'SettingsModal',
	data() {
		return {
			grid: true,
			readyToRead: false,
			ReadyToReadButtonText: 'Show Ready to Read'
		};
	},
	props: {
		user: {
			type: Object,
			required: true
		}
	},
	components: {
		toggleTheme
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
				this.ReadyToReadButtonText = this.readyToRead ? 'Hide Ready to Read' : 'Show Ready to Read';
				document.querySelector('#ReadyToReadButton')!.className = this.readyToRead
					? 'btn btn-success'
					: 'btn btn-secondary';
			}
		},
		setGrid() {
			localStorage.setItem('grid-cookie', String(this.grid));
			if (this.$route.name === 'Home') this.$router.go(0);
			else this.gridClick();
		},
		setReadyToRead() {
			localStorage.setItem('readytoread-cookie', String(!this.readyToRead));
			if (this.$route.name === 'Home') this.$router.go(0);
			else this.getReadyToRead();
		}
	},
	mounted() {
		this.gridClick();
		this.getReadyToRead();
	}
};
</script>

<style>
.settingsmodal {
	text-align: center;
}
</style>
