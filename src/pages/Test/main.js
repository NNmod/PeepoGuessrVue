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
import {BlueMapApp} from "./js/BlueMapApp";
import {i18nModule, loadLanguageSettings} from "./i18n";
import './styles.css'
import {GuessMarker} from "@/pages/Test/js/markers/GuessMarker";
import {Vector2} from "three";
import {PopupMarker} from "@/pages/Test/js/markers/PopupMarker";

// utils
String.prototype.includesCI = function (val) {
    return this.toLowerCase().includes(val.toLowerCase());
}

// bluemap app
async function load() {
    try {
        const freeMap = new BlueMapApp(document.getElementById("free-map-holder"), true);
        let flatMapElement = document.getElementById("flat-map-holder");
        const flatMap = new BlueMapApp(flatMapElement);
        window.freeMap = freeMap;
        window.flatMap = flatMap;

        // init vue
        const vue = Vue.createApp(App, {
            i18nModule,
            render: h => h(App)
        });
        vue.config.globalProperties.$freeMap = freeMap;
        vue.config.globalProperties.$flatMap = flatMap;

        // load languages
        vue.use(i18nModule);
        await loadLanguageSettings();

        // load bluemap next tick (to let the assets load first)
        const app = vue.mount('#app');
        await app.$nextTick();
        await flatMap.load();
        await flatMap.switchMap("ppl5n");
        flatMap.setFlatView(0);
        let guessMarker = new PopupMarker("bm-guess", flatMap.appState, flatMap.events,
            "https://static-cdn.jtvnw.net/jtv_user_pictures/a2634692-1aeb-4e11-b4b8-74a711196ebc-profile_image-300x300.png");
        flatMap.popupMarkerSet.add(guessMarker);
        let guessOriginMarker = new GuessMarker("bm-guess-origin", flatMap.appState, new Vector2(1000, -1000), 
            "https://static-cdn.jtvnw.net/jtv_user_pictures/a2634692-1aeb-4e11-b4b8-74a711196ebc-profile_image-300x300.png");
        flatMap.guessMarkerSet.add(guessOriginMarker);
        //guessMarker.visible = false;
        //flatMap.guessMarkerSet.clear();
        //flatMap.guessMarkerSet.remove(guessMarker);
        
        await freeMap.load();
        await freeMap.switchMap("ppl5n");
        freeMap.setFreeFlight(0, freeMap.mapViewer.controlsManager.position.y);

        let flatResizeElement = document.getElementById("flat-resize-holder");
        let flatElement = document.getElementById("flat-holder");
        let flatToggle = false;
        flatResizeElement.addEventListener("click", async function () {
            flatToggle = !flatToggle;
            if (flatToggle) {
                flatElement.classList.remove('flat-closed');
                flatElement.classList.add('flat-opened');
            }
            else {
                flatElement.classList.remove('flat-opened');
                flatElement.classList.add('flat-closed');
            }
        });

    } catch (e) {
        console.error("Failed to load BlueMap webapp!", e);
        document.body.innerHTML = `
    <div id="bm-app-err">
      <div>
        <!--<img src="assets/logo.png" alt="bluemap logo">-->
        <div class="bm-app-err-main">Failed to load BlueMap webapp!</div>
        <div class="bm-app-err-hint">Make sure you have <a href="https://get.webgl.org/">WebGL</a> enabled on your browser.</div>
      </div>
    </div>
  `;
    }
}

load().catch(error => console.error(error));
