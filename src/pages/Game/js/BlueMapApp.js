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
import "./BlueMap";
import {MapViewer} from "./MapViewer";
import {MapControls} from "./controls/map/MapControls";
import {FreeFlightControls} from "./controls/freeflight/FreeFlightControls";
import {MathUtils} from "three";
import {Map as BlueMapMap} from "./map/Map";
import {alert, animate, EasingFunctions} from "./util/Utils";
import {MarkerSet} from "./markers/MarkerSet";
import {reactive} from "vue";

export class BlueMapApp {

    /**
     * @param rootElement {Element}
     * @param isFreeFightModeEnable
     */
    constructor(rootElement, isFreeFightModeEnable = false) {
        this.events = rootElement;

        this.mapViewer = new MapViewer(rootElement, this.events);

        this.mapControls = new MapControls(this.mapViewer.renderer.domElement);
        this.freeFlightControls = new FreeFlightControls(this.mapViewer.renderer.domElement);

        /** @type BlueMapMap */
        this.map = null;

        this.dataUrl = "https://ppg.cdn.nnmod.com/maps/";

        //this.mainMenu = reactive(new MainMenu());

        this.appState = reactive({
            controls: {
                state: "perspective",
                mouseSensitivity: 1,
                invertMouse: false,
                enableFreeFlight: isFreeFightModeEnable,
                pauseTileLoading: false
            }
        });

        // popup on click
        
        this.popupMarkerSet = new MarkerSet();
        this.mapViewer.markers.add(this.popupMarkerSet);
        
        this.guessMarkerSet = new MarkerSet();
        this.mapViewer.markers.add(this.guessMarkerSet);

        this.updateLoop = null;

        this.hashUpdateTimeout = null;
        this.viewAnimation = null;
    }


    /**
     * @returns {Promise<void|never>}
     */
    async load() {
        if(this.updateLoop) clearTimeout(this.updateLoop);
        this.updateLoop = setTimeout(this.update, 1000);
    }

    /**
     * @param mapId {String}
     * @param resetCamera {boolean}
     * @returns {Promise<void>}
     */
    async switchMap(mapId, resetCamera = true) {
        let map = await this.loadMap(mapId);
        if (!map) return Promise.reject(`There is no map with the id "${mapId}" loaded!`);

        await this.mapViewer.switchMap(map)

        if (resetCamera) this.resetCamera();
    }

    resetCamera() {
        let map = this.mapViewer.map;
        let controls = this.mapViewer.controlsManager;

        if (map) {
            controls.position.set(map.data.startPos.x, 0, map.data.startPos.z);
            controls.distance = 1500;
            controls.angle = 0;
            controls.rotation = 0;
            controls.tilt = 0;
            controls.ortho = 0;
        }

        controls.controls = this.mapControls;
    }

    /**
     * @returns Promise<BlueMapMap>
     */
    async loadMap(mapId) {
        let map = new BlueMapMap(mapId, this.dataUrl + mapId + "/", this.loadBlocker, this.mapViewer.events);

        await map.loadSettings()
            .catch(error => {
                alert(this.events, `Failed to load settings for map '${map.data.id}':` + error, "warning");
            });

        return map;
    }

    setPerspectiveView(transition = 0, minDistance = 5) {
        if (!this.mapViewer.map) return;
        if (this.viewAnimation) this.viewAnimation.cancel();

        let cm = this.mapViewer.controlsManager;
        cm.controls = null;

        let startDistance = cm.distance;
        let targetDistance = Math.max(5, minDistance, startDistance);

        let startY = cm.position.y;
        let targetY = MathUtils.lerp(this.mapViewer.map.terrainHeightAt(cm.position.x, cm.position.z) + 3, 0, targetDistance / 500);

        let startAngle = cm.angle;
        let targetAngle = Math.min(Math.PI / 2, startAngle, this.mapControls.getMaxPerspectiveAngleForDistance(targetDistance));

        let startOrtho = cm.ortho;
        let startTilt = cm.tilt;

        this.viewAnimation = animate(p => {
            let ep = EasingFunctions.easeInOutQuad(p);
            cm.position.y = MathUtils.lerp(startY, targetY, ep);
            cm.distance = MathUtils.lerp(startDistance, targetDistance, ep);
            cm.angle = MathUtils.lerp(startAngle, targetAngle, ep);
            cm.ortho = MathUtils.lerp(startOrtho, 0, p);
            cm.tilt = MathUtils.lerp(startTilt, 0, ep);
        }, transition, finished => {
            this.mapControls.reset();
            if (finished){
                cm.controls = this.mapControls;
                //this.updatePageAddress();
            }
        });

        this.appState.controls.state = "perspective";
    }

    setFlatView(transition = 0, minDistance = 5) {
        if (!this.mapViewer.map) return;
        if (this.viewAnimation) this.viewAnimation.cancel();

        let cm = this.mapViewer.controlsManager;
        cm.controls = null;

        let startDistance = cm.distance;
        let targetDistance = Math.max(5, minDistance, startDistance);

        let startRotation = cm.rotation;
        let startAngle = cm.angle;
        let startOrtho = cm.ortho;
        let startTilt = cm.tilt;

        this.viewAnimation = animate(p => {
            let ep = EasingFunctions.easeInOutQuad(p);
            cm.distance = MathUtils.lerp(startDistance, targetDistance, ep);
            cm.rotation = MathUtils.lerp(startRotation, 0, ep);
            cm.angle = MathUtils.lerp(startAngle, 0, ep);
            cm.ortho = MathUtils.lerp(startOrtho, 1, p);
            cm.tilt = MathUtils.lerp(startTilt, 0, ep);
        }, transition, finished => {
            this.mapControls.reset();
            if (finished){
                cm.controls = this.mapControls;
                //this.updatePageAddress();
            }
        });

        this.appState.controls.state = "flat";
    }

    setFreeFlight(transition = 0, targetY = undefined) {
        if (!this.mapViewer.map) return;
        if (!this.appState.controls.enableFreeFlight) return this.setPerspectiveView(transition);
        if (this.viewAnimation) this.viewAnimation.cancel();

        let cm = this.mapViewer.controlsManager;
        cm.controls = null;

        let startDistance = cm.distance;

        let startY = cm.position.y;
        if (!targetY) targetY = this.mapViewer.map.terrainHeightAt(cm.position.x, cm.position.z) + 3 || startY;

        let startAngle = cm.angle;
        let targetAngle = Math.PI / 2;

        let startOrtho = cm.ortho;
        let startTilt = cm.tilt;

        this.viewAnimation = animate(p => {
            let ep = EasingFunctions.easeInOutQuad(p);
            cm.position.y = MathUtils.lerp(startY, targetY, ep);
            cm.distance = MathUtils.lerp(startDistance, 0, ep);
            cm.angle = MathUtils.lerp(startAngle, targetAngle, ep);
            cm.ortho = MathUtils.lerp(startOrtho, 0, Math.min(p * 2, 1));
            cm.tilt = MathUtils.lerp(startTilt, 0, ep);
        }, transition, finished => {
            if (finished){
                cm.controls = this.freeFlightControls;
                //this.updatePageAddress();
            }
        });

        this.appState.controls.state = "free";
    }

    async updateMap() {
        /*try {
            this.mapViewer.clearTileCache();
            if (this.mapViewer.map) {
                await this.switchMap(this.mapViewer.map.data.id);
            }
        } catch (e) {
            alert(this.events, e, "error");
        }*/
    }

    loadBlocker = async () => {
        if (!this.appState.controls.pauseTileLoading) return;

        let timeToWait;
        do {
            let timeSinceLastMove = Date.now();
            timeToWait = 250 - timeSinceLastMove;
            if (timeToWait > 0) await this.sleep(timeToWait);
        } while (timeToWait > 0);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}
