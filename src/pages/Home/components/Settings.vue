<template>
    <div id="holder">
        <div id="content-holder">
            <div class="content-break"/>
            <div>
                <div class="content">
                    <span class="text-center">{{ $t('settings.language') }}</span>
                    <div id="language-holder">
                        <div class="radio-holder">
                            <input type="radio" v-bind:checked="$parent.settings.language === 'en'" @input="$parent.languageChange('en')">
                            <div>English</div>
                        </div>
                        <div class="radio-holder">
                            <input type="radio" v-bind:checked="$parent.settings.language === 'ru'" @input="$parent.languageChange('ru')">
                            <div>Русский</div>
                        </div>
                    </div>
                    <span class="text-break"/>
                    <span class="text-center">{{ $t('settings.effects') }}</span>
                    <input id="slider" type="range" min="0" max="100" step="1" v-model="$parent.settings.effectsVol" @input="$parent.effectsVolumeChange">
                    <span class="text-break"/>
                    <span class="text-center">{{ $t('settings.music') }}</span>
                    <input id="slider" type="range" min="0" max="100" step="1" v-model="$parent.settings.musicVol" @input="$parent.musicVolumeChange">
                    <span class="text-break"/>
                </div>
            </div>
            <div class="content-break">
                <button id="close-button" class="button" @click="$parent.settingsToggle">{{ $t('close') }}</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SettingsMenu'
}
</script>

<style scoped>

#holder {
    z-index: 105;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    overflow-y: auto;
}

#close-button {
    margin-bottom: 8px;
}

#content-holder {
    display: grid;
    grid-template-rows: 1fr auto 1fr;
    height: 100%;
    flex-direction: column;
    margin-left: 8px;
    margin-right: 8px;
    width: auto;
}

#language-holder {
    display: flex;
    flex-direction: column;
    align-self: center;
    width: 100%;
    justify-content: center;
}

.radio-holder {
    display: flex;
}

.content {
    flex-grow: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 8px;
    margin-bottom: 8px;
    padding: 8px 12px 8px 12px;
    background: rgba(0, 0, 0, 0.5);
    border: solid;
    backdrop-filter: blur(8px);
    color: white;
    border-radius: 24px;
}

.content-break {
    flex-grow: 2;
    min-height: 15%;
}

.text-break {
    height: 16px;
}

.text-center {
    font-size: 20px;
    margin-bottom: 8px;
    text-align: center;
}

.text-left {
    text-align: left;
}

@media (min-width: 1024px) {
    #content-holder {
        margin-left: auto;
        margin-right: auto;
        width: 50%;
    }

    #language-holder {
        width: 50%;
        flex-direction: row;
        justify-content: space-between;
    }
    
    .content-break {
        min-height: 8px;
    }
}

</style>