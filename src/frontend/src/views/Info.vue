<template>
	<div class="InfoView row justify-content-center">
		<div class="col-auto">
			<div class="container text-center mt-3">
				<ul class="list-group">
					Devs:
					<li class="list-group-item mt-2">
						Antonino Buscarino
						<i class="bi bi-code-slash"></i>
						<a class="bi bi-link ms-1" href="https://beacons.ai/_hikki_"></a>
					</li>
				</ul>
				<div class="container border border-primary mt-4 mb-4 placeholder" id="version">
					<p class="mt-2">Backend Version: {{ version.backendVersion }}</p>
					<p class="mt-2">Frontend Version: {{ version.frontendVersion }}</p>
				</div>

				<ul class="list-group list-group-flush mt-2">
					Technologies Used:
					<li class="list-group-item">
						<img
							style="margin: 10px"
							src="https://img.shields.io/badge/-VueJS-45bb84?logo=vue.js&logoColor=white"
							alt="vuejs"
						/>
					</li>
					<li class="list-group-item">
						<img
							style="margin: 10px"
							src="https://img.shields.io/badge/-ViteJS-black?logo=vite"
							alt="vite"
						/>
					</li>
					<li class="list-group-item">
						<img
							style="margin: 10px"
							src="https://img.shields.io/badge/-Bootstrap-7A14F6?logo=Bootstrap&logoColor=white"
							alt="bootstrap"
						/>
					</li>
					<li class="list-group-item">
						<img
							style="margin: 10px"
							src="https://img.shields.io/badge/-Django-darkgreen?logo=django"
							alt="Django"
						/>
					</li>
					<li class="list-group-item">
						<img
							style="margin: 10px"
							src="https://img.shields.io/badge/-Django%20Rest%20Framework-red?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAmElEQVR4AWJwL/AhCS8GtFsHGADDMABFe4SepHLkniR36Um6gJoYEn8Iig+YZ1sbaa2/yz6fQcRSa7vUkigexeYH5JsHhaBYO5gA8LydJkC1OgV3pgh4wZXAFgAPOhLg+OseKjqhDmSowzDo0OH+6bKGxzjIh3c1EHzS+oeGXwsOCrj4VUcbGN4XrLJigCWq/poIFuGSw/sBXaqQ6KtKmjwAAAAASUVORK5CYII="
							alt="Django-rest-framework"
						/>
					</li>
				</ul>
				<div class="form-floating">
					<textarea
						readonly
						class="form-control placeholder"
						style="height: 20rem; width: 20rem"
						:value="license"
					></textarea>
					<label for="floatingTextarea2">LICENSE</label>
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
