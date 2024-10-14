<template>
	<div class="types-component mb-3">
		<p>
			<button
				class="btn btn-outline-success mt-3"
				type="button"
				data-bs-toggle="collapse"
				data-bs-target="#collapse"
				aria-expanded="false"
				aria-controls="collapse"
			>
				Add a new Type
			</button>
		</p>
		<div style="min-height: 120px">
			<form @submit.prevent="post">
				<div class="collapse collapse-horizontal" id="collapse">
					<div class="mb-3">
						<label for="titleType" class="form-label">Insert a new Type</label>
						<input
							type="text"
							class="form-control"
							id="titleType"
							placeholder="Title"
							v-model="type.name"
						/>
					</div>

					<div class="col-auto">
						<button type="submit" class="btn btn-outline-success mb-3">ADD</button>
					</div>
				</div>
			</form>
		</div>

		<Notification ref="notification" />
	</div>
</template>

<script lang="ts">
import { apiService } from '../utils/APIService';
import Notification from '../components/Notification.vue';

export default {
	name: 'TypesComponent',
	data() {
		return {
			type: {
				name: ''
			}
		};
	},
	components: {
		Notification
	},
	methods: {
		post() {
			if (this.checkdata()) {
				apiService('v2/types/', 'POST', this.type).then(() => {
					(<any>this.$refs.notification).sendNotification('type created with success');
					setTimeout(() => this.$router.go(0), 1000);
				});
			}
		},
		checkdata() {
			if (!this.type.name || this.type.name.length > 20) {
				document.querySelector('#titleType')!.className = 'form-control is-invalid';
				(<any>this.$refs.notification).sendNotification('invalid title');
				return false;
			}
			return true;
		}
	}
};
</script>
