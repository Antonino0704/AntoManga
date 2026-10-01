<template>
	<div class="types-component mb-3">
		<button
			class="btn btn-outline-success mt-3"
			type="button"
			data-bs-toggle="modal"
			data-bs-target="#typeModal"
			data-bs-whatever="@mdo"
		>
			{{ $t('typesComponent.buttons.newType') }}
		</button>

		<div
			class="modal fade"
			id="typeModal"
			tabindex="-1"
			aria-labelledby="typeModalLabel"
			aria-hidden="true"
		>
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h1 class="modal-title fs-5" id="typeModalLabel">
							{{ $t('typesComponent.titles.newType') }}
						</h1>
						<button
							type="button"
							class="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
					</div>
					<div class="modal-body">
						<form>
							<div class="mb-3">
								<textarea
									class="form-control"
									id="titleType"
									v-model="type.name"
									:placeholder="$t('common.titles.title')"
									maxlength="20"
								></textarea>
							</div>
						</form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
							{{ $t('common.buttons.close') }}
						</button>
						<button type="button" class="btn btn-outline-success" @click="post">
							{{ $t('common.buttons.add') }}
						</button>
					</div>
					<div class="alert alert-danger ms-2 me-2" role="alert" v-if="errors">
						{{ $t('common.errors.invalidTitle') }}
					</div>
				</div>
			</div>
		</div>
		<Notification ref="notification" />
	</div>
</template>

<script lang="ts">
import { apiExpress } from '@/utils/APIExpress';
import Notification from '../components/Notification.vue';
import { endpoints } from '@/utils/endpoints';
import { Modal } from 'bootstrap';

export default {
	name: 'TypesComponent',
	data() {
		return {
			type: {
				name: ''
			},
			errors: false
		};
	},
	components: {
		Notification
	},
	methods: {
		async post() {
			if (this.checkdata()) {
				try {
					await apiExpress.post(endpoints.types, this.type);
				} catch (err) {
					console.log(err);
				}

				this.$emit('newTypeEvent');
				Modal.getInstance(document.getElementById('typeModal')).hide();
				this.reset();
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
					this.$t('typesComponent.messages.typeCreated')
				);
			}
		},
		checkdata() {
			if (!this.type.name || this.type.name.length > 20) {
				document.querySelector('#titleType')!.className = 'form-control is-invalid';
				this.errors = true;
				return false;
			}
			return true;
		},
		reset() {
			this.type.name = '';
			document.querySelector('#titleType')!.classList.remove('is-invalid');
			this.errors = false;
		}
	}
};
</script>
