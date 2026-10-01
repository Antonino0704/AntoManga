import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import it from './locales/it.json';

type MessageSchema = typeof en

export const i18n = createI18n<[MessageSchema], 'en' | 'it', false>({
	legacy: false,
	locale: 'en',
	fallbackLocale: 'en',
	messages: {
		en,
		it
	}
});
