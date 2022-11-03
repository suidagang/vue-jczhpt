<template>
  <div id="app">
    <vue-ruler-tool
      :content-layout="{ left: 200, top: 100 }"
      :is-scale-revise="true"
      :v-model="presetLine"
    >
      <div class="test"></div>
    </vue-ruler-tool>
  </div>
</template>

<script>
import VueRulerTool from "vue-ruler-tool";
export default {
  name: "app",
  components: {
    VueRulerTool,
  },
  data() {
    return {
      presetLine: [
        { type: "l", site: 100 },
        { type: "v", site: 200 },
      ],
    };
  },
};
</script>