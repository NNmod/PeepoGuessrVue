<template>
  <div id="holder" class="w-full h-full">
      <div id="shadow-holder" class="w-full h-full">
          <div id="radial-holder-down" class="w-full h-full">
              <div id="conic-holder-right-up" class="w-full h-full">
                  <div id="conic-holder-left-down" class="w-full h-full"></div>
              </div>
          </div>
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
</style>