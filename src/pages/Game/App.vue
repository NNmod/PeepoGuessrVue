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
                        <div v-else>{{ $t('game.acceptGuess') }}</div>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div id="low-holder">
        <div id="second-menu-holder">
            <button class="button" @click="toSpawn">{{ $t('game.returnToSpawn') }}</button>
            <button class="button" @click="settingsToggle">{{ $t('home.secondMenu.settings') }}</button>
        </div>
    </div>
    <Settings v-bind:class="pages.settingsSwitch ? 'opened' : 'closed'"/>
    <div id="map-container"></div>
    <div id="app">
    </div>
    <BattleMenu :round-duration-minutes="game.round.duration.minutes" :round-duration-seconds="game.round.duration.seconds" 
                :multiplier="game.round.multiplier" :is-last-seconds="game.round.isLastSeconds"/>
    <div v-if="game.users.length < 3">
        <PlayerLeft v-if="game.users.length > 0" :name="game.users[0].name" :score="game.users[0].health" 
                    :division-id="game.users[0].divisionId" :url="game.users[0].imageUrl" :is-connected="game.users[0].isConnected"/>
        <PlayerRight v-if="game.users.length > 1" :name="game.users[1].name" :score="game.users[1].health"
                     :division-id="game.users[1].divisionId" :url="game.users[1].imageUrl" :is-connected="game.users[1].isConnected"/>  
    </div>
    <div id="popup-holder" v-if="game.status !== 'round' && game.status !== 'roundSummary'">
        <Background/>
        <div v-if="game.status === 'error'">
            <div class="main-holder">
                <Logo/>
                <div class="menu-holder">
                    <div v-if="worksExpire !== null">
                        <div class="headline-holder">{{ $t('home.menu.works') }}</div>
                        <div class="headline-holder">{{ $t('home.menu.worksExpire') }} {{ worksLocalExpire }}</div>
                    </div>
                    <div v-else>
                        <div class="headline-holder">{{ $t('game.error') }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="game.status === 'prepare'">
            <div class="main-holder">
                <Logo/>
                <div class="menu-holder">
                    <div class="headline-holder">{{ $t('game.loading') }}</div>
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
                <div class="menu-holder" v-if="game.users.length > 0">
                    <div id="summary-title" v-if="game.users[0].isWinner">{{ $t('game.summary.win') }}</div>
                    <div id="summary-title" v-else>{{ $t('game.summary.lose') }}</div>
                    <PlayerSummaryMain :url="game.users[0].imageUrl" :division-id="game.users[0].divisionId" :score="game.users[0].score"
                                       :name="game.users[0].name" :wins="game.users[0].wins" :upgrade="game.users[0].upgrade"/>
                    <div id="summary-others" v-if="game.users.length > 1">
                        <PlayerSummaryOther :name="game.users[1].name" :division-id="game.users[1].divisionId" 
                                            :score="game.users[1].newScore" :url="game.users[1].imageUrl"/>
                    </div>
                </div>
            </div>
            <div id="low-summary-holder">
                <a class="button-2" :href="origin">{{ $t('game.summary.toMenu') }}</a>
            </div>
        </div>
    </div>
    <div id="round-summary" v-bind:class="game.status === 'roundSummary' ? 'visibility-opened' : 'visibility-closed'">
        <Background/>
        <div class="main-holder">
            <div id="round-summary-menu" class="menu-holder">
                <div id="round-summary-title">{{ $t('game.roundSummary.round') }} {{ game.roundSummary.roundCount }}</div>
                <div id="round-summary-holder">
                    <div id="round-summary-map-holder"></div>
                </div>
                <div v-if="game.users.length < 3">
                    <PlayerLeftRoundSummary v-if="game.users.length > 0" :name="game.users[0].name" :score="game.users[0].health" :damage="game.users[0].damage"
                                            :is-damage-updating="game.users[0].isDamageUpdating" :is-health-updating="game.users[0].isHealthUpdating"
                                            :division-id="game.users[0].divisionId" :url="game.users[0].imageUrl" :is-connected="game.users[0].isConnected"/>
                    <PlayerRightRoundSummary v-if="game.users.length > 1" :name="game.users[1].name" :score="game.users[1].health" :damage="game.users[1].damage"
                                             :is-damage-updating="game.users[1].isDamageUpdating" :is-health-updating="game.users[1].isHealthUpdating"
                                             :division-id="game.users[1].divisionId" :url="game.users[1].imageUrl" :is-connected="game.users[1].isConnected"/>
                </div>
                <div class="headline-holder" v-if="this.game.isCompleted">{{ $t('game.roundSummary.gameSummary') }}</div>
                <div class="headline-holder" v-else>{{ $t('game.roundSummary.nextRound') }}</div>
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
import PlayerSummaryMain from "./components/PlayerSummaryMain.vue";
import PlayerSummaryOther from "./components/PlayerSummaryOther.vue";
import Settings from "./components/Settings.vue";
import {BlueMapApp} from "@/pages/Game/js/BlueMapApp";
import {PopupMarker} from "@/pages/Game/js/markers/PopupMarker";
import {GuessMarker} from "@/pages/Game/js/markers/GuessMarker";
import {Vector2} from "three";
import {setLanguage} from "@/pages/Game/i18n";

export default {
    name: 'App',
    components: {
        Settings,
        PlayerSummaryMain,
        PlayerSummaryOther,
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
            origin: null,
            test: 0,
            playMap: null,
            guessMap: null,
            roundSummaryMap: null,
            guessMarker: null,
            guessOriginMarker: null,
            guessProcess: false,
            guessPanelSwitch: false,
            signalr: null,
            worksExpire: null,
            worksLocalExpire: '',
            game: {
                status: 'prepare',//prepare
                isCompleted: false,
                users: [],
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
                damage: null,
                defeat: null,
                win: null,
                promotion: null,
                demotion: null
            },
            pages: {
              settingsSwitch: false  
            },
            settings: {
                language: 'en',
                musicVol: 100,
                effectsVol: 100
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
                fetch(this.origin + '/api/game/game/guess',{
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
        },
        connectionError() {
            this.game.status = 'error';
        },
        maintenance(value) {
            this.worksExpire = value.worksExpire;
            if (this.worksExpire)
                this.worksLocalExpire = new Date(this.worksExpire).toLocaleTimeString();
        },
        completeGame(value) {
            this.game.round.roundDelay = new Date(value.summaryDelay);

            value.users.forEach(userSummary => {
                this.userSummary(userSummary);
            });
            this.countdownRoundDelay();
        },
        userSummary(value) {
            const user = this.game.users.find((o) => o.userId === value.userId);
            user.divisionId = value.divisionId;
            user.isWinner = value.isWinner;
            user.isDivisionPromoted = value.isDivisionPromoted;
            user.isDivisionDemoted = value.isDivisionDemoted;
            user.score = value.oldScore;
            user.newScore = value.score;
            user.wins = value.wins;
            user.upgrade = value.upgrade;
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
            
            value.users.forEach(userSummary => {
                this.userRoundSummary(userSummary);
            });
        },
        userRoundSummary(value) {
            const user = this.game.users.find((o) => o.userId === value.userId);
            user.isDamageUpdating = true;
            user.damage = Math.floor(value.distance);
            this.updateDamage(user, Math.floor(value.distance), value.damage, user.health, value.health);
            if (value.posX && value.posY) {
                user.guessMarker.open(new Vector2(value.posX, value.posY));
            }
            else {
                user.guessMarker.close();
            }
        },
        async newRound(value) {
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
            await this.playMap.setFreeFlight(0);
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
            this.game.round.roundExpire = value.roundExpire;
            if (this.audios.bell)
                this.audios.bell.play().catch(() => {
                });
        },
        userGuess(value) {
            const user = this.game.users.find((o) => o.userId === value.userId);
            user.guessLeft = value.guessLeft;
            user.guessDistance = value.distance;
        },
        newUser(value) {
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
        userStatus(value) {
            const user = this.game.users.find((o) => o.userId === value.userId);
            user.isConnected = value.isConnected;
        },
        countdownRoundDelay() {
            let x = setInterval(async () => {
                let distance = new Date(this.game.round.roundDelay).getTime() - new Date().getTime();

                this.game.round.delay.seconds = Math.floor((distance % (1000 * 60)) / 1000);

                if (distance < 0) {
                    this.game.round.delay.seconds = 0;
                    if (this.game.isCompleted) {
                        this.game.status = 'summary';
                        if (this.game.users.length > 0)
                            this.updateScore(this.game.users[0], this.game.users[0].score, this.game.users[0].newScore);
                        if (this.game.users.length > 0 && this.game.users[0].isWinner) {
                            if (this.audios.win)
                                this.audios.win.play().catch(() => { });
                        }
                        else {
                            if (this.audios.defeat)
                                this.audios.defeat.play().catch(() => { });
                        }

                        if (this.game.users.length > 0 && this.game.users[0].isDivisionPromoted) {
                            if (this.audios.promotion)
                                this.audios.promotion.play().catch(() => { });
                        }
                        else if (this.game.users.length > 0 && this.game.users[0].isDivisionDemoted) {
                            if (this.audios.demotion)
                                this.audios.demotion.play().catch(() => { });
                        }
                    }
                    else
                        this.game.status = 'round';
                    
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
                    this.updateHealth(user, scoreStart, scoreEnd);
                    if (this.audios.hit) {
                        this.audios.hit.pause();
                        this.audios.hit.currentTime = 0;
                    }
                }
            };
            window.requestAnimationFrame(step);
        },
        updateHealth(user, start, end) {
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
        },
        updateScore(user, start, end) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / 1600, 1);
                user.score = Math.floor(progress * (end - start) + start);
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
                else {
                    user.score = end;
                    user.isScoreUpdating = false;
                }
            };
            window.requestAnimationFrame(step);
        },
        settingsToggle() {
            this.pages.settingsSwitch = !this.pages.settingsSwitch;
        },
        effectsVolumeChange() {
            localStorage.setItem('evol', this.settings.effectsVol);
            this.audios.clock.volume = this.settings.effectsVol * 0.01;
            this.audios.bell.volume = this.settings.effectsVol * 0.01;
            this.audios.hit.volume = this.settings.effectsVol * 0.01;
            this.audios.damage.volume = this.settings.effectsVol * 0.01;
            this.audios.defeat.volume = this.settings.effectsVol * 0.01;
            this.audios.win.volume = this.settings.effectsVol * 0.01;
            this.audios.promotion.volume = this.settings.effectsVol * 0.01;
            this.audios.demotion.volume = this.settings.effectsVol * 0.01;
        },
        musicVolumeChange() {
            localStorage.setItem('mvol', this.settings.musicVol);
        },
        languageChange(value) {
            this.settings.language = value;
            setLanguage(value);
        }
    },
    async mounted() {
        this.origin = window.location.origin;
        this.signalr = useSignalR();
        this.signalr.connection.onclose(() => this.connectionError());
        this.signalr.on('Error', () => this.error());
        this.signalr.on('MaintenanceExpire', value => this.maintenance(value));
        this.signalr.on('GameSummary', value => this.completeGame(value));
        this.signalr.on('RoundSummary', value => this.completeRound(value));
        this.signalr.on('NewRound', value => this.newRound(value));
        this.signalr.on('RoundPromotion', value => this.roundPromotion(value));
        this.signalr.on('UserGuess', value => this.userGuess(value));
        this.signalr.on('NewUser', value => this.newUser(value));
        this.signalr.on('UserStatus', value => this.userStatus(value));

        this.settings.effectsVol = localStorage.getItem('evol') || 100;
        this.settings.musicVol = localStorage.getItem('mvol') || 100;
        this.settings.language = localStorage.getItem('lang') || 'en';
        
        this.audios.clock = new Audio('https://ppg.cdn.nnmod.com/assets/audios/clock.mp3');
        this.audios.clock.loop = false;
        this.audios.bell = new Audio('https://ppg.cdn.nnmod.com/assets/audios/bell.mp3');
        this.audios.bell.loop = false;
        this.audios.hit = new Audio('https://ppg.cdn.nnmod.com/assets/audios/summary/round/hit.mp3');
        this.audios.hit.loop = false;
        this.audios.damage = new Audio('https://ppg.cdn.nnmod.com/assets/audios/summary/round/damage.mp3');
        this.audios.damage.loop = false;
        this.audios.defeat = new Audio('https://ppg.cdn.nnmod.com/assets/audios/summary/defeat2.mp3');
        this.audios.defeat.loop = false;
        this.audios.win = new Audio('https://ppg.cdn.nnmod.com/assets/audios/summary/win.mp3');
        this.audios.win.loop = false;
        this.audios.promotion = new Audio('https://ppg.cdn.nnmod.com/assets/audios/summary/division/promoted.mp3');
        this.audios.promotion.loop = false;
        this.audios.demotion = new Audio('https://ppg.cdn.nnmod.com/assets/audios/summary/division/demoted.mp3');
        this.audios.demotion.loop = false;

        this.audios.clock.volume = this.settings.effectsVol * 0.01;
        this.audios.bell.volume = this.settings.effectsVol * 0.01;
        this.audios.hit.volume = this.settings.effectsVol * 0.01;
        this.audios.damage.volume = this.settings.effectsVol * 0.01;
        this.audios.defeat.volume = this.settings.effectsVol * 0.01;
        this.audios.win.volume = this.settings.effectsVol * 0.01;
        this.audios.promotion.volume = this.settings.effectsVol * 0.01;
        this.audios.demotion.volume = this.settings.effectsVol * 0.01;
        
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