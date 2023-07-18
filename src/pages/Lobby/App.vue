<template>
    <Background/>
    <div id="main-holder">
        <Logo/>
        <div id="menu-holder">
            <div id="menu-title">
                <div v-if="worksExpire !== null">{{ $t('home.menu.works') }}</div>
                <div v-else-if="redirectGame !== null">{{ $t('lobby.redirect') }}</div>
                <div v-else-if="lobby.isMatchmakingTrouble">{{ $t('lobby.trouble') }}</div>
                <div v-else-if="lobby.isDelayed">{{ $t('lobby.delayed') }}</div>
                <div v-else-if="isError">{{ $t('lobby.error') }}</div>
                <div v-else-if="lobbyType === 'multiplayer'">{{ $t('lobby.searching') }}</div>
                <div v-else>{{ $t('lobby.creating') }}</div>
            </div>
            
            <div v-if="worksExpire !== null">
                <div id="menu-title">{{ $t('home.menu.worksExpire') }} {{ worksLocalExpire }}</div>
            </div>
            <div v-else-if="redirectGame !== null">
                <div class="headline-holder">
                    <a class="headline-flash" :href="origin + '/game.html?code=' + this.redirectGame.gameCode">{{ $t('home.menu.comeback') }}</a>
                </div>
                <div id="menu-title">{{ $t('lobby.untilOver') }}</div>
            </div>
            <div v-else-if="!isError">
                <div v-if="lobbyType === 'multiplayer'" id="selector-holder">
                    <div class="scroll">
                        <ul id="players-holder" v-if="users.length > 0">
                            <li class="player-item-holder" v-for="user in users" :key="user.userId">
                                <PlayerLeft :name="user.name" :division-id="user.divisionId" :score="user.score" :url="user.imageUrl"
                                            :is-requested="user.isRequested" :is-invited="user.isInvited" :is-random-enable="user.isRandomAcceptable"/>
                                <div class="button-holder">
                                    <button class="button button-small" v-if="user.isRequested" @click="revokeInviteUser(user.userId)">{{ $t('lobby.multiplayer.action.revoke') }}</button>
                                    <button class="button button-small" v-else @click="inviteUser(user.userId)">{{ $t('lobby.multiplayer.action.invite') }}</button>
                                </div>
                            </li>
                        </ul>
                        <div v-else id="menu-title">
                            {{ $t('lobby.multiplayer.noPlayers') }}
                        </div>
                    </div>
                    <button class="button" v-if="isRandomAcceptable" @click="randomToggle">{{ $t('lobby.multiplayer.random.disable') }}</button>
                    <button class="button" v-else @click="randomToggle">{{ $t('lobby.multiplayer.random.enable') }}</button>
                </div>
                <div v-else>
                    <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </div>
            </div>
        </div>
    </div>
    <div id="low-holder">
        <a class="button button-grow button-max-width" :href="origin">{{ $t('game.summary.toMenu') }}</a>
    </div>
</template>

<script>

import Background from './components/Background.vue'
import PlayerLeft from './components/PlayerLeft.vue'
import Logo from './components/Logo.vue'
import {useSignalR} from "@quangdao/vue-signalr";

export default {
    name: 'App',
    components: {
        PlayerLeft,
        Background,
        Logo
    },
    data() {
        return {
            origin: null,
            isError: true,
            signalr: null,
            lobbyType: '',
            lobby: {
                isDelayed: false,
                isMatchmakingTrouble: false,
            },
            users: [],
            isRandomAcceptable: false,
            redirectGame: null,
            worksExpire: null,
            worksLocalExpire: '',
            enemy: null
        }
    },
    methods: {
        error() {
            this.isError = true;
            this.users = [];
        },
        connectionError() {
            this.isError = true;
            this.users = [];
        },
        enemyRevoke() {
            this.enemy = null;
        },
        enemyFound(value) {
            this.enemy = value;
        },
        maintenance(value) {
            this.worksExpire = value.worksExpire;
            if (this.worksExpire)
                this.worksLocalExpire = new Date(this.worksExpire).toLocaleTimeString();
        },
        redirectToGame(value) {
            this.redirectGame = value;
            this.countdownComeback();
        },
        gameFound(value) {
            location.replace(this.origin + '/game.html?code=' + value.code);
        },
        countdownComeback() {
            let x = setInterval(async () => {
                let distance = new Date(this.redirectGame.gameExpire).getTime() - new Date().getTime();

                if (distance < 0) {
                    this.redirectGame = null;
                    clearInterval(x);
                    this.signalr.connection.start().catch();
                }
            }, 1000)
        },
        randomToggle() {
            fetch(this.origin + '/api/lobby/lobby/random',{
                method:  'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    isRandomAcceptable: !this.isRandomAcceptable
                })
            }).then(() => this.isRandomAcceptable = !this.isRandomAcceptable)
                .catch()
        },
        inviteUser(id) {
            fetch(this.origin + '/api/lobby/lobby/invite',{
                method:  'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: id
                })
            }).then().catch()
        },
        revokeInviteUser(id) {
            fetch(this.origin + '/api/lobby/lobby/invite/remove',{
                method:  'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: id
                })
            }).then().catch()
        },
        newUser(value) {
            console.log(value);
            this.users.push(value);  
        },
        removeUser(value) {
            console.log(value);
            const user = this.users.find((o) => o.userId === value.userId);
            if (user) {
                let index = this.users.indexOf(user);
                if (index > -1) {
                    this.users.splice(index, 1);
                }
            }
        },
        randomUpdate(value) {
            console.log(value);
            const user = this.users.find((o) => o.userId === value.userId);
            user.isRandomAcceptable = value.isRandomAcceptable;
        },
        inviteAdded(value) {
            console.log(value);
            const user = this.users.find((o) => o.userId === value.userId);
            user.isRequested = true;
        },
        inviteAchieved(value) {
            console.log(value);
            const user = this.users.find((o) => o.userId === value.userId);
            user.isInvited = true;
        },
        inviteRemoved(value) {
            console.log(value);
            const user = this.users.find((o) => o.userId === value.userId);
            user.isRequested = false;
        },
        inviteRevoked(value) {
            console.log(value);
            const user = this.users.find((o) => o.userId === value.userId);
            user.isInvited = false;
        }
    },
    mounted() {
        this.origin = window.location.origin;
        this.signalr = useSignalR();
        this.signalr.connectionSuccess(() => this.isError = false);
        this.signalr.connection.onclose(() => this.connectionError());
        this.signalr.on('Error', () => this.error());
        this.signalr.on('MaintenanceExpire', value => this.maintenance(value));
        this.signalr.on('EnemyRevoke', () => this.enemyRevoke());
        this.signalr.on('Delayed', () => this.lobby.isDelayed = true);
        this.signalr.on('MatchmakingTrouble', () => this.lobby.isMatchmakingTrouble = true);
        this.signalr.on('EnemyFound', value => this.enemyFound(value));
        this.signalr.on('RedirectToGame', value => this.redirectToGame(value));
        this.signalr.on('NewUser', value => this.newUser(value));
        this.signalr.on('RemoveUser', value => this.removeUser(value));
        this.signalr.on('RandomUpdate', value => this.randomUpdate(value));
        this.signalr.on('InviteAdded', value => this.inviteAdded(value));
        this.signalr.on('InviteAchieved', value => this.inviteAchieved(value));
        this.signalr.on('InviteRemoved', value => this.inviteRemoved(value));
        this.signalr.on('InviteRevoked', value => this.inviteRevoked(value));
        this.signalr.on('GameFound', value => this.gameFound(value));
        
        const urlParams = new URLSearchParams(window.location.search);
        this.lobbyType = urlParams.get('type');
    }
}
</script>

<style>
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

#app {
    font-family: "Futura PT Heavy", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    width: 100%;
    height: 100%;
}

#players-holder {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex-grow: 1;
}

.player-item-holder {
    position: relative;
    display: flex;
    width: 100%;
    height: 6vh;
    margin-bottom: 8px;
    justify-content: end;
    align-items: center;
}

.button-holder {
    display: flex;
    justify-content: end;
    padding-left: calc(6vh / 2 * 7 + 8px);
    width: 100%;
}

.scroll {
    overflow-y: auto;
    width: 100%;
    height: 100%;
    border: solid white;
    border-radius: 12px;
    margin-bottom: 4px;
    margin-left: 4px;
    margin-right: 4px;
    padding: 2px 4px 2px 4px;
}

#selector-holder {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 96vw;
    height: 48vh;
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
    justify-items: center;
    align-items: center;
    margin-top: 5vh;
}

#menu-title {
    font-size: 28px;
    color: white;
}

#low-holder {
    z-index: 999;
    display: flex;
    position: absolute;
    width: 100%;
    bottom: 8px;
    justify-content: center;
}

.button-small {
    font-size: 12px;
}

.button-grow {
    flex-grow: 1;
}

.button-max-width {
    max-width: unset;
}

.button {
    border: solid white;
    border-radius: 12px;
    margin-left: 4px;
    margin-right: 4px;
    padding: 6px 12px 6px 12px;
    color: white;
    max-width: unset;
    box-shadow: black 0 0 0;
    transition: 0.16s ease-in;
    backdrop-filter: blur(8px);
}

.button:hover {
    box-shadow: black 0 4px 8px;
    background: black;
    transition: 0.16s ease-out;
}

@media (min-width: 768px) {
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

    .player-item-holder {
        height: 8vh;
    }
    
    .button-holder {
        padding-left: calc(8vh / 2 * 7 + 16px);
    }
    
    #selector-holder {
        width: 56vw;
        height: 36vh;
    }

    #players-holder {
        padding: 6px 12px 6px 12px;
    }
    
    #menu-holder {
        margin-top: 5vh;
    }
}

@media (min-width: 1024px) {
    #selector-holder {
        width: 42vw;
        height: 40vh;
    }

    .button-max-width {
        max-width: 240px;
    }
    
    .button {
        border: solid white;
        border-radius: 12px;
        margin-left: 4px;
        margin-right: 4px;
        padding: 6px 12px 6px 12px;
        color: white;
        box-shadow: black 0 0 0;
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