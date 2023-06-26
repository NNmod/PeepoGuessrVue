<template>
    <div id="player-holder">
        <div id="avatar-holder">
            <img id="avatar" src="../assets/ppg-bg.jpg">
            <img id="avatar-border" src="../assets/ppg-border.png">
            <span id="round">{{ roundDurationMinutes }}:<div v-if="roundDurationSeconds < 10">0</div>{{ roundDurationSeconds }}</span>
            <span id="health">x{{ multiplier }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BattleMenu',
    props: {
        roundDurationMinutes: Number,
        roundDurationSeconds: Number,
        multiplier: Number
    }
}
</script>

<style scoped>

#player-holder {
    position: absolute;
    display: flex;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    top: 4vh;
    height: 8vh;
    max-height: 140px;
    width: calc(8vh * 0.9);
    max-width: 126px;
    justify-content: center;
    transition: 0.16s ease-in-out;
}

#avatar-holder {
    position: relative;
    height: 8vh;
    width: calc(6vh * 1.1);
    float: left;
}

#avatar {
    z-index: 98;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    object-fit: cover;
    object-position: center;
    clip-path: polygon(50% 10%, 93% 25%, 93% 60%, 77% 77%, 50% 93%, 23% 77%, 7% 60%, 7% 25%);
}

#avatar-border {
    z-index: 99;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

#round {
    z-index: 100;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    font-family: "Futura PT Heavy", sans-serif;
    font-size: 2.25vh;
    color: white;
    text-shadow: black 0 4px 6px;
}

#health {
    z-index: 100;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    font-family: "Futura PT Heavy", sans-serif;
    font-size: 1.76vh;
    text-align: center;
    margin-top: 75%;
    color: white;
    text-shadow: black 0 4px 8px;
}

@media (min-width: 460px) {
    #player-holder {
        top: 4px;
    }
}

@media (min-width: 768px) {
    #player-holder {
        top: 8px;
        height: 10vh;
        width: calc(10vh * 0.9);
        transition: 0.16s ease-in-out;
    }

    #avatar-holder {
        height: 10vh;
        width: calc(8vh * 1.1);
    }

    #round {
        font-size: 2.8vh;
    }
    
    #health {
        margin-top: 80%;
        font-size: 2.2vh;
    }
}

</style>