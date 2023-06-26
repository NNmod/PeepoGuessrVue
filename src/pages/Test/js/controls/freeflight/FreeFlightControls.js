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

import {MathUtils, Vector2} from "three";
import {Manager, Pan, DIRECTION_ALL} from "hammerjs";
import {KeyMoveControls} from "./keyboard/KeyMoveControls";
import {MouseRotateControls} from "./mouse/MouseRotateControls";
import {MouseAngleControls} from "./mouse/MouseAngleControls";
import {KeyHeightControls} from "./keyboard/KeyHeightControls";
import {TouchPanControls} from "./touch/TouchPanControls";
import {reactive} from "vue";

export class FreeFlightControls {

    /**
     * @param target {Element}
     */
    constructor(target) {
        this.target = target;
        this.manager = null;

        this.data = reactive({

        });

        this.hammer = new Manager(this.target);
        this.initializeHammer();

        this.deltaPosition = new Vector2();
        
        this.keyMove = new KeyMoveControls(this.target, 0.25, 0.1);
        this.keyHeight = new KeyHeightControls(this.target, 0.5, 0.2);
        this.mouseRotate = new MouseRotateControls(this.target, 1.5, -2, -1.5, 0.5);
        this.mouseAngle = new MouseAngleControls(this.target, 1.5, -2, -1.5, 0.5);
        this.touchPan = new TouchPanControls(this.target, this.hammer, 8, 0.15);

        this.started = false;
        this.isMoved = false;

        this.clickStart = new Vector2();
        this.moveSpeed = 0.5;

        this.animationTargetHeight = 0;
    }

    /**
     * @param manager {ControlsManager}
     */
    start(manager) {
        this.manager = manager;

        this.keyMove.start(manager);
        this.keyHeight.start(manager);
        this.mouseRotate.start(manager);
        this.mouseAngle.start(manager);
        this.touchPan.start(manager);

        this.target.addEventListener("contextmenu", this.onContextMenu);
        this.target.addEventListener("mousedown", this.onMouseDown);
    }

    stop() {
        this.keyMove.stop();
        this.keyHeight.stop();
        this.mouseRotate.stop();
        this.mouseAngle.stop();
        this.touchPan.stop();

        this.target.removeEventListener("contextmenu", this.onContextMenu);
        this.target.removeEventListener("mousedown", this.onMouseDown);
    }

    /**
     * @param delta {number}
     * @param map {Map}
     */
    update(delta) {
        this.keyMove.update(delta);
        this.keyHeight.update(delta);
        this.mouseRotate.update(delta, this);
        this.mouseAngle.update(delta, this);
        this.touchPan.update(delta, this);

        this.manager.angle = MathUtils.clamp(this.manager.angle, 0, Math.PI);
        this.manager.distance = 0;
        this.manager.ortho = 0;
    }

    initializeHammer() {
        let touchMove = new Pan({ event: 'move', pointers: 1, direction: DIRECTION_ALL, threshold: 0 });
        this.hammer.add(touchMove);
    }

    onContextMenu = evt => {
        evt.preventDefault();
    }

    onMouseDown = evt => {
        this.clickStart.set(evt.x, evt.y);
        this.isMoved = false;
    }

    /*onWheel = evt => {
        evt.preventDefault();

        let delta = evt.deltaY;
        if (evt.deltaMode === WheelEvent.DOM_DELTA_PIXEL) delta *= 0.01;
        if (evt.deltaMode === WheelEvent.DOM_DELTA_LINE) delta *= 0.33;

        this.moveSpeed *= Math.pow(1.5, -delta * 0.25);
        this.moveSpeed = MathUtils.clamp(this.moveSpeed, 0.05, 5);

        this.keyMove.speed = this.moveSpeed;
        this.keyHeight.speed = this.moveSpeed;
    }*/

}