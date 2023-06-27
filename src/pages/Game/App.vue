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
                    <div id="flat-resize-holder" @click="guessPanelToggle">GUESS</div>
                    <div id="flat-map-holder"></div>
                    <button id="guess-button" v-if="game.users.length > 0 && game.users[0].guessLeft > 0 && guessMarker !== null && guessMarker.guessPosition !== null"
                    @click="guess">
                        <div v-if="guessProcess" class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                        <div v-else>Accept Guess</div>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div id="low-holder">
        <div id="second-menu-holder">
            <button class="button" @click="toSpawn">return to spawn</button>
            <button class="button">{{ $t('home.secondMenu.settings') }}</button>
        </div>
    </div>
    <div id="map-container"></div>
    <div id="app">
    </div>
    <BattleMenu :round-duration-minutes="game.round.duration.minutes" :round-duration-seconds="game.round.duration.seconds" 
                :multiplier="game.round.multiplier" :is-last-seconds="game.round.isLastSeconds"/>
    <div v-if="game.users.length < 3">
        <PlayerLeft v-if="game.users.length > 0" :name="game.users[0].name" :score="game.users[0].health" 
                    :division-id="game.users[0].divisionId" :url="game.users[0].imageUrl"/>
        <PlayerRight v-if="game.users.length > 1" :name="game.users[1].name" :score="game.users[1].health"
                     :division-id="game.users[1].divisionId" :url="game.users[1].imageUrl"/>  
    </div>
    <div id="popup-holder" v-if="game.status !== 'round' && game.status !== 'roundSummary'">
        <Background/>
        <div v-if="game.status === 'error'">
            <div class="main-holder">
                <Logo/>
                <div class="menu-holder">
                    Unexpected error happened. Be sure that this game exists.
                </div>
            </div>
        </div>
        <div v-else-if="game.status === 'prepare'">
            <div class="main-holder">
                <Logo/>
                <div class="menu-holder">
                    <div class="headline-holder">Waiting for a new round</div>
                    <div class="timer-holder">
                        <div v-if="game.round.delay.seconds <= 0">
                            <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                        </div>
                        <div v-else>
                            <div class="headline-holder">{{ game.round.delay.seconds }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="game.status === 'summary'">
            <div class="main-holder">
                <div class="menu-holder">
                    SUMMARY
                </div>
            </div>
        </div>
    </div>
    <div id="round-summary" v-bind:class="game.status === 'roundSummary' ? 'visibility-opened' : 'visibility-closed'">
        <Background/>
        <div class="main-holder">
            <div class="menu-holder">
                <div id="round-summary-title">Round {{ game.roundSummary.roundCount }}</div>
                <div id="round-summary-holder">
                    <div id="round-summary-map-holder"></div>
                </div>
                <div v-if="game.users.length < 3">
                    <PlayerLeftRoundSummary v-if="game.users.length > 0" :name="game.users[0].name" :score="game.users[0].health" :damage="game.users[0].damage"
                                            :is-damage-updating="game.users[0].isDamageUpdating" :is-health-updating="game.users[0].isHealthUpdating"
                                            :division-id="game.users[0].divisionId" :url="game.users[0].imageUrl"/>
                    <PlayerRightRoundSummary v-if="game.users.length > 1" :name="game.users[1].name" :score="game.users[1].health" :damage="game.users[1].damage"
                                             :is-damage-updating="game.users[1].isDamageUpdating" :is-health-updating="game.users[1].isHealthUpdating"
                                             :division-id="game.users[1].divisionId" :url="game.users[1].imageUrl"/>
                </div>
                <div class="headline-holder" v-if="this.game.isCompleted">Game summary in</div>
                <div class="headline-holder" v-else>Next round in</div>
                <div class="timer-holder">
                    <div v-if="game.round.delay.seconds <= 0">
                        <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                    </div>
                    <div v-else>
                        <div class="headline-holder">{{ game.round.delay.seconds }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import Background from './components/Background.vue';
import Logo from './components/Logo.vue';
import PlayerRight from './components/PlayerRight.vue';
import PlayerLeft from './components/PlayerLeft.vue';
import BattleMenu from "./components/BattleMenu.vue";
import {useSignalR} from "@quangdao/vue-signalr";
import PlayerLeftRoundSummary from "./components/PlayerLeftRoundSummary.vue";
import PlayerRightRoundSummary from "./components/PlayerRightRoundSummary.vue";
import {BlueMapApp} from "@/pages/Game/js/BlueMapApp";
import {PopupMarker} from "@/pages/Game/js/markers/PopupMarker";
import {GuessMarker} from "@/pages/Game/js/markers/GuessMarker";
import {Vector2} from "three";

export default {
    name: 'App',
    components: {
        PlayerRightRoundSummary,
        PlayerLeftRoundSummary,
        Background,
        Logo,
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
            test: 0,
            playMap: null,
            guessMap: null,
            roundSummaryMap: null,
            guessMarker: null,
            guessOriginMarker: null,
            guessProcess: false,
            guessPanelSwitch: false,
            signalr: null,
            game: {
                status: 'prepare',//prepare
                isCompleted: false,
                users: [],
                summaryUsers: [],
                round: {
                    roundCount: 0,
                    multiplier: 1,
                    mapUrl: '',
                    posX: 0,
                    posY: 0,
                    roundExpire: new Date(),
                    roundDelay: new Date(),
                    delay: {
                        seconds: 0
                    },
                    duration: {
                        minutes: 0,
                        seconds: 0
                    },
                    isLastSeconds: false
                },
                roundSummary: {
                    roundCount: 0
                }
            },
            audios: {
                clock: null,
                bell: null,
                hit: null,
                damage: null
            }
        }
    },
    methods: {
        guessPanelToggle() {
            this.guessPanelSwitch = !this.guessPanelSwitch;
        },
        guess() {
            if (this.guessMarker && this.guessMarker.position && !this.guessProcess) {
                this.guessProcess = true;
                fetch('https://ppg.nnmod.com/api/game/game/guess',{
                    method:  'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        posX: this.guessMarker.guessPosition.x,
                        posY: this.guessMarker.guessPosition.y
                    })
                })
                .then(() => this.guessProcess = false)
                .catch(() => this.guessProcess = false)
            }
        },
        error() {
            this.game.status = 'error';
            console.log(this.game.status);
        },
        connectionError() {
            this.game.status = 'error';
            console.log(this.game.status);
        },
        completeGame(value) {
            console.log(this.game.status);
            this.game.round.roundDelay = new Date(value.summaryDelay);
            this.countdownRoundDelay();

            value.users.forEach(userSummary => {
                console.log(userSummary);
                if (userSummary.isWinner)
                    this.game.summaryUsers.unshift(userSummary);
                else 
                    this.game.summaryUsers.push(userSummary);
            });
        },
        async completeRound(value) {
            this.game.isCompleted = value.isGameCompleted;
            this.game.roundSummary.roundCount = value.roundCount;
            this.game.roundSummary.isHitAudioPlayed = false;
            this.game.roundSummary.isDamageAudioPlayed = false;
            this.guessPanelSwitch = false;
            this.guessMarker.close();
            this.game.status = 'roundSummary';
            
            await this.playMap.mapViewer.switchMap(null);
            await this.guessMap.mapViewer.switchMap(null);
            await this.roundSummaryMap.switchMap(value.mapUrl);
            await this.roundSummaryMap.setFlatView(0);
            await this.roundSummaryMap.mapViewer.controlsManager.position.set(value.posX, 1, value.posY);
            this.guessOriginMarker.open(new Vector2(value.posX, value.posY));
            console.log(this.game.status);
            
            value.users.forEach(userSummary => {
                console.log(userSummary);
                this.userRoundSummary(userSummary);
                const user = this.game.users.find((o) => o.userId === userSummary.userId);
                if (userSummary.posX && userSummary.posY) {
                    user.guessMarker.open(new Vector2(userSummary.posX, userSummary.posY));
                }
                else {
                    user.guessMarker.close();
                }
            });
        },
        userRoundSummary(value) {
            const user = this.game.users.find((o) => o.userId === value.userId);
            user.isDamageUpdating = true;
            user.damage = Math.floor(value.distance);
            this.updateDamage(user, Math.floor(value.distance), value.damage, user.health, value.health);
        },
        async newRound(value) {
            console.log(value);
            this.game.round.roundCount = value.roundCount;
            this.game.round.multiplier = value.multiplier;
            this.game.round.mapUrl = value.mapUrl;
            this.game.round.posX = value.posX;
            this.game.round.posY = value.posY;
            this.game.round.roundExpire = new Date(value.roundExpire);
            this.game.round.roundDelay = new Date(value.roundDelay);
            this.game.round.delay = {
                seconds: 0
            };
            this.game.round.duration = {
                minutes: 0,
                seconds: 0
            }
            await this.playMap.switchMap(this.game.round.mapUrl);
            await this.playMap.setFreeFlight(0, 75);
            await this.playMap.mapViewer.controlsManager.position.set(this.game.round.posX, 75, this.game.round.posY);
            await this.guessMap.switchMap(this.game.round.mapUrl);
            await this.guessMap.setFlatView(0);
            this.countdownRoundDelay();
            this.countdownRoundDuration();
        },
        async toSpawn() {
            await this.playMap.mapViewer.controlsManager.position.set(this.game.round.posX, 75, this.game.round.posY);
        },
        roundPromotion(value) {
            console.log(value);
            this.game.round.roundExpire = value.roundExpire;
            if (this.audios.bell)
                this.audios.bell.cloneNode(true).play().catch(() => {
                });
        },
        userGuess(value) {
            console.log(value);
            const user = this.game.users.find((o) => o.userId === value.userId);
            user.guessLeft = value.guessLeft;
            user.guessDistance = value.distance;
        },
        newUser(value) {
            console.log(value);
            let guessUserMarker = new GuessMarker("bm-guess-origin", this.roundSummaryMap.appState,
                value.imageUrl);
            value.guessMarker = guessUserMarker;
            this.roundSummaryMap.guessMarkerSet.add(guessUserMarker);
            
            if (value.connectionId === this.signalr.connection.connectionId) {
                this.game.users.unshift(value);
                const guessMarker = new PopupMarker("bm-guess", this.guessMap.appState, this.guessMap.events,
                    this.game.users[0].imageUrl);
                this.guessMarker = guessMarker;
                this.guessMap.popupMarkerSet.add(guessMarker);
                let guessOriginMarker = new GuessMarker("bm-guess-origin", this.roundSummaryMap.appState,
                    "https://ppg.cdn.nnmod.com/assets/ppg-logo.png", true);
                this.guessOriginMarker = guessOriginMarker;
                this.roundSummaryMap.guessMarkerSet.add(guessOriginMarker);
            }
            else 
                this.game.users.push(value);
        },
        removeUser(value) {
            console.log(value);
            const user = this.game.users.find((o) => o.connectionId === value);
            if (user) {
                this.roundSummaryMap.guessMarkerSet.remove(user.guessMarker);
                let index = this.game.users.indexOf(user);
                if (index > -1) {
                    this.game.users.splice(index, 1);
                }
            }
        },
        countdownRoundDelay() {
            let x = setInterval(async () => {
                let distance = new Date(this.game.round.roundDelay).getTime() - new Date().getTime();

                this.game.round.delay.seconds = Math.floor((distance % (1000 * 60)) / 1000);

                if (distance < 0) {
                    this.game.round.delay.seconds = 0;
                    if (this.game.isCompleted)
                        this.game.status = 'summary';
                    else
                        this.game.status = 'round';
                    console.log(this.game.status);
                    clearInterval(x);
                    this.guessOriginMarker.close();
                    this.game.users.forEach(user => user.guessMarker.close());
                    await this.roundSummaryMap.mapViewer.switchMap(null);
                }
            }, 1000)
        },
        countdownRoundDuration() {
            let x = setInterval(() => {
                let distance = new Date(this.game.round.roundExpire).getTime() - new Date().getTime();

                this.game.round.duration.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                this.game.round.duration.seconds = Math.floor((distance % (1000 * 60)) / 1000);

                if (this.game.round.duration.minutes === 0 && this.game.round.duration.seconds < 10 && !this.game.round.isLastSeconds) {
                    this.game.round.isLastSeconds = true;
                    if (this.audios.clock)
                        this.audios.clock.play().catch(() => {
                        });
                }
                else if (this.game.round.duration.minutes > 0 || this.game.round.duration.seconds >= 10) {
                    this.game.round.isLastSeconds = false;
                    if (this.audios.clock) {
                        this.audios.clock.pause();
                        this.audios.clock.currentTime = 0;
                    }
                }
                
                if (distance < 0) {
                    this.game.round.duration.minutes = 0;
                    this.game.round.duration.seconds = 0;
                    this.game.round.isLastSeconds = false;
                    if (this.audios.clock) {
                        this.audios.clock.pause();
                        this.audios.clock.currentTime = 0;
                    }
                    clearInterval(x);
                }
            }, 1000)
        },
        updateDamage(user, start, end, scoreStart, scoreEnd) {
            if (!this.game.roundSummary.isHitAudioPlayed) {
                this.game.roundSummary.isHitAudioPlayed = true;
                if (this.audios.hit)
                    this.audios.hit.play().catch(() => {
                    });
            }
            
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / 1200, 1);
                user.damage = Math.floor(progress * (end - start) + start);
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
                else {
                    user.damage = end;
                    user.isDamageUpdating = false;
                    user.isHealthUpdating = true;
                    this.updateScore(user, scoreStart, scoreEnd);
                    if (this.audios.hit) {
                        this.audios.hit.pause();
                        this.audios.hit.currentTime = 0;
                    }
                }
            };
            window.requestAnimationFrame(step);
        },
        updateScore(user, start, end) {
            if (!this.game.roundSummary.isDamageAudioPlayed) {
                this.game.roundSummary.isDamageAudioPlayed = true;
                if (this.audios.damage)
                    this.audios.damage.play().catch(() => {
                    });
            }
            
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / 1600, 1);
                user.health = Math.floor(progress * (end - start) + start);
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
                else {
                    user.health = end;
                    user.isHealthUpdating = false;
                    if (this.audios.damage) {
                        this.audios.damage.pause();
                        this.audios.damage.currentTime = 0;
                    }
                }
            };
            window.requestAnimationFrame(step);
        }
    },
    async mounted() {
        this.signalr = useSignalR();
        this.signalr.connection.onclose(() => this.connectionError());
        this.signalr.on('Error', () => this.error());
        this.signalr.on('GameSummary', value => this.completeGame(value));
        this.signalr.on('RoundSummary', value => this.completeRound(value));
        this.signalr.on('NewRound', value => this.newRound(value));
        this.signalr.on('RoundPromotion', value => this.roundPromotion(value));
        this.signalr.on('UserGuess', value => this.userGuess(value));
        this.signalr.on('NewUser', value => this.newUser(value));
        this.signalr.on('RemoveUser', value => this.removeUser(value));

        this.audios.clock = new Audio('https://ppg.cdn.nnmod.com/assets/audios/clock.mp3');
        this.audios.clock.loop = false;
        this.audios.bell = new Audio('https://ppg.cdn.nnmod.com/assets/audios/bell.mp3');
        this.audios.hit = new Audio('https://ppg.cdn.nnmod.com/assets/audios/summary/round/hit.mp3');
        this.audios.hit.loop = false;
        this.audios.damage = new Audio('https://ppg.cdn.nnmod.com/assets/audios/summary/round/damage.mp3');
        this.audios.damage.loop = false;
        
        const playMap = new BlueMapApp(document.getElementById("free-map-holder"), true);
        this.playMap = playMap;
        await playMap.load();
        const guessMap = new BlueMapApp(document.getElementById("flat-map-holder"));
        this.guessMap = guessMap;
        await guessMap.load();
        const roundSummaryMap = new BlueMapApp(document.getElementById("round-summary-map-holder"));
        this.roundSummaryMap = roundSummaryMap;
        await roundSummaryMap.load();
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

.visibility-opened {
    transform: translateY(0);
}

.visibility-closed {
    transform: translateY(100%);
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
    font-size: 32px;
    justify-items: center;
    align-items: center;
}

#guess-button {
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

#round-summary-holder {
    display: flex;
    width: 68vw;
    height: 68vh;
    //background: white;
}

#round-summary-map-holder {
    margin: 2%;
    width: 100%;
}

#round-summary-title {
    font-size: 48px;
    margin: 2%;
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
    #guess-button {
        margin: 8px 8px 8px calc(1.5rem + 4px);
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

    .button {
        margin-left: 4px;
        margin-right: 4px;
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