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
				document.querySelector('#toggleButton')!.className = 'bi bi-toggle-off';
				if (document.querySelector('#selectType'))
					document.querySelector('#selectType')!.className =
						'form-select-sm mb-2 ms-2 select-style badge text-bg-light';
			} else {
				document.querySelector('#toggleButton')!.className = 'bi bi-toggle-on';
				if (document.querySelector('#selectType'))
					document.querySelector('#selectType')!.className =
						'form-select-sm mb-2 ms-2 select-style badge text-bg-dark';
			}
		},
		toggleClick() {
			if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
				document.documentElement.setAttribute('data-bs-theme', 'light');
				this.toggle('light');
				this.saveCoockie('light');
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
					'are you crazy?'
				);
			} else {
				document.documentElement.setAttribute('data-bs-theme', 'dark');
				this.toggle();
				this.saveCoockie('dark');
			}
		},
		saveCoockie(theme: string) {
			localStorage.setItem('theme-cookie', theme);
		},
		loadCoockie() {
			let theme = localStorage.getItem('theme-cookie');
			if (theme == null) {
				theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
			}
			setTimeout(() => {
				this.toggle(theme);
			}, 500);
		}
	},
	created() {
		this.loadCoockie();
	}
};
</script>
