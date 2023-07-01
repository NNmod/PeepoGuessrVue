<template>
    <div id="holder">
        <div id="player-holder">
            <div id="avatar-holder">
                <img id="avatar" :src="url">
                <img id="avatar-border" :src="'https://ppg.cdn.nnmod.com/assets/borders/divisions/' + divisionId + '.png'">
                <span id="health">{{ score }}</span>
            </div>
            <div class="tooltip">{{ name }}</div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'PlayerSummaryOther',
    props: {
        url: String,
        score: Number,
        name: String,
        divisionId: Number
    }
}
</script>

<style scoped>
.fade-in {
    opacity: 1;
}

.fade-out {
    opacity: 0;
}

#holder {
    padding: 0.5vh;
}

#player-holder {
    display: flex;
    height: 6vh;
    max-height: 140px;
    width: calc(6vh * 0.847);
    max-width: calc(140px * 0.847);
    font-size: 12px;
    justify-content: center;
    transition: 0.16s ease-in-out;
}

#player-holder .tooltip {
    visibility: hidden;
    min-width: 8vh;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    text-align: center;
    padding: 4px 8px;
    border-radius: 8px;
    position: absolute;
    z-index: 999;
}

#player-holder:hover .tooltip {
    visibility: visible;
}

#avatar-holder {
    position: relative;
    height: 6vh;
    width: calc(6vh * 0.847);
    float: left;
}

#avatar {
    z-index: 98;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    padding: 7%;
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

#health {
    z-index: 100;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    font-family: "Futura PT Heavy", sans-serif;
    text-align: center;
    margin-top: 75%;
    color: white;
    text-shadow: black 0 4px 8px;
    transition: 0.32s ease-in-out;
}

@media (min-width: 768px) {
    .zoom-in {
        font-size: 2.5vh;
    }

    .zoom-out {
        font-size: 2vh;
    }

    #player-holder {
        height: 8vh;
        width: calc(8vh * 0.847);
        font-size: 24px;
        transition: 0.16s ease-in-out;
    }

    #player-holder .tooltip {
        min-width: 10vh;
    }

    #avatar-holder {
        height: 8vh;
        width: calc(8vh * 0.847);
    }

    #health {
        margin-top: 80%;
    }
}

.right-chevron-fade {
    z-index: 1;
    width: 100%;
    height: 6%;
    background: white;
    margin-top: 2%;
    margin-left: -18px;
    filter: blur(16px);
    clip-path: polygon(0 0, 100% 0%, calc(100% - 4px) 100%, 0% 100%);
    box-shadow: #e9f1f1 0 0 72px 12px;
}

.rcf-0 {
    opacity: 96%;
}

.rcf-1 {
    margin-left: -24px;
    opacity: 64%;
    height: 4%;
    clip-path: polygon(0 0, 100% 0%, calc(100% - 2px) 100%, 0% 100%);
    animation: blinkChevron1 3s ease-in-out infinite;
}

.rcf-2 {
    margin-left: -30px;
    opacity: 32%;
    height: 2%;
    clip-path: polygon(0 0, 100% 0%, calc(100% - 1px) 100%, 0% 100%);
    animation: blinkChevron2 3s ease-in-out infinite;
}

@keyframes blinkChevron1{
    0%{opacity: 64%;}
    40%{opacity: 70%;}
    80%{opacity: 64%;}
    100%{opacity: 64%;}
}

@keyframes blinkChevron2{
    0%{opacity: 32%;}
    50%{opacity: 40%;}
    100%{opacity: 32%;}
}
</style>