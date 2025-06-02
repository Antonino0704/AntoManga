<template>
	<div class="PublisherImagePreview">
		<div id="carousel" class="carousel slide" v-if="imagePreview">
			<div class="carousel-indicators">
				<button
					type="button"
					data-bs-target="#carousel"
					data-bs-slide-to="0"
					class="active"
					aria-current="true"
					aria-label="Slide 1"
				></button>
			</div>
			<div class="carousel-inner">
				<div class="carousel-item active">
					<div class="card" style="width: 18rem">
						<img :src="imagePreview" class="card-img-top" alt="preview1" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
export default {
	name: 'PublisherImagePreview',
	data() {
		return {
			imagePreview: ''
		};
	},
	methods: {
		setPreview(url: string) {
			this.imagePreview = url;
		},
		resetPreview() {
			this.imagePreview = '';
		}
	}
};
</script>
