import {createI18n} from 'vue-i18n';
import {nextTick} from "vue";
import parseHocon from "hocon-parser";

export const i18nModule = createI18n({
	locale: 'none',
	fallbackLocale: 'en',
	silentFallbackWarn: true,
	warnHtmlMessage: false,
	legacy: false,
	messages: {}
});

export const i18n = i18nModule.global;

export async function setLanguage(lang) {
	try {
		if (!i18n.availableLocales.includes(lang)){
			let messages = await fetchHocon(`./lang/${lang}.conf`);
			i18n.setLocaleMessage(lang, messages);
		}

		i18n.locale.value = lang;
		localStorage.setItem('lang', lang);
	} catch (e) {
		console.error(`Failed to load language '${lang}'!`, e);
	}

	return nextTick();
}

export async function loadLanguageSettings() {
	let settings = await fetchHocon(`./lang/settings.conf`);
	i18n.languages = settings.languages;
	await setLanguage(localStorage.getItem('lang') || settings.default);
}

export const fetchHocon = async (url) => {
	return fetch(url)
		.then((res) => res.text())
		.then((value) => parseHocon(value));
}
