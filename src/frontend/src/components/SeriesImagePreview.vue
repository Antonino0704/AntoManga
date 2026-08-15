<template>
	<div class="SeriesImagePreview">
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
					<div class="carousel-caption d-none d-md-block">
						<h5>Preview</h5>
					</div>
				</div>
				<div class="carousel-item">
					<div class="card" style="border: none">
						<img :src="imagePreview" class="card-img-top card-fit-pw" alt="preview2" />

						<div>
							<span class="horizontal-line-bottom"></span>
							<span class="horizontal-line-top"></span>
							<span class="line vertical-line-left"></span>
							<span class="line vertical-line-right"></span>
						</div>
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
	name: 'SeriesImagePreview',
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

<style>
.horizontal-line-bottom {
	border-top: 2px dashed #000;
	width: 8.5rem;
	position: absolute;
	bottom: 0%;
	left: 15%;
}

.horizontal-line-top {
	border-bottom: 2px dashed #000;
	width: 8.5rem;
	position: absolute;
	bottom: 99.5%;
	left: 15%;
}

.vertical-line-left {
	border-left: 2px dashed #000;
	height: 12rem;
	left: 14%;
	top: 0%;
	position: absolute;
}

.vertical-line-right {
	border-right: 2px dashed #000;
	height: 12rem;
	right: 14%;
	top: 0%;
	position: absolute;
}

.card-fit-pw {
	width: 12rem;
	height: 12rem;
	object-fit: contain;
}
</style>
