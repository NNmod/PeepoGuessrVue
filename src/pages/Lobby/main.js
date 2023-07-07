import * as Vue from 'vue';
import App from './App.vue';
import {i18nModule, loadLanguageSettings} from "./i18n";
import './styles.css'
import {VueSignalR} from "@quangdao/vue-signalr";

// utils
String.prototype.includesCI = function (val) {
    return this.toLowerCase().includes(val.toLowerCase());
}

async function load() {
    const vue = Vue.createApp(App, {
        i18nModule,
        render: h => h(App)
    });

    const urlParams = new URLSearchParams(window.location.search);
    const lobbyType = urlParams.get('type');
    // load languages
    vue.use(VueSignalR, { url: 'https://ppg.nnmod.com/api/signalr/lobby/' + lobbyType, automaticReconnect: true });
    vue.use(i18nModule);
    await loadLanguageSettings();
    const app = vue.mount('#app');
    await app.$nextTick();
}

load().catch(error => console.error(error));