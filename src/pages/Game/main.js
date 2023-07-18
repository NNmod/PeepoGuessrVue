/*
 * This file is part of BlueMap, licensed under the MIT License (MIT).
 *
 * Copyright (c) Blue (Lukas Rieger) <https://bluecolored.de>
 * Copyright (c) contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import * as Vue from 'vue';
import App from './App.vue';
import {i18nModule, loadLanguageSettings} from "./i18n";
import './styles.css'
import { VueSignalR } from '@quangdao/vue-signalr';

String.prototype.includesCI = function (val) {
    return this.toLowerCase().includes(val.toLowerCase());
}

async function load() {
    try {
        const vue = Vue.createApp(App, {
            i18nModule,
            render: h => h(App)
        });
        const urlParams = new URLSearchParams(window.location.search);
        const gameCode = urlParams.get('code');
        vue.use(VueSignalR, { url: window.location.origin + '/api/signalr/game/' + gameCode, automaticReconnect: true });
        vue.use(i18nModule);
        await loadLanguageSettings();
        const app = vue.mount('#app');
        await app.$nextTick();
    } catch (e) {
        console.error("Failed to load BlueMap webapp!", e);
        document.body.innerHTML = `
    <div id="bm-app-err">
      <div>
        <div class="bm-app-err-main">Failed to load BlueMap webapp!</div>
        <div class="bm-app-err-hint">Make sure you have <a href="https://get.webgl.org/">WebGL</a> enabled on your browser.</div>
      </div>
    </div>
  `;
    }
}

load().catch(error => console.error(error));
