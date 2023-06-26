import * as Vue from 'vue';
import App from './App.vue';
import {i18nModule, loadLanguageSettings} from "./i18n";

// utils
String.prototype.includesCI = function (val) {
    return this.toLowerCase().includes(val.toLowerCase());
}

async function load() {
    const vue = Vue.createApp(App, {
        i18nModule,
        render: h => h(App)
    });

    vue.use(i18nModule);
    await loadLanguageSettings();
    const app = vue.mount('#app');
    await app.$nextTick();

    window.opener.postMessage('child-closed', '*');
}

load().catch(error => console.error(error));