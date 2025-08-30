<template>
	<div class="toggleTheme row justify-content-center">
		<div class="col-auto">
			<i id="toggleButton" @click="toggleClick()" class="bi bi-toggle-on"></i>
		</div>
		<Notification ref="notification" />
	</div>
</template>

<script lang="ts">
import Notification from '../components/Notification.vue';

export default {
	name: 'ToggleTheme',
	data() {
		return {
			theme: 'dark'
		};
	},
	components: {
		Notification
	},
	methods: {
		toggle(theme: string = 'dark') {
			if (theme != 'dark') {
				document.documentElement.setAttribute('data-bs-theme', 'light');
				document.querySelector('#toggleButton')!.className = 'bi bi-toggle-off';
				if (document.querySelector('#selectType'))
					document.querySelector('#selectType')!.className =
						'form-select-sm mb-2 ms-2 select-style badge text-bg-light';
				this.saveCoockie('light');
			} else {
				document.documentElement.setAttribute('data-bs-theme', 'dark');
				document.querySelector('#toggleButton')!.className = 'bi bi-toggle-on';
				if (document.querySelector('#selectType'))
					document.querySelector('#selectType')!.className =
						'form-select-sm mb-2 ms-2 select-style badge text-bg-dark';
				this.saveCoockie('dark');
			}
		},
		toggleClick() {
			if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
				this.toggle('light');
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
					'are you crazy?'
				);
			} else this.toggle();
		},
		saveCoockie(theme: string) {
			this.$cookies.set('theme-cookie', theme, 60 * 60 * 24 * 30);
		},
		loadCoockie() {
			setTimeout(() => {
				if (this.$cookies.isKey('theme-cookie')) this.toggle(this.$cookies.get('theme-cookie'));
			}, 500);
		}
	},
	created() {
		this.loadCoockie();
	}
};
</script>
