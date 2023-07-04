<template>
    <div id="get-started">
        <div id="content-holder">
            <div class="content-break"/>
            <div>
                <div class="content">
                    <span class="text-center">{{ $t('home.credentials.title') }}</span>
                    <span class="text-break"/>
                    <div class="flex">
                        <div class="preview-holder">
                            <img class="preview" src="../assets/idea.svg"/>
                        </div>
                        <div class="flex-col">
                            <span class="text-left">{{ $t('home.credentials.idea.title') }}</span>
                            <span class="text-break"/>
                            <span class="text-left">{{ $t('home.credentials.idea.person') }}</span>
                        </div>
                    </div>
                    <span class="text-break"/>
                    <div class="flex">
                        <div class="preview-holder">
                            <img class="preview" src="../assets/code.svg"/>
                        </div>
                        <div class="flex-col">
                            <span class="text-left">{{ $t('home.credentials.dev.title') }}</span>
                            <span class="text-break"/>
                            <span class="text-left">{{ $t('home.credentials.dev.person') }}</span>
                        </div>
                    </div>
                    <span class="text-break"/>
                    <div class="flex">
                        <div class="preview-holder">
                            <img class="preview" src="../assets/thanks.svg"/>
                        </div>
                        <div class="flex-col">
                            <span class="text-left">{{ $t('home.credentials.thanks.title') }}</span>
                            <span class="text-break"/>
                            <span class="text-left">{{ $t('home.credentials.thanks.persons.1') }}</span>
                            <span class="text-left">{{ $t('home.credentials.thanks.persons.2') }}</span>
                        </div>
                    </div>
                    <span class="text-break"/>
                </div>
            </div>
            <div class="content-break">
                <button id="get-started-close-button" class="button" @click="$parent.credentialsToggle">{{ $t('close') }}</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CredentialsMenu'
}
</script>

<style scoped>

.flex {
    display: flex;
}

.flex-col {
    display: flex;
    flex-direction: column;
}

.preview-holder {
    margin-right: 8px;
    padding: 4px;
    background: rgba(255, 255, 255, 0.5);
    border: solid white;
    border-radius: 12px;
    backdrop-filter: blur(8px);
}

.preview {
    width: 88px;
    height: 96px;
    object-fit: contain;
    filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(288deg) brightness(102%) contrast(102%);
}

#get-started {
    z-index: 105;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    overflow-y: auto;
}

#get-started-close-button {
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

    .content-break {
        min-height: 8px;
    }
}

</style>