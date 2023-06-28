<template>
    <Background/>
    <div id="main-holder">
        <Logo/>
        <div id="menu-holder">
            <div id="menu-title">
                <div v-if="lobby.isDelayed">Searching delayed. The server is full. Please wait</div>
                <div v-else-if="redirectGame !== null">Searching canceled. You already have active game</div>
                <div v-else>Searching the game</div>
            </div>
            <div v-if="redirectGame !== null">
                <div class="headline-holder">
                    <a class="headline-flash" :href="'https://ppg.nnmod.com/game.html?code=' + this.redirectGame.gameCode">{{ $t('home.menu.comeback') }}</a>
                </div>
                <div id="menu-title">
                    or wait until the game is over
                </div>
            </div>
            <div v-else>
                <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
        </div>
    </div>
</template>

<script>

import Background from './components/Background.vue'
import Logo from './components/Logo.vue'
import {useSignalR} from "@quangdao/vue-signalr";

export default {
    name: 'App',
    components: {
        Background,
        Logo
    },
    data() {
        return {
            signalr: null,
            lobby: {
                isDelayed: false
            },
            redirectGame: null,
            enemy: null
        }
    },
    methods: {
        enemyRevoke() {
            this.enemy = null;
        },
        enemyFound(value) {
            this.enemy = value;
        },
        redirectToGame(value) {
            this.redirectGame = value;
            this.countdownComeback();
        },
        gameFound(value) {
            location.replace('https://ppg.nnmod.com/game.html?code=' + value.code);
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
        }
    },
    mounted() {
        this.signalr = useSignalR();
        this.signalr.connection.onclose(() => this.connectionError());
        this.signalr.on('Error', () => this.error());
        this.signalr.on('EnemyRevoke', () => this.enemyRevoke());
        this.signalr.on('Delayed', () => this.lobby.isDelayed = true);
        this.signalr.on('EnemyFound', value => this.enemyFound(value));
        this.signalr.on('RedirectToGame', value => this.redirectToGame(value));
        this.signalr.on('GameFound', value => this.gameFound(value));
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

#menu-title {
    font-size: 28px;
    color: white;
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
    
    #menu-holder {
        margin-top: 5vh;
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