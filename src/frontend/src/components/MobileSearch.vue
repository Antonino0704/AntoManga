<template>
	<div class="mobile-search-component">
		<i
			class="bi bi-search fs-2"
			type="button"
			data-bs-toggle="modal"
			data-bs-target="#SearchModal"
			data-bs-whatever="@mdo"
		>
		</i>

		<div
			class="modal fade"
			id="SearchModal"
			tabindex="-1"
			aria-labelledby="SearchModalLabel"
			aria-hidden="true"
		>
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-body">
						<div class="mb-3">
							<input
								class="form-control"
								type="search"
								id="searchText"
								placeholder="Search"
								@keydown.enter="search()"
							/>
						</div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
						<button type="button" class="btn btn-outline-success" @click="search">Search</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Modal } from 'bootstrap';

export default {
	name: 'MobileSearchComponent',
	data() {
		return {};
	},
	methods: {
		search() {
			document.querySelector<HTMLInputElement>('#searchBar')!.value =
				document.querySelector<HTMLInputElement>('#searchText')!.value;
			Modal.getInstance(document.getElementById('SearchModal')).hide();
			this.$emit('mobileSearch');
		}
	}
};
</script>
