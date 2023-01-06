<template>
  <div>
    <div class="grid-box" v-show="isShow">
      <div
        class="item-box"
        v-for="item in listBox"
        :key="item.id"
        :class="animateClass(item)"
        :style="{
          left: item.sx * 200 + 'px',
          top: item.sy * 100 + 'px',
          width: item.sbW * 200 + 'px',
          height: item.sbH * 100 + 'px',
          background: item.color,
        }"
      >
        {{ item.id }}
      </div>
    </div>
    <div class="xy-btn" @click="isShow = !isShow">显隐卡片</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
      //   saveListBox: [],
      oldListBox: [
        {
          sx: 0,
          sy: 0,
          sbW: 1,
          sbH: 1,
          id: 1,
          color: "red",
        },
        {
          sx: 1,
          sy: 0,
          sbW: 1,
          sbH: 1,
          id: 2,
          color: "orange",
        },
        {
          sx: 2,
          sy: 0,
          sbW: 1,
          sbH: 1,
          id: 3,
          color: "Cyan",
        },
        {
          sx: 0,
          sy: 1,
          sbW: 1,
          sbH: 1,
          id: 4,
          color: "green",
        },
        {
          sx: 1,
          sy: 1,
          sbW: 1,
          sbH: 1,
          id: 5,
          color: "blue",
        },
        {
          sx: 2,
          sy: 1,
          sbW: 1,
          sbH: 1,
          id: 6,
          color: "purple",
        },
      ],
      listBox: [],
      animateCurrentType: 1,
      maxCol: 3, // 布局最大的列数
      maxRows: 2, // 布局最大的行数
    };
  },
  created() {
    this.listBox = JSON.parse(JSON.stringify(this.oldListBox));
  },
  computed: {
    animateClass() {
      return function (item) {
        let tempArr = [];
        if (this.animateCurrentType === 1) {
          tempArr = this.animationOne(item);
          return tempArr;
        }
        if (this.animateCurrentType === 2) {
          tempArr = this.animationTwo();
          return tempArr;
        }
        if (this.animateCurrentType === 3) {
          tempArr = this.animationThree();
          return tempArr;
        }
        return tempArr;
      };
    },
  },
  methods: {
    // 第一种动画效果（左飞入，右飞入，中间上飞入，下飞入）
    animationOne(item) {
      if (this.isEdit || this.animateHide) {
        // 编辑模式、隐藏动画模式，不启用动画
        return [];
      }
      // local__zoomInDown
      // 根据位置计算属于九宫格的具体位置，添加不同动画
      // animate__slideInUp
      // animate__slideInRight
      // animate__slideInLeft
      // animate__slideInDown
      const tempArr = ["animate__animated"];
      const [centerX, centerY] = [
        item.sx + item.sbW / 2,
        item.sy + item.sbH / 2,
      ];
      console.log(centerX, centerY);
      if (centerX < this.maxCol / 3) {
        //左边情况
        //如果中心点在Y轴的上方
        if (centerY < this.maxRows / 2) {
          tempArr.push("sui-top-left");
        } else if (centerY > this.maxRows / 2) {
          tempArr.push("sui-bottom-left");
        } else {
          tempArr.push("no-animate");
        }
        // tempArr.push("animate__slideInLeft");
      } else if (centerX > (this.maxCol / 3) * 2) {
        //如果中心点在Y轴的上方
        if (centerY < this.maxRows / 2) {
          tempArr.push("sui-top-right");
        } else if (centerY > this.maxRows / 2) {
          tempArr.push("sui-bottom-right");
        } else {
          tempArr.push("no-animate");
        }
      } else if (centerY < this.maxRows / 3) {
        tempArr.push("animate__slideInDown");
      } else if (centerY > (this.maxRows / 3) * 2) {
        tempArr.push("animate__slideInUp");
      } else {
        tempArr.push("local__zoomInDown");
      }
      console.log(tempArr, "tempArr-------");
      return tempArr;
    },
    // 第二种动画（翻转）
    animationTwo() {
      if (this.isEdit || this.animateHide) {
        // 编辑模式、隐藏动画模式，不启用动画
        return [];
      }
      const tempArr = ["flip-animate"];
      return tempArr;
    },
    animationThree() {
      if (this.isEdit || this.animateHide) {
        // 编辑模式、隐藏动画模式，不启用动画
        return [];
      }
      // const tempArr = ['animate__animated', 'local__slow', 'animate__rollIn'];
      const tempArr = ["scale-small-max"];
      return tempArr;
    },
    onIconClose() {
      if (!this.isEdit) {
        return;
      }
      this.$emit("delete");
    },
  },
};
</script>
<style lang="less" scoped>
.grid-box {
  position: relative;
  width: 600px;
  height: 200px;
  box-sizing: border-box;
  background: pink;
  overflow: hidden;
  .item-box {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    width: 200px;
    box-sizing: border-box;
    overflow: hidden;
    font-size: 40px;
    color: #fff;
  }
}
.flip-animate {
  animation: flipAnimate 1s ease-in;
  animation-fill-mode: forwards;
}
@keyframes flipAnimate {
  0% {
    opacity: 0.8;
    transform: rotateY(150deg);
  }
  20% {
    opacity: 0.8;
    transform: rotateY(120deg);
  }
  40% {
    opacity: 1;
    transform: rotateY(90deg);
  }
  60% {
    opacity: 1;
    transform: rotateY(60deg);
  }
  80% {
    opacity: 1;
    transform: rotateY(30deg);
  }
  100% {
    opacity: 1;
    transform: rotateY(0deg);
  }
}
.scale-small-max {
  animation: scaleAnimate 0.8s ease-in;
  animation-fill-mode: forwards;
}

@keyframes scaleAnimate {
  from {
    scale: 0;
  }
  to {
    scale: 1;
  }
}
.xy-btn {
  position: absolute;
  top: 350px;
  left: 50px;
  height: 28px;
  width: 80px;
  background: #409eff;
  color: #fff;
  text-align: center;
  line-height: 28px;
  border-radius: 3px;
  cursor: pointer;
}

.sui-top-left {
  animation: topLeftAnimate 1s ease;
  animation-fill-mode: forwards;
}
@keyframes topLeftAnimate {
  from {
    transform: translate3d(-100%, -100%, 0);
    visibility: visible;
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}
.sui-bottom-left {
  animation: bottomLeftAnimate 1s ease;
  animation-fill-mode: forwards;
}
@keyframes bottomLeftAnimate {
  from {
    transform: translate3d(-100%, 100%, 0);
    visibility: visible;
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}

.sui-top-right {
  animation: topRightAnimate 1s ease;
  animation-fill-mode: forwards;
}
@keyframes topRightAnimate {
  from {
    transform: translate3d(100%, -100%, 0);
    visibility: visible;
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}
.sui-bottom-right {
  animation: bottomRightAnimate 1s ease;
  animation-fill-mode: forwards;
}
@keyframes bottomRightAnimate {
  from {
    transform: translate3d(100%, 100%, 0);
    visibility: visible;
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}
</style>