import * as Vue from 'vue';
import App from './App.vue';
import {i18nModule, loadLanguageSettings} from "./i18n";
import './styles.css'

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

    const getStartedElement = document.getElementById("get-started");
    document.getElementById("get-started-button").addEventListener("click", function () {
        getStartedElement.classList.remove('closed');
        getStartedElement.classList.add('opened');
    });
    document.getElementById("get-started-close-button").addEventListener("click", function () {
        getStartedElement.classList.remove('opened');
        getStartedElement.classList.add('closed');
    });

    const termsElement = document.getElementById("terms-of-use");
    document.getElementById("terms-button").addEventListener("click", function () {
        termsElement.classList.remove('closed');
        termsElement.classList.add('opened');
    });
    document.getElementById("terms-close-button").addEventListener("click", function () {
        termsElement.classList.remove('opened');
        termsElement.classList.add('closed');
    });
    
    const privacyElement = document.getElementById("privacy");
    document.getElementById("privacy-button").addEventListener("click", function () {
        privacyElement.classList.remove('closed');
        privacyElement.classList.add('opened');
    });
    document.getElementById("privacy-close-button").addEventListener("click", function () {
        privacyElement.classList.remove('opened');
        privacyElement.classList.add('closed');
    });
}

load().catch(error => console.error(error));