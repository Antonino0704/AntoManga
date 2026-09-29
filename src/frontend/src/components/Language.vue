<template>
	<div class="languageComponent">
		<select
			v-model="currentLanguage"
			@change="setLanguage()"
			class="form-select mb-3"
			aria-label="select_label"
		>
			<option v-for="language in availableLanguages" :key="language.code" :value="language.code">
				{{ language.name }}
			</option>
		</select>
		<Notification ref="notification" />
	</div>
</template>

<script lang="ts">
import Notification from '../components/Notification.vue';
import { i18n } from '@/i18n/i18n';
import { availableLanguages } from '@/i18n/availableLanguages';

export default {
	name: 'LanguageComponent',
	data() {
		return {
			availableLanguages: availableLanguages,
			currentLanguage: availableLanguages[0].code
		};
	},
	components: {
		Notification
	},
	methods: {
		getLanguage() {
			const savedLang = localStorage.getItem('lang-cookie');
			const lang = i18n.global.availableLocales.find((code) => code === savedLang);
			if (lang !== undefined) {
				i18n.global.locale.value = lang;
				this.currentLanguage = lang;
			}
		},
		setLanguage() {
			localStorage.setItem('lang-cookie', this.currentLanguage);
			i18n.global.locale.value = i18n.global.availableLocales.find(
				(code) => code === this.currentLanguage
			)!;
			if (this.currentLanguage != 'en') {
				(this.$refs.notification as InstanceType<typeof Notification>).sendNotification(
					this.$t('common.messages.changeLang')
				);
			}
		}
	},
	created() {
		this.getLanguage();
	}
};
</script>
