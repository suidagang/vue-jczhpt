<template>
  <canvas ref="canvas" v-once></canvas>
</template>
<script>
export default {
  name: 'Xingkong',
  mounted() {
    const app = require('./anim').init(this.$refs.canvas);
    this.$on('hook:beforeDestroy', () => {
      app.clearAnimationFrame();
    });
  },
};
</script>
