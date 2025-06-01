<template>
	<div class="previewComponent">
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
				<button
					type="button"
					data-bs-target="#carousel"
					data-bs-slide-to="1"
					aria-label="Slide 2"
				></button>
			</div>
			<div class="carousel-inner">
				<div class="carousel-item active">
					<div class="card" style="width: 18rem">
						<img :src="imagePreview" class="card-img-top" alt="preview1" height="410" />
					</div>
				</div>
				<div class="carousel-item">
					<div class="card" style="width: 18rem">
						<img
							:src="imagePreview"
							class="card-img-top rounded-pill image-series mt-2"
							alt="preview1"
							height="410"
						/>
					</div>
				</div>
			</div>
			<button
				class="carousel-control-prev"
				type="button"
				data-bs-target="#carousel"
				data-bs-slide="prev"
			>
				<span class="carousel-control-prev-icon" aria-hidden="true"></span>
				<span class="visually-hidden">Previous</span>
			</button>
			<button
				class="carousel-control-next"
				type="button"
				data-bs-target="#carousel"
				data-bs-slide="next"
			>
				<span class="carousel-control-next-icon" aria-hidden="true"></span>
				<span class="visually-hidden">Next</span>
			</button>
		</div>
	</div>
</template>

<script lang="ts">
export default {
	name: 'PreviewComponent',
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
