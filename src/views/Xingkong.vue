<template>
  <div class="container">
    <xingkong class="xingkong" />
  </div>
</template>

<script>
import xingkong from "./xingkong1.vue";
export default {
  data() {
    return {};
  },
  components: { xingkong },
};
</script>

<style scoped lang="less">
.container {
  position: relative;
  width: 1920px;
  height: 900px;
  //   background: url("~@/pages/index/assets/dphome/bg.png") no-repeat;
  background: rgb(57, 5, 139);
  //   overflow: hidden;
}
.xingkong {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
