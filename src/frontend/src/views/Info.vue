<template>
	<div class="InfoView row justify-content-center">
		<div class="col-auto">
			<div class="container text-center mt-3">
				<ul class="list-group">
					Devs:
					<li class="list-group-item mt-2">
						<i class="bi bi-code-square"></i>
						Antonino Buscarino

						<a class="bi bi-box-arrow-up-right" href="https://beacons.ai/_hikki_"></a>
					</li>
				</ul>
				<div class="container mt-4 mb-4 placeholder" id="version">
					<p class="mt-2">Backend Version: {{ version.backendVersion }}</p>
					<p class="mt-2">Frontend Version: {{ version.frontendVersion }}</p>
				</div>
				<p>The Website isn't AI-generated, only license</p>
				<div class="form-floating">
					<textarea
						readonly
						class="form-control placeholder desktop-textarea"
						style="height: 20rem"
						:value="license"
					></textarea>
					<label for="floatingTextarea2"
						>LICENSE (partially AI-generated) <i class="bi bi-stars"></i>
					</label>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { apiExpress } from '@/utils/APIExpress';
import { endpoints } from '@/utils/endpoints';

export default {
	name: 'InfoView',
	data() {
		return {
			version: {
				backendVersion: null,
				frontendVersion: null
			},
			license: ''
		};
	},
	methods: {
		async getBackendVersion() {
			try {
				this.version = await apiExpress.get(endpoints.version);
				document.querySelector('#version')!.classList.remove('placeholder');
			} catch (err) {
				console.log(err);
			}
		},
		async getLicense() {
			try {
				this.license = await apiExpress.get<string>(endpoints.license);
				document.querySelector('textarea')!.classList.remove('placeholder');
			} catch (err) {
				console.log(err);
			}
		}
	},
	created() {
		this.getBackendVersion();
		this.getLicense();
	}
};
</script>

<style scoped>
@media (min-width: 992px) {
	.desktop-textarea {
		width: 40rem;
	}
}

@media (max-width: 992px) {
	.desktop-textarea {
		width: 20rem;
	}
}
</style>
