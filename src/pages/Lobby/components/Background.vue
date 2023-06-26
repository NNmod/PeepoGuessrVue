<template>
  <div id="holder" class="w-full h-full">
      <div id="shadow-holder" class="w-full h-full">
          <div id="radial-holder-down" class="w-full h-full">
              <div id="conic-holder-right-up" class="w-full h-full">
                  <div id="conic-holder-left-down" class="w-full h-full"></div>
              </div>
          </div>
      </div>
      <div id="animation-holder" class="w-full h-full hidden lg:block">
          <div class='light x1'></div>
          <div class='light x2'></div>
          <div class='light x3'></div>
          <div class='light x4'></div>
          <div class='light x5'></div>
          <div class='light x6'></div>
          <div class='light x7'></div>
          <div class='light x8'></div>
          <div class='light x9'></div>
          <div class='light x0'></div>
      </div>
  </div>
</template>

<script>
export default {
    name: 'AppBackground'
}
</script>

<style scoped>

#holder {
    position: fixed;
    z-index: -1;
    background-image: linear-gradient(to top, #790C79, #18309C);
}

#shadow-holder {
    background: rgba(0, 0, 0, 48%);
}

#radial-holder-down {
    opacity: 100%;
    background-image: radial-gradient(circle at 50% 200%, black, rgba(0, 0, 0, 0));
}

#conic-holder-right-up {
    opacity: 32%;
    background-image: conic-gradient(at 100% 0%, blueviolet, rgba(0, 0, 0, 0), blueviolet);
}

#conic-holder-left-down {
    opacity: 48%;
    background-image: conic-gradient(at 0% 100%, black, black);
}

#animation-holder {
    opacity: 100%;
}

.light {
    position: absolute;
    z-index: -1;
    width: 0;
    opacity: .1;
    background-color: black;
    box-shadow: #e9f1f1 0 0 72px 12px;
    top: 100vh;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
}

.x1{
    animation: floatUp 6s infinite linear;
    transform: scale(2.0);
    left: 44%;
}

.x2{
    animation: floatDown 9s infinite linear;
    transform: scale(2.6);
    left: -54%;
}

.x3{
    animation: floatUp 4.5s infinite linear;
    transform: scale(2.5);
    left: 68%;
}

.x4{
    animation: floatUp 3.5s infinite linear;
    transform: scale(2.2);
    left: -72%;
}

.x5{
    animation: floatDown 8s infinite linear;
    transform: scale(3.2);
    left: -110%;
}

.x6{
    animation: floatDown 4s infinite linear;
    transform: scale(2.8);
    left: 120%;
}

.x7{
    animation: floatUp 5.3s infinite linear;
    transform: scale(4.2);
    left: -92%;
}

.x8{
    animation: floatUp 3.7s infinite linear;
    transform: scale(2.7);
    left: 82%;
}

.x9{
    animation: floatUp 7.1s infinite linear;
    transform: scale(2.9);
    left: 0;
}

.x9{
    animation: floatDown 8.8s infinite linear;
    transform: scale(2.3);
    left: 0;
}

@keyframes floatUp{
    0%{top: 100vh; left: 0; opacity: 0;}
    25%{opacity: .3;}
    50%{top: 0; left: 0; opacity: .1;}
    75%{opacity: .3;}
    100%{top: -100vh; opacity: 0;}
}

@keyframes floatDown{
    0%{top: -100vh; opacity: 0;}
    25%{opacity: .3;}
    50%{top: 0; left: 0; opacity: .1;}
    75%{opacity: .3;}
    100%{top: 100vh; left: 0; opacity: 0;}
}

</style>