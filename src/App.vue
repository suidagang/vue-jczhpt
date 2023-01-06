<template>
  <fragment>
    <div id="app">
      <div class="app-list-arr">
        <div
          class="menu-list"
          v-for="item in routerList"
          :key="item.path"
          @click="goPage(item)"
          :class="{ active: item.active }"
        >
          {{ item.name }}
        </div>
      </div>
      <!-- slideInLeft -->
      <!-- animate__animated animate__rotateInUpLeft -->
      <transition
        appear
        :enter-active-class="animateClass"
        :appear-active-class="animateClass"
        mode="out-in"
      >
        <router-view class="app-content-box" />
      </transition>
    </div>
  </fragment>
</template>
<script>
import { routes } from "./router/index";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      routerList: [],
    };
  },
  computed: {
    ...mapState(["currentPageAnimate", "pageAnimateNum"]),
    animateClass() {
      // console.log(this.currentPageAnimate);
      if (this.currentPageAnimate === 1) {
        return "animate__animated animate__bounceIn";
      }
      if (this.currentPageAnimate === 2) {
        return "animate__animated animate__slideInLeft";
      }
      if (this.currentPageAnimate === 3) {
        return "scal-page";
      }
      return "animate__animated animate__slideInLeft";
    },
  },
  mounted() {
    // this.setFontSize();
    routes.map((item) => {
      if (this.$route.path === item.path) {
        item.active = true;
      } else {
        item.active = false;
      }

      return item;
    });
    this.routerList = routes;
  },
  methods: {
    ...mapMutations(["changeCurrentPageAnimate"]),
    goPage(item) {
      this.routerList.map((item) => {
        item.active = false;
        return item;
      });
      item.active = true;
      this.changeCurrentPageAnimate();
      this.$router.push(item.path);
    },
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
html,
body,
#app {
  width: 100%;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.app-list-arr {
  margin-top: 20px;
  overflow: hidden;
  margin-bottom: 10px;
}
.menu-list {
  display: inline-block;
  height: 28px;
  min-width: 80px;
  background: #409eff;
  text-align: center;
  line-height: 28px;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  margin-right: 10px;
}
.active {
  background: red;
}
.app-content-box {
  background: skyblue;
  min-height: 500px;
}
.scal-page {
  animation: scalAnimate 1s ease-in;
  animation-fill-mode: forwards;
}
@keyframes scalAnimate {
  from {
    scale: 0;
  }
  to {
    scale: 1;
  }
}
.flip-animate {
  animation: flipAnimate 1s ease-in;
  animation-fill-mode: forwards;
}
@keyframes flipAnimate {
  0% {
    transform: rotateY(150deg);
  }
  20% {
    transform: rotateY(120deg);
  }
  40% {
    transform: rotateY(90deg);
  }
  60% {
    transform: rotateY(60deg);
  }
  80% {
    transform: rotateY(30deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}
.sideTo {
  &-enter-active,
  &-leave-active {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    transition: all ease 1s;

    /* will-change属性可以提前通知浏览器我们要对元素做什么动画，这样浏览器可以提前准备合适的优化设置 */
    will-change: transform, opacity;
  }

  &-enter {
    transform: translate(200px, 100px) scale(0.1);
  }

  &-leave-active {
    opacity: 0;
    transform: scale(0.1);
  }
}
.fade-enter,
.fade-leave-to {
  opacity: 1;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
</style>
