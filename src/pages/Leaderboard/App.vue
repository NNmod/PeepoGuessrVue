<template>
  <Background/>
    <div id="holder">
        <div id="selector-holder">
            <div class="scroll">
                <div class="division-block-holder" v-if="d3Users.length > 0">
                    <div class="division-holder">
                        <img src="./assets/d3-preview.png" class="division-img">
                        <div v-if="d3Users.length > 6">GANDON DIVISION</div>
                    </div>
                    <ul id="players-holder" class="number" v-if="d3Users.length > 0">
                        <li class="number-item-holder" v-for="(user, index) in d3Users" :key="user.userId">
                            {{ (index + 1) }}
                        </li>
                    </ul>
                    <ul id="players-holder" v-if="d3Users.length > 0">
                        <li class="player-item-holder" v-for="user in d3Users" :key="user.userId">
                            <PlayerLeft :name="user.name" division-id="3" :score="user.score" :url="user.imageUrl"/>
                        </li>
                    </ul> 
                </div>
                <div class="division-block-holder" v-if="d2Users.length > 0">
                    <div class="division-holder">
                        <img src="./assets/d2-preview.png" class="division-img">
                        <div v-if="d2Users.length > 5">SMESHARIK DIVISION</div>
                    </div>
                    <ul id="players-holder" class="number" v-if="d2Users.length > 0">
                        <li class="number-item-holder" v-for="(user, index) in d2Users" :key="user.userId">
                            {{ (index + 1 + d3Users.length) }}
                        </li>
                    </ul>
                    <ul id="players-holder" v-if="d2Users.length > 0">
                        <li class="player-item-holder" v-for="user in d2Users" :key="user.userId">
                            <PlayerLeft :name="user.name" division-id="2" :score="user.score" :url="user.imageUrl"/>
                        </li>
                    </ul>
                </div>
                <div class="division-block-holder" v-if="d1Users.length > 0">
                    <div class="division-holder">
                        <img src="./assets/d1-preview.png" class="division-img">
                        <div v-if="d1Users.length > 5">NOVICHOK DIVISION</div>
                    </div>
                    <ul id="players-holder" class="number" v-if="d1Users.length > 0">
                        <li class="number-item-holder" v-for="(user, index) in d1Users" :key="user.userId">
                            {{ (index + 1 + d3Users.length + d2Users.length) }}
                        </li>
                    </ul>
                    <ul id="players-holder" v-if="d1Users.length > 0">
                        <li class="player-item-holder" v-for="user in d1Users" :key="user.userId">
                            <PlayerLeft :name="user.name" division-id="1" :score="user.score" :url="user.imageUrl"/>
                        </li>
                    </ul>
                </div>
                <div id="sticky-holder">
                    <div class="you-holder" v-if="this.user !== null">
                        <div class="your-division-holder">
                            <img src="./assets/d3-preview.png" class="your-division-img" v-if="this.user.divisionId === 3">
                            <img src="./assets/d2-preview.png" class="your-division-img" v-else-if="this.user.divisionId === 2">
                            <img src="./assets/d1-preview.png" class="your-division-img" v-else>
                        </div>
                        <div id="players-holder" class="your-number">
                            <div class="number-item-holder">
                                <div v-if="user.number !== null && user.number > 0">{{ user.number }}</div>
                                <div v-else>--</div>
                            </div>
                        </div>
                        <div id="players-holder">
                            <div class="player-item-holder">
                                <PlayerLeft :name="user.name" :division-id="user.divisionId" :score="user.score" :url="user.imageUrl"/>
                            </div>
                        </div>
                    </div>
                    <a class="button" href="https://ppg.nnmod.com">{{ $t('game.summary.toMenu') }}</a>
                </div>
            </div>
        </div>   
    </div>
  
</template>

<script>
import Background from './components/Background.vue'
import PlayerLeft from './components/PlayerLeft.vue';

export default {
    name: 'App',
    components: {
        Background,
        PlayerLeft
    },
    data() {
        return {
            d1Users: [],
            d2Users: [],
            d3Users: [],
            page: 0,
            pages: 0,
            isLoading: true,
            user: null
        }
    },
    methods: {
        loadUser() {
            fetch('https://ppg.nnmod.com/api/account/user')
                .then(response => response.json())
                .then(data => {
                    this.user = {
                        userId: data.id,
                        divisionId: data.divisionId,
                        name: data.twitchName,
                        score: data.score,
                        imageUrl: data.imageUrl
                    };

                    this.loadPage(true);
                })
                .catch(() => {
                    this.user = null;

                    this.loadPage(true);
                })
        },
        loadPage(isForced) {
            if (this.page >= this.pages && !isForced)
                return;
            this.isLoading = true;
            fetch('https://ppg.nnmod.com/api/account/user/leaderboard?page=' + this.page)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    this.pages = data.pages;
                    
                    for (const item of Array.from(data.items)) {
                        switch (item.divisionId) {
                            case 1:
                                this.d1Users.push({
                                    userId: item.id,
                                    name: item.twitchName,
                                    score: item.score,
                                    imageUrl: item.imageUrl
                                });
                                break;
                            case 2:
                                this.d2Users.push({
                                    userId: item.id,
                                    name: item.twitchName,
                                    score: item.score,
                                    imageUrl: item.imageUrl
                                });
                                break;
                            case 3:
                                this.d3Users.push({
                                    userId: item.id,
                                    name: item.twitchName,
                                    score: item.score,
                                    imageUrl: item.imageUrl
                                });
                                break;
                        }
                    }
                    
                    if (this.user) {
                        const d1User = this.d1Users.find(u => u.userId === this.user.userId);
                        if (d1User) {
                            const index = this.d1Users.indexOf(d1User);
                            this.user.number = this.d3Users.length + this.d2Users.length + index + 1;
                        }
                        const d2User = this.d2Users.find(u => u.userId === this.user.userId);
                        if (d2User) {
                            const index = this.d2Users.indexOf(d2User);
                            this.user.number = this.d3Users.length + index + 1;
                        }
                        const d3User = this.d3Users.find(u => u.userId === this.user.userId);
                        if (d3User) {
                            const index = this.d3Users.indexOf(d2User);
                            this.user.number = index + 1;
                        }
                    }
                    
                    this.page++;
                    this.isLoading = false;
                })
                .catch(() => {
                    this.isLoading = false;
                })
        }
    },
    mounted() {
        this.loadUser();
        
        window.onscroll = () => {
           if (window.scrollY >= (document.body.scrollHeight - document.body.clientHeight * 1.5) && !this.isLoading) {
               this.loadPage();
           }
        };
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

#holder {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
}

#selector-holder {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 98vw;
    height: 48vh;
}

.scroll {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 4px;
    margin-left: 4px;
    margin-right: 4px;
    padding: 2px 4px 2px 4px;
}

.division-block-holder {
    display: flex;
    margin: 4px;
}

.your-division-holder {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
}

.division-holder {
    display: flex;
    font-size: 3vh;
    color: white;
    align-items: center;
    justify-content: center;
    text-align: center;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    margin-right: 16px;
    border: white solid;
    border-left: 0;
    border-right: 0;
}

.your-division-img {
    height: 6vh;
}

.division-img {
    height: 6vh;
    transform: rotate(90deg);
}

.your-number {
    margin: 2px;
}

.number {
    border: solid white;
    border-radius: 12px;
}

#players-holder {
    padding: 6px 12px 6px 12px;
}
.player-item-holder {
    position: relative;
    display: flex;
    height: 6vh;
    width: calc(6vh / 2 * 7);
    margin-bottom: 8px;
    justify-content: end;
    align-items: center;
}

.number-item-holder {
    position: relative;
    display: flex;
    width: 100%;
    height: 6vh;
    min-width: 6vh;
    text-align: center;
    font-size: 3vh;
    color: white;
    margin-bottom: 8px;
    justify-content: center;
    align-items: center;
}

#sticky-holder {
    z-index: 101;
    position: sticky;
    display: flex;
    flex-direction: column;
    left: 0;
    right: 0;
    margin-top: 8px;
    bottom: 8px;
    width: 100%;
}

.you-holder {
    display: flex;
    justify-content: center;
    margin-bottom: 8px;
    backdrop-filter: blur(8px);
    height: calc(6vh + 24px);
    width: 100%;
    border: solid white;
    border-radius: 12px;
}

.button {
    border: solid white;
    border-radius: 12px;
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
    .scroll {
        width: auto;
    }
    
    .player-item-holder {
        height: 8vh;
        width: calc(8vh / 2 * 7);
    }
    
    .number-item-holder {
        height: 8vh;
        min-width: 8vh;
        font-size: 4vh;
    }

    .division-holder {
        font-size: 4vh;
    }

    .your-division-img {
        height: 8vh;
    }
    
    .division-img {
        height: 8vh;
        margin-right: 16px;
    }

    #selector-holder {
        width: 56vw;
        height: 100%;
    }

    #players-holder {
        padding: 6px 12px 6px 12px;
    }
    
    .you-holder {
        justify-content: end;
        height: calc(8vh + 24px);
    }
}

@media (min-width: 1024px) {
    #selector-holder {
        width: 42vw;
        height: 100%;
    }

    .button {
        border: solid white;
        border-radius: 12px;
        padding: 6px 12px 6px 12px;
        color: white;
        box-shadow: black 0 0 0;
    }
}
</style>