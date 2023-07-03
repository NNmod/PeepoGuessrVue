<template>
  <div id="get-started">
      <div id="content-holder">
          <div class="content-break"/>
          <div>
              <div class="content">
                  <span class="text-center">{{ $t('home.getStarted.login.title') }}</span>
                  <span class="text-left">{{ $t('home.getStarted.login.1') }}</span>
                  <span class="text-left">{{ $t('home.getStarted.login.2') }}</span>
              </div>
              <div class="content">
                  <span class="text-center">{{ $t('home.getStarted.requirements.title') }}</span>
                  <span class="text-left">{{ $t('home.getStarted.requirements.1') }}</span>
                  <span class="text-break"/>
                  <span class="text-left">{{ $t('home.getStarted.requirements.2') }}</span>
                  <span class="text-left">Microsoft Edge: <a href="https://www.computerhope.com/issues/ch002154.htm#edge">computerhope.com</a></span>
                  <span class="text-left">Google Chrome: <a href="https://www.computerhope.com/issues/ch002154.htm#chrome">computerhope.com</a></span>
                  <span class="text-left">Opera / Opera GX: <a href="https://www.computerhope.com/issues/ch002154.htm#opera">computerhope.com</a></span>
                  <span class="text-left">Mozilla Firefox: <a href="https://www.computerhope.com/issues/ch002154.htm#firefox">computerhope.com</a></span>
              </div>
              <div class="content">
                  <span class="text-center">{{ $t('home.getStarted.play.title') }}</span>
                  <span class="text-break"/>
                  <span class="text-center">{{ $t('home.getStarted.play.singleplayer.title') }}</span>
                  <span class="text-left">{{ $t('home.getStarted.play.singleplayer.1') }}</span>
                  <span class="text-left">{{ $t('home.getStarted.play.singleplayer.2') }}</span>
                  <span class="text-break"/>
                  <span class="text-center">{{ $t('home.getStarted.play.multiplayer.title') }}</span>
                  <span class="text-left">{{ $t('home.getStarted.play.multiplayer.1') }}</span>
                  <span class="text-left">{{ $t('home.getStarted.play.multiplayer.2') }}</span>
                  <span class="text-break"/>
                  <span class="text-center">{{ $t('home.getStarted.play.partyBattle.title') }}</span>
                  <span class="text-left">{{ $t('home.getStarted.play.partyBattle.1') }}</span>
                  <span class="text-left">{{ $t('home.getStarted.play.partyBattle.2') }}</span>
              </div>
          </div>
          <div class="content-break">
              <button id="get-started-close-button" class="button" @click="$parent.getStartedToggle">{{ $t('close') }}</button>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    name: 'GetStarted'
}
</script>

<style scoped>

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