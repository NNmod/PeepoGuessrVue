<template>
    <div id="privacy">
        <div id="content-holder">
            <div class="content-break"/>
            <div>
                <div class="content">
                    <span class="text-center">{{ $t('home.privacy.title') }}</span>
                    <span class="text-break"/>
                    <span class="text-left">{{ $t('home.privacy.0') }}</span>
                    <span class="text-break"/>
                    <span class="text-left">{{ $t('home.privacy.1.title') }}</span>
                    <span class="text-left">{{ $t('home.privacy.1.text') }}</span>
                    <span class="text-break"/>
                    <span class="text-left">{{ $t('home.privacy.2.title') }}</span>
                    <span class="text-left">{{ $t('home.privacy.2.text') }}</span>
                    <span class="text-break"/>
                    <span class="text-left">{{ $t('home.privacy.3.title') }}</span>
                    <span class="text-left">{{ $t('home.privacy.3.text') }}</span>
                    <span class="text-break"/>
                    <span class="text-left">{{ $t('home.privacy.4.title') }}</span>
                    <span class="text-left">{{ $t('home.privacy.4.text') }}</span>
                    <span class="text-break"/>
                    <span class="text-left">{{ $t('home.privacy.5.title') }}</span>
                    <span class="text-left">{{ $t('home.privacy.5.text.0') }}</span>
                    <span class="text-left">- {{ $t('home.privacy.5.text.1') }}</span>
                    <span class="text-left">- {{ $t('home.privacy.5.text.2') }}</span>
                    <span class="text-break"/>
                    <span class="text-left">{{ $t('home.privacy.6.title') }}</span>
                    <span class="text-left">{{ $t('home.privacy.6.text') }}</span>
                    <span class="text-break"/>
                    <span class="text-left">{{ $t('home.privacy.7.title') }}</span>
                    <span class="text-left">{{ $t('home.privacy.7.text') }}</span>
                    <span class="text-break"/>
                    <span class="text-left">{{ $t('home.privacy.8.title') }}</span>
                    <span class="text-left">{{ $t('home.privacy.8.text') }}</span>
                    <span class="text-break"/>
                    <span class="text-left">{{ $t('home.privacy.9.title') }}</span>
                    <span class="text-left">{{ $t('home.privacy.9.text') }}</span>
                    <span class="text-break"/>
                    <span class="text-left">{{ $t('home.privacy.10.title') }}</span>
                    <span class="text-left">{{ $t('home.privacy.10.text') }}</span>
                    <span class="text-break"/>
                    <span class="text-left">{{ $t('home.privacy.11.title') }}</span>
                    <span class="text-left">{{ $t('home.privacy.11.text') }}</span>
                    <span class="text-break"/>
                    <span class="text-left">{{ $t('home.privacy.contact.title') }}</span>
                    <span class="text-left">{{ $t('home.privacy.contact.text') }}communication@nnmod.com.</span>
                    <span class="text-break"/>
                    <span class="text-left">{{ $t('home.privacy.date') }}</span>
                </div>
            </div>
            <div class="content-break">
                <button id="privacy-close-button" class="button" @click="$parent.privacyToggle">{{ $t('close') }}</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PrivacyPolicy'
}
</script>

<style scoped>

#privacy {
    z-index: 105;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    overflow-y: auto;
}

#privacy-close-button {
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