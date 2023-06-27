<template>
    <div id="player-holder">
        <div id="avatar-holder">
            <img id="avatar" :src="url">
            <img id="avatar-border" :src="'https://ppg.cdn.nnmod.com/assets/borders/divisions/' + divisionId + '.png'">
            <span id="health">{{ score }}</span>
        </div>
        <div id="chevrons-holder">
            <div id="right-chevron-holder">
                <div id="name-holder">
                    <span id="name">{{ name }}</span>
                </div>
            </div>
            <div class="right-chevron-fade rcf-0"></div>
            <div class="right-chevron-fade rcf-1"></div>
            <div class="right-chevron-fade rcf-2"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PlayerLeft',
    props: {
        url: String,
        score: Number,
        name: String,
        divisionId: Number
    }
}
</script>

<style scoped>

#player-holder {
    position: absolute;
    display: flex;
    left: 2px;
    top: 4px;
    height: 6vh;
    max-height: 140px;
    width: calc(6vh / 2 * 7);
    max-width: 490px;
    justify-content: center;
    transition: 0.16s ease-in-out;
}

#avatar-holder {
    position: relative;
    height: 6vh;
    width: calc(6vh * 1.1);
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
    font-size: 1.5vh;
    text-align: center;
    margin-top: 75%;
    color: white;
    text-shadow: black 0 4px 8px;
}

#chevrons-holder {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-left-width: 1px;
    border-color: transparent;
}

#right-chevron-holder {
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: end;
    width: 100%;
    height: 28%;
    background: white;
    margin-top: 10%;
    margin-left: auto;
    margin-right: 0;
    clip-path: polygon(0 0, 100% 0%, calc(100% - 16px) 100%, 0% 100%);
    box-shadow: #e9f1f1 0 0 72px 12px;
}

#name-holder {
    display: flex;
    width: 100%;
    height: 100%;
    padding-left: 2px;
    padding-right: 14px;
    justify-content: center;
    align-items: center;
}

#name {
    width: calc(6vh / 2 * 7 - 12px - 6vh);
    max-width: 344px;
    font-family: "Futura PT Heavy", sans-serif;
    font-size: 2vh;
    text-align: center;
    white-space: nowrap;
    overflow:hidden;
}

@media (min-width: 768px) {
    #player-holder {
        left: 8px;
        top: 8px;
        height: 8vh;
        width: calc(8vh / 2 * 7);
        transition: 0.16s ease-in-out;
    }

    #avatar-holder {
        height: 8vh;
        width: calc(8vh * 1.1);
    }

    #health {
        margin-top: 80%;
        font-size: 2vh;
    }
    
    #name {
        width: calc(8vh / 2 * 7 - 8px - 8vh);
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