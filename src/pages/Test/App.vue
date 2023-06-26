<template>
    <div id="low-holder">
        <div id="second-menu-holder">
            <button class="button">{{ $t('home.secondMenu.settings') }}</button>
        </div>
    </div>
    <div id="map-container"></div>
    <div id="app">
        <!--<FreeFlightMobileControls v-if="mapViewer.mapLoaded && appState.controls.state === 'free'" />
        <ZoomButtons v-if="showMapMenu && appState.controls.showZoomButtons && appState.controls.state !== 'free'" />
        <ControlBar />-->
        <div v-if="mapViewer.mapState !== 'loaded'" class="map-state-message">{{ $t("map." + mapViewer.mapState) }}</div>
        <!--<MainMenu :menu="appState.menu" />-->
    </div>
    <PlayerRight/>
    <BattleMenu/>
    <PlayerLeft/>
</template>

<script>
import PlayerRight from './components/PlayerRight.vue'
import PlayerLeft from './components/PlayerLeft.vue';
import BattleMenu from "./components/BattleMenu.vue";

export default {
    name: 'App',
    components: {
        BattleMenu,
        PlayerLeft,
        PlayerRight
    },
    computed: {
        showMapMenu() {
            return this.mapViewer.mapState === "loading" || this.mapViewer.mapState === "loaded";
        }
    },
    data() {
        return {
            appState: this.$freeMap.appState,
            mapViewer: this.$freeMap.mapViewer.data,
            testLink: "https://static-cdn.jtvnw.net/jtv_user_pictures/a2634692-1aeb-4e11-b4b8-74a711196ebc-profile_image-300x300.png"
        }
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

  //pointer-events: none;

  font-size: 1rem;
  @media (max-width: $mobile-break) {
    font-size: 1.5rem;
  }

  .map-state-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--theme-fg-light);
    line-height: 1em;
    text-align: center;
  }
}
</style>

<style scoped>

#low-holder {
    z-index: 100;
    display: flex;
    flex-direction: column;
    position: absolute;
    width: auto;
    bottom: 8px;
    justify-content: end;
}

#second-menu-holder {
    margin-left: 8px;
    display: flex;
    flex-direction: column;
}

.button {
    border: solid white;
    border-radius: 12px;
    margin-top: 2px;
    margin-bottom: 2px;
    padding: 6px 12px 6px 12px;
    color: white;
    box-shadow: black 0 0 0;
    transition: 0.16s ease-in;
}

.button:hover {
    box-shadow: black 0 4px 8px;
    background: black;
    transition: 0.16s ease-out;
}

@media (min-width: 1024px) {
    #low-holder {
        justify-content: space-between;
        flex-direction: row;
        width: 100%;
    }

    #second-menu-holder {
        margin-left: 4px;
        flex-direction: row;
    }

    .button {
        margin-left: 4px;
        margin-right: 4px;
    }
}
</style>