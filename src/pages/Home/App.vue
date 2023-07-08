<template>
    <Background/>
    <div id="main-holder">
        <Logo/>
        <div id="menu-holder">
            <div v-if="account.isLoaded">
                <div v-if="account.data.worksExpire === null">
                    <div class="headline-holder" v-if="account.data.gameCode">
                        <a class="headline-flash" :href="'https://ppg.nnmod.com/game.html?code=' + account.data.gameCode">{{ $t('home.menu.comeback') }}</a>
                    </div>
                    <div class="headline-holder">
                        <a class="headline enabled" href="https://ppg.nnmod.com/lobby.html?type=singleplayer">{{ $t('home.menu.single') }}</a>
                    </div>
                    <div class="headline-holder">
                        <a class="headline enabled" href="https://ppg.nnmod.com/lobby.html?type=multiplayer">{{ $t('home.menu.multi') }}</a>
                    </div>
                    <div class="headline-holder">
                        <button class="headline disabled">{{ $t('home.menu.party') }}</button>
                    </div>
                    <div class="headline-holder">
                        <button class="headline disabled">{{ $t('home.menu.experiments') }}</button>
                    </div>
                </div>
                <div v-else>
                    <div id="menu-title">
                        <div>{{ $t('home.menu.works') }}</div>
                    </div>
                    <div id="menu-title">
                        <div>{{ $t('home.menu.worksExpire') }} {{ account.worksLocalExpire }}</div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
        </div>
    </div>
    <div id="top-holder">
        <div id="menu-button" class="button top-button-holder" @click="menuToggle">
            <img id="menu-bars" class="top-logo" src="./assets/bars.svg"/>
        </div>
        <div v-if="account.isAuthorize">
            <PlayerRight :name="account.data.twitchName" :url="account.data.imageUrl" :score="account.data.score"
                         :division-id="account.data.divisionId"/>
            <div id="player-controls">
                <!--<a class="button button-grow">{{ $t('home.playerMenu.profile') }}</a>-->
                <a class="button button-grow" href="http://ppg.nnmod.com/leaderboard.html">{{ $t('home.playerMenu.leaderboard') }}</a>
            </div>
        </div>
        <div v-else-if="account.isLoaded" id="authorize-button">
            <button id="authorize" class="button" @click="authorize">
                <div class="top-button-holder">
                    <img class="top-logo" src="./assets/twitch-logo.png"/>
                    <div>{{ $t('home.authorize.signIn') }}</div>
                </div>
            </button>
        </div>
    </div>
    <div id="low-holder" v-bind:class="pages.menuSwitch ? 'menu-opened' : 'menu-closed'">
        <div id="second-menu-holder">
            <button class="button" @click="getStartedToggle">{{ $t('home.secondMenu.getStarted') }}</button>
            <button class="button" @click="settingsToggle">{{ $t('home.secondMenu.settings') }}</button>
        </div>
        <div id="credentials-menu-holder">
            <button class="button" @click="privacyToggle">{{ $t('home.credentials.privacy') }}</button>
            <button class="button" @click="termsToggle">{{ $t('home.credentials.terms') }}</button>
            <button class="button" @click="credentialsToggle">{{ $t('home.credentials.credentials') }}</button>
            <a class="button" href="https://github.com/nnmod">dev by nnmod</a>
        </div>
    </div>
    <GetStarted v-bind:class="pages.getStartedSwitch ? 'opened' : 'closed'"/>
    <PrivacyPolicy v-bind:class="pages.privacySwitch ? 'opened' : 'closed'"/>
    <TermsOfUse v-bind:class="pages.termsSwitch ? 'opened' : 'closed'"/>
    <Settings v-bind:class="pages.settingsSwitch ? 'opened' : 'closed'"/>
    <Credentials v-bind:class="pages.credentialsSwitch ? 'opened' : 'closed'"/>
</template>

<script>

import Background from './components/Background.vue'
import Logo from './components/Logo.vue'
import PlayerRight from './components/PlayerRight.vue'
import GetStarted from "./components/GetStarted.vue";
import PrivacyPolicy from "./components/Privacy.vue";
import TermsOfUse from "./components/Terms.vue";
import Settings from "./components/Settings.vue";
import Credentials from "./components/Credentials.vue";
import {setLanguage} from "@/pages/Home/i18n";

export default {
    name: 'App',
    components: {
        Credentials,
        Settings,
        TermsOfUse,
        PrivacyPolicy,
        GetStarted,
        Background,
        Logo,
        PlayerRight
    },
    data() {
        return {
            account: {
                isLoaded: false,
                isAuthorize: false,
                worksLocalExpire: '',
                data: {
                    twitchName: '',
                    imageUrl: '',
                    divisionId: 1,
                    score: 0,
                    gameCode: null,
                    gameExpire: null,
                    worksExpire: null
                }
            },
            pages: {
                menuSwitch: false,
                getStartedSwitch: false,
                termsSwitch: false,
                privacySwitch: false,
                settingsSwitch: false,
                credentialsSwitch: false
            },
            settings: {
                language: 'en',
                musicVol: 100,
                effectsVol: 100
            }
        }
    },
    methods: {
        getUser() {
            fetch('https://ppg.nnmod.com/api/account/user')
                .then(response => response.json())
                .then(data => {
                    this.account.isLoaded = true;
                    this.account.isAuthorize = true;
                    this.account.data = data;
                    if (this.account.data.worksExpire)
                        this.account.worksLocalExpire = new Date(this.account.data.worksExpire).toLocaleTimeString();
                    if (this.account.data.gameExpire) 
                        this.countdownComeback();
                })
                .catch(() => {
                    this.account.isLoaded = true;
                    this.account.isAuthorize = false;
                    this.account.data = {
                        twitchName: '',
                        imageUrl: '',
                        divisionId: 1,
                        score: 0,
                        gameCode: null,
                        gameExpire: null,
                        worksExpire: null
                    };
                })
        },
        authorize() {
            const  [top, left] = this.centerWindow(560, 640)
            const loginWindow = window.open('https://ppg.nnmod.com/api/account/user/sign-in/preprocessing', 'loginWindow',
                'location=yes,height=720,width=560,left='+left+',top='+top+'scrollbars=yes,status=yes');

            window.addEventListener('message', (event) => {
                if (event.data === 'child-closed') {
                    if (loginWindow) {
                        location.reload();
                        loginWindow.close();
                    }
                }
            });
        },
        countdownComeback() {
            let x = setInterval(async () => {
                let distance = new Date(this.account.data.gameExpire).getTime() - new Date().getTime();

                if (distance < 0) {
                    this.account.data.gameCode = null;
                    this.account.data.gameExpire = null;
                    clearInterval(x);
                }
            }, 1000)
        },
        centerWindow(w, h) {
            const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX;
            const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY;

            const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            const systemZoom = width / window.screen.availWidth;
            const left = (width - w) / 2 / systemZoom + dualScreenLeft
            const top = (height - h) / 2 / systemZoom + dualScreenTop
            return [top, left]
        },
        menuToggle() {
            this.pages.menuSwitch = !this.pages.menuSwitch;
        },
        getStartedToggle() {
            this.pages.getStartedSwitch = !this.pages.getStartedSwitch;
        },
        termsToggle() {
            this.pages.termsSwitch = !this.pages.termsSwitch;
        },
        privacyToggle() {
            this.pages.privacySwitch = !this.pages.privacySwitch;
        },
        settingsToggle() {
            this.pages.settingsSwitch = !this.pages.settingsSwitch;
        },
        credentialsToggle() {
            this.pages.credentialsSwitch = !this.pages.credentialsSwitch;
        },
        effectsVolumeChange() {
            localStorage.setItem('evol', this.settings.effectsVol);
        },
        musicVolumeChange() {
            localStorage.setItem('mvol', this.settings.musicVol);
        },
        languageChange(value) {
            this.settings.language = value;
            setLanguage(value);
        }
    },
    mounted() {
        this.getUser();
        this.settings.effectsVol = localStorage.getItem('evol') || 100;
        this.settings.musicVol = localStorage.getItem('mvol') || 100;
        this.settings.language = localStorage.getItem('lang') || 'en';
    }
}
</script>

<style>
#app {
    font-family: "Futura PT Heavy", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    width: 100%;
    height: 100%;
}

.enabled {
    color: white;
}

.disabled {
    color: gray;
}

#main-holder {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding-bottom: 8vh;
    justify-content: center;
    align-items: center;
}


#top-holder {
    position: absolute;
    display: flex;
    right: 8px;
    left: 8px;
    top: 8px;
    height: 6vh;
    max-height: 140px;
    width: calc(100% - 16px);
}

#authorize {
    width: 100%;
    display: flex;
    justify-content: center;
}

#menu-button {
    z-index: 104;
    height: 100%;
    margin-right: 4px;
}

#authorize-button {
    flex-grow: 1;
}

.top-button-holder {
    display: flex;
    align-items: center;
    font-size: 20px;
}

.top-logo {
    height: 5vh;
    max-height: 116px;
    object-fit: cover;
    object-position: center;
}

#menu-title {
    font-size: 28px;
    color: white;
}

#menu-bars {
    filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(288deg) brightness(102%) contrast(102%);
}

#low-holder {
    z-index: 103;
    flex-direction: column;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding-right: 8px;
    padding-bottom: 8px;
    justify-content: end;
    backdrop-filter: blur(4px);
    background: rgba(0, 0, 0, 0.5);
}

#second-menu-holder {
    margin-left: 8px;
    display: flex;
    flex-direction: column;
}

#credentials-menu-holder {
    margin-left: 8px;
    display: flex;
    flex-direction: column;
}

#player-controls {
    position: absolute;
    top: calc(12px + 6vh);
    right: 8px;
    display: flex;
    flex-direction: column;
    width: calc(6vh / 2 * 7 - 3vh);
    justify-content: end;
    white-space: nowrap;
}

.headline-holder {
    display: block;
    height: 6vh;
    justify-items: center;
    align-items: center;
}

.headline-flash {
    font-family: "Futura PT Heavy", sans-serif;
    font-size: 3vh;
    text-shadow: black 0 0 0;
    transition: 0.16s ease-in;
    animation: blinkColor 2s ease-in-out infinite;
}

.headline-flash:hover {
    font-size: 3.2vh;
    text-shadow: black 0 0.75vh 8px;
    transition: 0.16s ease-out;
}

.headline {
    font-family: "Futura PT Heavy", sans-serif;
    font-size: 3vh;
    text-shadow: black 0 0 0;
    transition: 0.16s ease-in;
}

.headline:hover {
    font-size: 3.2vh;
    text-shadow: black 0 0.75vh 8px;
    transition: 0.16s ease-out;
}

.button-grow {
    flex-grow: 1;
}

.button {
    border: solid white;
    border-radius: 12px;
    margin-top: 2px;
    margin-bottom: 2px;
    padding: 2px 12px 2px 12px;
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

.opened {
    display: block;
}

.closed {
    display: none;
}

.menu-opened {
    display: flex;
}

.menu-closed {
    display: none;
}

@media (min-width: 768px) {
    #menu-holder {
        margin-top: 5vh;
    }

    #low-holder {
        flex-direction: row;
        left: 0;
        top: auto;
        bottom: 8px;
        height: auto;
        padding-right: 0;
        padding-bottom: 0;
        backdrop-filter: unset;
        background: unset;
        justify-content: space-between;
        width: 100%;
    }

    #player-controls {
        flex-direction: row;
        position: absolute;
        top: calc(12px + 8vh);
        right: 8px;
        display: flex;
        width: calc(8vh / 2 * 7 - 4vh);
    }

    .headline-holder {
        height: 8vh;
    }

    .headline-flash {
        font-size: 5vh;
    }

    .headline-flash:hover {
        font-size: 5.2vh;
        text-shadow: black 0 0.75vh 8px;
        transition: 0.16s ease-out;
    }
    
    .headline {
        font-size: 5vh;
    }

    .headline:hover {
        font-size: 5.2vh;
        text-shadow: black 0 0.75vh 8px;
        transition: 0.16s ease-out;
    }

    #menu-button {
        display: none;
    }

    #top-holder {
        position: absolute;
        left: auto;
        width: auto;
    }

    #authorize {
        left: auto;
        right: 8px;
        max-width: 490px;
        justify-content: center;
    }

    #second-menu-holder {
        margin-left: 4px;
        flex-direction: row;
    }

    #credentials-menu-holder {
        margin-right: 4px;
        flex-direction: row;
    }

    .button {
        margin-left: 4px;
        margin-right: 4px;
    }

    .menu-closed {
        display: flex;
    }
}

@keyframes blinkColor{
    0%{color: white;}
    50%{color: red;}
    100%{color: white;}
}

.lds-ellipsis {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
}
.lds-ellipsis div {
    position: absolute;
    top: 33px;
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