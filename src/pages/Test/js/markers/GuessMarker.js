import {Marker} from "../markers/Marker";
import {CSS2DObject} from "../util/CSS2DRenderer";
import {htmlToElement} from "../util/Utils";

export class GuessMarker extends Marker {

    constructor(id, appState, position, link) {
        super(id);

        this.data.type = "popup";
        this.data.label = "Last Map Interaction";
        this.data.listed = false;

        this.appState = appState;
        this.visible = true;

        this.elementObject = new CSS2DObject(htmlToElement(`<div class="group" style="transform: translateX(-50%) translateY(-50%);">
                    <div style="width: 48px; height: 56px">
                        <img src="`+link+`" style="position: absolute; top: 0; left: 0; height: 100%; object-fit: cover; object-position: center;
                                padding: 7%; clip-path: polygon(50% 10%, 93% 25%, 93% 60%, 77% 77%, 50% 93%, 23% 77%, 7% 60%, 7% 25%);">
                        <img src="https://ppg.cdn.nnmod.com/assets/borders/divisions/1.png" 
                            style="position: absolute; top: 0; left: 0; height: 100%; object-fit: cover; object-position: center;">
                    </div>
                </div>`));
        this.elementObject.position.set(position.x, 1, position.y);
        
        this.add(this.elementObject);
    }

    onClick() {
        return true;
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