<template>
  <div class="container">
    <ZrSvg type="right" size="60" color="#C71585" />
    <ZrSvg type="data9" size="60" color="#C71585" />
    <ZrSvg type="data72" size="60" color="#C71585" />
    <div class="container-box">
      <span
        class="container-box-circle"
        @mouseenter="showTip = true"
        @mouseleave="showTip = false"
        >!</span
      >
      <div v-show="showTip" class="tip">提示都会好的的内容</div>
    </div>
  </div>
</template>

<script>
import ZrSvg from "./ZrSvg.vue";
export default {
  data() {
    return {
      showTip: true,
    };
  },
  components: {
    ZrSvg,
  },
};
</script>

<style scoped lang="less">
.container {
  text-align: left;
  // overflow: hidden;
  &-box {
    height: 40px;
    line-height: 40px;
    width: 800px;
    background: pink;
    padding-left: 40px;
    &-circle {
      display: inline-block;
      height: 20px;
      width: 20px;
      border: 1px solid red;
      text-align: center;
      line-height: 20px;
      border-radius: 10px;
      box-sizing: border-box;
    }
  }
}
.tip {
  width: 900px;
  height: 117px;
  border: 1px solid rgba(7, 185, 254, 1);
  position: relative;
  left: -7px;
  top: -5px;
  background: #fff;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #4ee8b4;
  border-radius: 5px;
}

.tip:before,
.tip:after {
  content: "";
  display: block;
  border-width: 6px;
  position: absolute;
  top: -17px;
  left: 10px;
  height: 5px;
  border-style: dashed dashed solid;
  border-color: transparent transparent rgba(7, 185, 254, 1);
}

.tip:after {
  top: -16px;
  border-color: transparent transparent #fff;
}
</style>
