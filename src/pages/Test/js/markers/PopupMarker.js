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
import {Marker} from "../markers/Marker";
import {CSS2DObject} from "../util/CSS2DRenderer";
import {htmlToElement} from "../util/Utils";

export class PopupMarker extends Marker {

    constructor(id, appState, events, link) {
        super(id);

        this.data.type = "popup";
        this.data.label = "Last Map Interaction";
        this.data.listed = false;

        this.appState = appState;
        this.events = events;
        this.visible = false;

        this.elementObject = new CSS2DObject(htmlToElement(`<div class="group" style="transform: translateX(-50%) translateY(-50%);">
                    <div style="width: 48px; height: 56px">
                        <img src="`+link+`" style="position: absolute; top: 0; left: 0; height: 100%; object-fit: cover; object-position: center;
                                padding: 7%; clip-path: polygon(50% 10%, 93% 25%, 93% 60%, 77% 77%, 50% 93%, 23% 77%, 7% 60%, 7% 25%);">
                        <img src="https://ppg.cdn.nnmod.com/assets/borders/divisions/1.png" 
                            style="position: absolute; top: 0; left: 0; height: 100%; object-fit: cover; object-position: center;">
                    </div>
                </div>`));
        this.elementObject.position.set(0.5, 1, 0.5);

        this.add(this.elementObject);

        this.events.addEventListener('bluemapMapInteraction', this.onMapInteraction);
    }

    onClick() {
        return true;
    }

    onMapInteraction = evt => {
        let int = evt.detail.hiresHit;

        if (evt.detail.lowresHits) {
            for (let i = 0; i < evt.detail.lowresHits.length; i++) {
                if (!int) {
                    int = evt.detail.lowresHits[i];
                } else break;
            }
        }

        if (!int) return;

        this.position
            .copy(int.pointOnLine || int.point)
            .add(evt.detail.ray.direction.clone().multiplyScalar(0.05))
            .floor();

        this.open();
    };

    open() {

        this.visible = true;

        this.element.style.opacity = "1";
    }

    /**
     * @returns {Element}
     */
    get element() {
        return this.elementObject.element.getElementsByTagName("div")[0];
    }

    dispose() {
        super.dispose();

        if (this.element.parentNode) this.element.parentNode.removeChild(this.element);
    }

}