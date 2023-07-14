<template>
    <div id="free-map-holder" class="w-full h-full absolute"></div>
    <div id="controls-move-holder">
        <div id="control-move-forward"></div>
        <div id="control-move-backward"></div>
    </div>
    <div id="controls-height-holder">
        <div id="control-height-higher"></div>
        <div id="control-height-lower"></div>
    </div>
    <div id="flat-holder" v-bind:class="this.guessPanelSwitch ? 'flat-opened' : 'flat-closed'">
        <div id="shadow-holder">
            <div id="radial-holder-down">
                <div id="flat-components-holder">
                    <div id="flat-resize-holder" @click="guessPanelToggle">TELEPORT</div>
                    <div id="flat-map-holder"></div>
                    <button id="guess-button" @click="teleport">
                        <div>{{ $t('game.teleport') }}</div>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div id="low-holder">
        <div id="second-menu-holder">
            <button class="button" @click="toSpawn">{{ $t('game.returnToSpawn') }}</button>
        </div>
    </div>
    <div id="map-container"></div>
    <div id="app"></div>
</template>

<script>
/* eslint-disable */
import {BlueMapApp} from "@/pages/Map/js/BlueMapApp";
import {PopupMarker} from "@/pages/Map/js/markers/PopupMarker";
import {Vector2} from "three";

export default {
    name: 'App',
    components: {
    },
    computed: {
        showMapMenu() {
            return this.mapViewer.mapState === "loading" || this.mapViewer.mapState === "loaded";
        }
    },
    data() {
        return {
            map: '',
            spawnX: 0,
            spawnZ: 0,
            playMap: null,
            guessMap: null,
            guessMarker: null,
            guessPanelSwitch: false,
            isMapLoaded: false
        }
    },
    methods: {
        guessPanelToggle() {
            if (!this.isMapLoaded) return;
            
            this.guessPanelSwitch = !this.guessPanelSwitch;
            if (this.guessPanelSwitch) {
                this.guessMarker.set(new Vector2(this.playMap.mapViewer.controlsManager.position.x, 
                    this.playMap.mapViewer.controlsManager.position.z))
            }
        },
        async teleport() {
            const pos = new Vector2(this.guessMarker.guessPosition.x, this.guessMarker.guessPosition.y);
            
            if (pos.x > this.playMap.mapViewer.map.data.maxPos.x)
                pos.x = this.playMap.mapViewer.map.data.maxPos.x;
            if (pos.x < this.playMap.mapViewer.map.data.minPos.x)
                pos.x = this.playMap.mapViewer.map.data.minPos.x;

            if (pos.y > this.playMap.mapViewer.map.data.maxPos.z)
                pos.y = this.playMap.mapViewer.map.data.maxPos.z;
            if (pos.y < this.playMap.mapViewer.map.data.minPos.z)
                pos.y = this.playMap.mapViewer.map.data.minPos.z;
            
            await this.playMap.mapViewer.controlsManager.position.set(pos.x, this.playMap.mapViewer.controlsManager.position.y, pos.y);
            await this.guessMap.mapViewer.controlsManager.position.set(pos.x, this.guessMap.mapViewer.controlsManager.position.y, pos.y);
        },
        async toSpawn() {
            await this.playMap.mapViewer.controlsManager.position.set(this.spawnX, 75, this.spawnZ);
        }
    },
    async mounted() {
        const playMap = new BlueMapApp(document.getElementById("free-map-holder"), true);
        this.playMap = playMap;
        await playMap.load();
        const guessMap = new BlueMapApp(document.getElementById("flat-map-holder"));
        this.guessMap = guessMap;
        await guessMap.load();

        const urlParams = new URLSearchParams(window.location.search);
        this.map = urlParams.get('map');
        this.spawnX = Number(urlParams.get('sX')) || 0;
        this.spawnZ = Number(urlParams.get('sZ')) || 0;

        const guessMarker = new PopupMarker("bm-guess", this.guessMap.appState, this.guessMap.events);
        this.guessMarker = guessMarker;
        this.guessMap.popupMarkerSet.add(guessMarker);
        
        await this.playMap.switchMap(this.map);
        await this.playMap.setFreeFlight(0);
        await this.playMap.mapViewer.controlsManager.position.set(this.spawnX, 75, this.spawnZ);
        await this.guessMap.switchMap(this.map);
        await this.guessMap.setFlatView(0);
        await this.guessMap.mapViewer.controlsManager.position.set(this.spawnX, 75, this.spawnZ);
        this.isMapLoaded = true;
    }
}
</script>

<style lang="scss">
@import "./scss/global.scss";

#app {
  /*position: absolute;
  width: 100%;
  height: 100%;*/
  font-family: "Futura PT Heavy", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
    
  z-index: 100; // put over bluemap markers

  .map-state-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--theme-fg-light);
    text-align: center;
  }
}
</style>

<style scoped>

.visibility-opened {
    transform: translateY(0);
}

.visibility-closed {
    transform: translateY(120%);
}

.main-holder {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding-bottom: 8vh;
    justify-content: center;
    align-items: center;
}

.menu-holder {
    position: relative;
    display: flex;
    flex-direction: column;
    margin-top: 5vh;
    justify-items: center;
    align-items: center;
    color: white;
}

.timer-holder {
    display: flex;
    align-items: center;
    justify-items: center;
    height: 96px;
}

.headline-holder {
    display: block;
    font-size: 24px;
    line-height: 24px;
    justify-items: center;
    align-items: center;
    padding-left: 2%;
    padding-right: 2%;
    text-align: center;
}

#guess-button {
    z-index: 99;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: forestgreen;
    border-radius: 8px;
    color: white;
    margin: calc(1.5rem + 4px) 8px 8px 8px;
    height: 2.5rem;
    text-align: center;
}

#round-summary {
    z-index: 999;
    position: absolute;
    display: flex;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
}

#round-summary-menu {
    padding-top: 8vh;
}

#round-summary-holder {
    display: flex;
    width: 100vw;
    height: 70vh;
}

#round-summary-map-holder {
    margin: 4% 2%;
    width: 100%;
}

#round-summary-title {
    font-size: 48px;
    line-height: 32px;
    margin: 0;
}

#summary-title {
    font-size: 40px;
    line-height: 24px;
    margin: 2%;
}

#summary-others {
    margin-top: 20%;
    display: flex;
}

#popup-holder {
    z-index: 999;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

#low-holder {
    z-index: 100;
    display: flex;
    flex-direction: column;
    position: absolute;
    width: 100%;
    bottom: 8px;
    justify-content: end;
}

#second-menu-holder {
    margin-bottom: 1.5rem;
    display: flex;
}

#low-summary-holder {
    z-index: 999;
    display: flex;
    position: absolute;
    width: 100%;
    bottom: 8px;
    left: 0;
    justify-content: center;
}

.button {
    flex-grow: 1;
    border: solid white;
    border-radius: 12px;
    margin-left: 4px;
    margin-right: 4px;
    padding: 6px 12px 6px 12px;
    color: white;
    box-shadow: black 0 0 0;
    transition: 0.16s ease-in;
    backdrop-filter: blur(8px);
}

.button:hover {
    box-shadow: black 0 4px 8px;
    background: black;
    transition: 0.16s ease-out;
}

.button-2 {
    flex-grow: 1;
    border: solid white;
    border-radius: 12px;
    margin-left: 4px;
    margin-right: 4px;
    padding: 6px 12px 6px 12px;
    font-size: 16px;
    text-align: center;
    color: white;
    max-width: unset;
    box-shadow: black 0 0 0;
    transition: 0.16s ease-in;
    backdrop-filter: blur(8px);
}

.button-2:hover {
    box-shadow: black 0 4px 8px;
    background: black;
    transition: 0.16s ease-out;
}

.opened {
    display: block;
}

.closed {
    display: none;
}

@media (min-width: 1024px) {
    .headline-holder {
        font-size: 32px;
    }
    
    #guess-button {
        margin: 8px 8px 8px calc(1.5rem + 4px);
    }

    #round-summary-menu {
        padding-top: 0;
    }
    
    #round-summary-holder {
        width: 68vw;
        height: 68vh;
    }

    #round-summary-title {
        margin: 2%;
    }

    #round-summary-map-holder {
        margin: 2%;
    }

    #summary-title {
        font-size: 64px;
        line-height: 48px;
    }
    
    #low-holder {
        justify-content: space-between;
        flex-direction: row;
        width: 100%;
    }

    #second-menu-holder {
        margin-left: 4px;
        margin-bottom: 0;
    }

    .button {
        border: solid white;
        border-radius: 12px;
        color: white;
        box-shadow: black 0 0 0;
    }

    .button-2 {
        border: solid white;
        border-radius: 12px;
        margin-left: 4px;
        margin-right: 4px;
        padding: 6px 12px 6px 12px;
        max-width: 240px;
        color: white;
        box-shadow: black 0 0 0;
    }
}

.lds-ellipsis {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 13px;
}
.lds-ellipsis div {
    position: absolute;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #fff;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
    left: 8px;
    animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
    left: 8px;
    animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
    left: 32px;
    animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
    left: 56px;
    animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
    0% {
        transform: scale(0);
    }
    100% {
        transform: scale(1);
    }
}
@keyframes lds-ellipsis3 {
    0% {
        transform: scale(1);
    }
    100% {
        transform: scale(0);
    }
}
@keyframes lds-ellipsis2 {
    0% {
        transform: translate(0, 0);
    }
    100% {
        transform: translate(24px, 0);
    }
}
</style>