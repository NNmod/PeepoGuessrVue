<template>
    <Background/>
    <div id="main-holder">
        <Logo/>
        <div id="menu-holder">
            <div v-if="account.isLoaded">
                <div class="headline-holder" v-if="this.account.data.gameCode">
                    <a class="headline-flash" :href="'https://ppg.nnmod.com/game.html?code=' + this.account.data.gameCode">{{ $t('home.menu.comeback') }}</a>
                </div>
                <div class="headline-holder">
                    <a class="headline" href="https://ppg.nnmod.com/lobby.html?type=singleplayer">{{ $t('home.menu.single') }}</a>
                </div>
                <div class="headline-holder">
                    <a class="headline" href="https://ppg.nnmod.com/lobby.html?type=multiplayer">{{ $t('home.menu.multi') }}</a>
                </div>
                <div class="headline-holder">
                    <button class="headline">{{ $t('home.menu.party') }}</button>
                </div>
            </div>
            <div v-else>
                <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
        </div>
    </div>
    <div>
        <div v-if="account.isAuthorize">
            <PlayerRight :name="account.data.twitchName" :url="account.data.imageUrl" :score="account.data.score"
                         :division-id="account.data.divisionId"/>
        </div>
        <div v-else-if="account.isLoaded">
            <button id="authorize" class="button" @click="authorize">
                <div id="authorize-holder">
                    <img id="twitch-logo" src="./assets/twitch-logo.png"/>
                    <div>{{ $t('home.authorize.signIn') }}</div>
                </div>
            </button>
        </div>
    </div>
    <div id="low-holder">
        <div id="second-menu-holder">
            <button id="get-started-button" class="button">{{ $t('home.secondMenu.getStarted') }}</button>
            <button class="button">{{ $t('home.secondMenu.settings') }}</button>
        </div>
        <div id="credentials-menu-holder">
            <button id="privacy-button" class="button">{{ $t('home.credentials.privacy') }}</button>
            <button id="terms-button" class="button">{{ $t('home.credentials.terms') }}</button>
            <button class="button">{{ $t('home.credentials.thirdParty') }}</button>
            <button class="button">{{ $t('home.credentials.credentials') }}</button>
            <a class="button" href="https://github.com/nnmod">dev by nnmod</a>
        </div>
    </div>
    <GetStarted/>
    <PrivacyPolicy/>
    <TermsOfUse/>
</template>

<script>

import Background from './components/Background.vue'
import Logo from './components/Logo.vue'
import PlayerRight from './components/PlayerRight.vue'
import GetStarted from "./components/GetStarted.vue";
import PrivacyPolicy from "./components/Privacy.vue";
import TermsOfUse from "./components/Terms.vue";

export default {
    name: 'App',
    components: {
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
                data: {
                    twitchName: '',
                    imageUrl: '',
                    divisionId: 1,
                    score: 0,
                    gameCode: null,
                    gameExpire: null
                }
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
                        gameExpire: null
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
        }
    },
    mounted() {
        this.getUser()
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

#main-holder {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding-bottom: 8vh;
    justify-content: center;
    align-items: center;
}

#menu-holder {
    display: flex;
    flex-direction: column;
    margin-top: 5vh;
}

#authorize {
    position: absolute;
    display: flex;
    right: 8px;
    left: 8px;
    top: 8px;
    height: 6vh;
    max-height: 140px;
    width: auto;
    justify-content: center;
}

#authorize-holder {
    display: flex;
    align-items: center;
    font-size: 20px;
}

#twitch-logo {
    z-index: 99;
    height: 5vh;
    max-height: 116px;
    object-fit: cover;
    object-position: center;
}

#low-holder {
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

#credentials-menu-holder {
    margin-left: 8px;
    display: flex;
    flex-direction: column;
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
    color: white;
    text-shadow: black 0 0 0;
    transition: 0.16s ease-in;
}

.headline:hover {
    font-size: 3.2vh;
    text-shadow: black 0 0.75vh 8px;
    transition: 0.16s ease-out;
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
}

.button:hover {
    box-shadow: black 0 4px 8px;
    background: black;
    transition: 0.16s ease-out;
}

@media (min-width: 768px) {
    #menu-holder {
        margin-top: 5vh;
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
}

.opened {
    display: block;
}

.closed {
    display: none;
}

@media (min-width: 1024px) {
    #authorize {
        left: auto;
        right: 8px;
        max-width: 490px;
        justify-content: center;
    }
    
    #low-holder {
        justify-content: space-between;
        flex-direction: row;
        width: 100%;
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