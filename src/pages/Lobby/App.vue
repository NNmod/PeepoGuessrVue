<template>
    <Background/>
    <div id="main-holder">
        <Logo/>
        <div id="menu-holder">
            <div id="menu-title">
                <div>Searching the game</div>
            </div>
            <div v-if="lobby.isDelayed">
                
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
            lobby: {
                isDelayed: false
            },
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
        gameFound(value) {
            console.log(value);
            location.replace('https://ppg.nnmod.com/game.html?code=' + value.code);
        }
    },
    mounted() {
        const signalr = useSignalR();
        signalr.connection.onclose(() => this.connectionError());
        signalr.on('Error', () => this.error());
        signalr.on('EnemyRevoke', () => this.enemyRevoke());
        signalr.on('EnemyFound', value => this.enemyFound(value));
        signalr.on('GameFound', value => this.gameFound(value));
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

#menu-title {
    font-size: 28px;
    color: white;
}

@media (min-width: 768px) {
    #menu-holder {
        margin-top: 5vh;
    }
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