<template>
    <div id="holder">
        <div id="left-chevron-holder">
            <div id="name-holder">
                <span id="name">{{ name }}</span>
            </div>
            <div id="lcf-0" class="left-chevron-fade"></div>
            <div id="lcf-1" class="left-chevron-fade"></div>
            <div id="lcf-2" class="left-chevron-fade"></div>
        </div>
        <div id="avatar-holder">
            <img id="avatar" :src="url">
            <img id="avatar-border" :src="'https://ppg.cdn.nnmod.com/assets/borders/divisions/' + divisionId + '.png'">
            <span id="score">{{ score }}</span>
        </div>
        <div id="right-chevron-holder">
            <div id="stats-holder">
                <div>{{ $t('profile.wins') }}: {{ wins }}</div>
                <div>{{ $t('profile.division.' + divisionId) }}</div>
                <div>{{ $t('profile.upgrade') }}: {{ upgrade }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PlayerSummaryMain',
    props: {
        url: String,
        name: String,
        divisionId: Number,
        score: Number,
        wins: Number,
        upgrade: Number
    }
}
</script>

<style scoped>
#holder {
    display: flex;
    right: 8px;
    top: 8px;
    height: 12vh;
    max-height: 560px;
    width: calc(12vh / 2 * 7);
    max-width: 1960px;
    margin-left: 8px;
    margin-right: 8px;
    justify-content: center;
    transition: 0.16s ease-in-out;
}

#avatar-holder {
    position: relative;
    height: 12vh;
    width: 24vh;
    float: left;
}

#avatar {
    z-index: 98;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
    object-fit: contain;
    object-position: center;
    clip-path: polygon(50% 10%, 93% 25%, 93% 60%, 77% 77%, 50% 93%, 23% 77%, 7% 60%, 7% 25%);
}

#avatar-border {
    z-index: 99;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    object-fit: contain;
    object-position: center;
}

#score {
    z-index: 100;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    font-family: "Futura PT Heavy", sans-serif;
    text-align: center;
    margin-top: 90%;
    font-size: 2.4vh;
    line-height: 2.4vh;
    color: white;
    text-shadow: black 0 4px 8px;
    transition: 0.32s ease-in-out;
}

#left-chevron-holder {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-right-width: 1px;
    border-color: transparent;
}

#name-holder {
    display: flex;
    width: 100%;
    height: 24%;
    align-items: center;
    background: white;
    margin-top: 24%;
    margin-left: auto;
    margin-right: 0;
    clip-path: polygon(0 0, 100% 0%, 100% 100%, 12px 100%);
    box-shadow: #e9f1f1 0 0 72px 12px;
}

#name {
    width: calc((12vh / 2 * 7 - 12vh) / 2);
    max-width: 700px;
    margin-left: auto;
    font-family: "Futura PT Heavy", sans-serif;
    font-size: 2vh;
    line-height: 2vh;
    text-align: center;
    white-space: nowrap;
    color: black;
    overflow:hidden;
}

#right-chevron-holder {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    border-left-width: 1px;
    border-color: transparent;
}

#stats-holder {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 8%;
    font-size: 1.6vh;
    line-height: 1.6vh;
}

.left-chevron-fade {
    z-index: 1;
    width: 110%;
    background: white;
    margin-top: 2%;
    margin-right: 0;
    filter: blur(16px);
    box-shadow: #e9f1f1 0 0 72px 12px;
}

#lcf-0 {
    margin-left: 12px;
    opacity: 96%;
    height: 6%;
    clip-path: polygon(0 0, 100% 0%, 100% 100%, 4px 100%);
    animation: fadeInChevron0 8s ease-in 0.3s, blinkChevron0 3s ease-in-out infinite;
}

#lcf-1 {
    margin-left: 16px;
    opacity: 64%;
    height: 4%;
    clip-path: polygon(0 0, 100% 0%, 100% 100%, 3px 100%);
    animation: fadeInChevron1 8s ease-in 0.3s, blinkChevron1 3s ease-in-out infinite;
}

#lcf-2 {
    margin-left: 19px;
    opacity: 32%;
    height: 2%;
    clip-path: polygon(0 0, 100% 0%, 100% 100%, 2px 100%);
    animation: fadeInChevron2 8s ease-in 0.3s, blinkChevron2 3s ease-in-out infinite;
}

@media (min-width: 768px) {
    #holder {
        height: 24vh;
        width: calc(24vh / 2 * 7);
        transition: 0.16s ease-in-out;
    }

    #avatar-holder {
        height: 24vh;
        width: 48vh;
    }

    #score {
        margin-top: 95%;
        font-size: 4.4vh;
        line-height: 4.4vh;
    }
    
    #stats-holder {
        font-size: 3vh;
        line-height: 3vh;
    }

    #name {
        width: calc((24vh / 2 * 7 - 24vh) / 2);
        font-size: 4vh;
        line-height: 4vh;
    }
}

@media (min-width: 1024px) {
    #holder {
        height: 32vh;
        width: calc(32vh / 2 * 7);
        transition: 0.16s ease-in-out;
    }

    #avatar-holder {
        height: 32vh;
        width: 64vh;
    }

    #score {
        margin-top: 97%;
        font-size: 5.4vh;
        line-height: 5.4vh;
    }
    
    #stats-holder {
        font-size: 4.4vh;
        line-height: 4.4vh;
    }

    #name {
        width: calc((32vh / 2 * 7 - 32vh) / 2);
        font-size: 5vh;
        line-height: 5vh;
    }
    
    #name-holder {
        clip-path: polygon(0 0, 100% 0%, 100% 100%, 32px 100%);
    }

    #lcf-0 {
        margin-left: 36px;
        clip-path: polygon(0 0, 100% 0%, 100% 100%, 8px 100%);
    }

    #lcf-1 {
        margin-left: 48px;
        clip-path: polygon(0 0, 100% 0%, 100% 100%, 6px 100%);
    }

    #lcf-2 {
        margin-left: 58px;
        clip-path: polygon(0 0, 100% 0%, 100% 100%, 3px 100%);
    }
}

@keyframes fadeInChevron0{
    0%{opacity: 0;}
    70%{opacity: 96%}
    100%{opacity: 96%}
}

@keyframes fadeInChevron1{
    0%{opacity: 0;}
    85%{opacity: 64%;}
    100%{opacity: 64%;}
}

@keyframes fadeInChevron2{
    0%{opacity: 0;}
    100%{opacity: 32%;}
}

@keyframes blinkChevron0{
    0%{opacity: 96%;}
    30%{opacity: 100%;}
    60%{opacity: 96%;}
    100%{opacity: 96%;}
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