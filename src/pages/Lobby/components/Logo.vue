<template>
  <div id="holder">
      <div id="left-chevron-holder">
          <div id="left-name-holder">
              <span id="left-name">PEEPO</span>
          </div>
          <div id="lcf-0" class="left-chevron-fade"></div>
          <div id="lcf-1" class="left-chevron-fade"></div>
          <div id="lcf-2" class="left-chevron-fade"></div>
      </div>
      <img src="../assets/ppg-logo.png" alt="Logo" class="h-full object-contain" style="z-index: 2">
      <div id="right-chevron-holder">
          <div id="right-name-holder">
              <div id="right-name">GUESSR</div>
          </div>
          <div id="rcf-0" class="right-chevron-fade"></div>
          <div id="rcf-1" class="right-chevron-fade"></div>
          <div id="rcf-2" class="right-chevron-fade"></div>
      </div>
  </div>
</template>

<script>
export default {
    name: 'MainLogo'
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

#left-chevron-holder {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-right-width: 1px;
    border-color: transparent;
}

#left-name-holder {
    z-index: 1;
    display: flex;
    align-items: center;
    width: 100%;
    height: 24%;
    background: white;
    margin-top: 24%;
    margin-left: auto;
    margin-right: 0;
    clip-path: polygon(0 0, 100% 0%, 100% 100%, 32px 100%);
    box-shadow: #e9f1f1 0 0 72px 12px;
}

#right-chevron-holder {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-left-width: 1px;
    border-color: transparent;
}

#right-name-holder {
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    height: 24%;
    background: white;
    margin-top: 24%;
    clip-path: polygon(0 0, 100% 0%, calc(100% - 32px) 100%, 0% 100%);
    box-shadow: #e9f1f1 0 0 72px 12px;
}

#left-name {
    display: flex;
    vertical-align: middle;
    text-align: center;
    margin-left: 42%;
    font-family: "Futura PT Heavy", sans-serif;
    font-size: 16px;
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
    margin-left: 36px;
    opacity: 96%;
    height: 6%;
    clip-path: polygon(0 0, 100% 0%, 100% 100%, 8px 100%);
    animation: fadeInChevron0 8s ease-in 0.3s, blinkChevron0 3s ease-in-out infinite;
}

#lcf-1 {
    margin-left: 48px;
    opacity: 64%;
    height: 4%;
    clip-path: polygon(0 0, 100% 0%, 100% 100%, 6px 100%);
    animation: fadeInChevron1 8s ease-in 0.3s, blinkChevron1 3s ease-in-out infinite;
}

#lcf-2 {
    margin-left: 58px;
    opacity: 32%;
    height: 2%;
    clip-path: polygon(0 0, 100% 0%, 100% 100%, 3px 100%);
    animation: fadeInChevron2 8s ease-in 0.3s, blinkChevron2 3s ease-in-out infinite;
}

#right-name {
    display: flex;
    vertical-align: middle;
    text-align: center;
    margin-right: 42%;
    font-family: "Futura PT Heavy", sans-serif;
    font-size: 16px;
}

.right-chevron-fade {
    z-index: 1;
    width: 110%;
    background: white;
    margin-top: 2%;
    margin-right: auto;
    filter: blur(16px);
    box-shadow: #e9f1f1 0 0 72px 12px;
}

#rcf-0 {
    margin-left: calc(-36px - 10%);
    opacity: 96%;
    height: 6%;
    clip-path: polygon(0 0, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
    animation: fadeInChevron0 8s ease-in 0.3s, blinkChevron0 3s ease-in-out infinite;
}

#rcf-1 {
    margin-left: calc(-48px - 10%);
    opacity: 64%;
    height: 4%;
    clip-path: polygon(0 0, 100% 0%, calc(100% - 6px) 100%, 0% 100%);
    animation: fadeInChevron1 8s ease-in 0.3s, blinkChevron1 3s ease-in-out infinite;
}

#rcf-2 {
    margin-left: calc(-58px - 10%);
    opacity: 32%;
    height: 2%;
    clip-path: polygon(0 0, 100% 0%, calc(100% - 3px) 100%, 0% 100%);
    animation: fadeInChevron2 8s ease-in 0.3s, blinkChevron2 3s ease-in-out infinite;
}

@media (min-width: 768px) {
    #holder {
        height: 24vh;
        width: calc(24vh / 2 * 7);
        transition: 0.16s ease-in-out;
    }

    #left-name {
        margin-left: 36%;
        font-size: 4vh;
    }

    #right-name {
        margin-left: 36%;
        font-size: 4vh;
    }
}

@media (min-width: 1024px) {
    #holder {
        height: 32vh;
        width: calc(32vh / 2 * 7);
        transition: 0.16s ease-in-out;
    }

    #left-name {
        font-size: 5vh;
    }

    #right-name {
        font-size: 5vh;
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