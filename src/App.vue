<template>
  <fragment>
    <div id="app">
      <router-view />
    </div>
  </fragment>
</template>
<script>
export default {
  mounted() {
    // this.setFontSize();
  },
  methods: {
    // setFontSize: function () {
    //   var whdef = 10 / 1366;
    //   var wH = window.innerHeight; // 当前窗口的高度
    //   var wW = window.innerWidth; // 当前窗口的宽度
    //   var rem = wW * whdef; // 以默认比例值乘以当前窗口宽度,得到该宽度下的相应FONT-SIZE值
    //   // $('html').css('font-size', rem + "px");
    //   document.documentElement.style.fontSize = rem + "px";
    //   console.log(whdef, wH, wW, rem);
    // },
  },
};
</script>
<style lang="less">
* {
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
