<template>
	<div class="footer mt-2">
		<footer class="pt-4 text-center">
			{{ getFooter() }}
			<div class="contains-inline mt-3 container-sm d-none d-sm-block">
				Built with
				<ul class="list-group list-group-horizontal justify-content-center">
					<li class="list-group-item border-0" v-for="url in urls" :key="url[0]">
						<img class="rounded mx-auto d-block" :src="url" />
					</li>
				</ul>
			</div>
		</footer>
	</div>
</template>

<script lang="ts">
export default {
	name: 'FooterComponent',
	data() {
		return {
			urls: [
				'https://img.shields.io/badge/-VueJS-45bb84?logo=vue.js&logoColor=white',
				'https://img.shields.io/badge/-Bootstrap-7A14F6?logo=Bootstrap&logoColor=white',
				'https://img.shields.io/badge/-Django-darkgreen?logo=django',
				'https://img.shields.io/badge/-Django%20Rest%20Framework-red?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAmElEQVR4AWJwL/AhCS8GtFsHGADDMABFe4SepHLkniR36Um6gJoYEn8Iig+YZ1sbaa2/yz6fQcRSa7vUkigexeYH5JsHhaBYO5gA8LydJkC1OgV3pgh4wZXAFgAPOhLg+OseKjqhDmSowzDo0OH+6bKGxzjIh3c1EHzS+oeGXwsOCrj4VUcbGN4XrLJigCWq/poIFuGSw/sBXaqQ6KtKmjwAAAAASUVORK5CYII='
			]
		};
	},
	methods: {
		getFooter() {
			return `© 2023 - ${new Date().getFullYear()} Antonino Buscarino`;
		}
	}
};
</script>
