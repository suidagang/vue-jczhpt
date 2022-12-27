<template>
  <div class="cardContent">
    <div class="cardBox">
      <div
        :class="['card-item', `card-item-${index + 1}`]"
        v-for="(item, index) in drawList"
        :key="index"
      >
        <!-- 数组中存入index值时，将写有动画的class属性赋给标签，即开始播放动画 -->
        <!-- <div :class="['card', selectArr.includes(index) ? 'cardAnimate' : '']">
          卡牌背面{{ index + 1 }}
        </div> -->
        <div :class="['contxt', 'contxtAnimate']">卡牌{{ index + 1 }}正面</div>
      </div>
      <button @click="startAniame" style="margin-right: 10px">开始动画</button>
      <button @click="resetAniame" style="margin-left: 10px">重置</button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      drawList: 0,
      selectArr: [],
    };
  },
  mounted() {
    //数组中存入index值时，将写有动画的class属性赋给标签，即开始播放动画
    //自动播放翻牌动画，1500ms后播放第一张翻牌动画，然后每200ms播放一张
  },
  methods: {
    startAniame() {
      this.drawList = 6;
      for (let i = 0; i < 6; i++) {
        // setTimeout(() => {
        // this.selectArr.push(i);
        // }, 1500 + (i - 1) * 200);
      }
    },
    resetAniame() {
      this.drawList = 0;
      this.selectArr = [];
    },
  },
};
</script>
<style>
/* 每张卡牌属性 */
.card-item {
  width: 212px;
  height: 252px;
  margin: 10px;
  border-radius: 10px;
  /* 文字居中 */
  line-height: 252px;
  text-align: center;
}
/* 翻转前 */
.card-item .card {
  width: 212px;
  height: 252px;
  border-radius: 10px;
  backface-visibility: hidden;
  background-color: aliceblue;
}
/* 翻转后 */
.card-item .contxt {
  width: 212px;
  height: 252px;
  border-radius: 10px;
  backface-visibility: hidden;
  /* 定位于和翻转前相同的位置 */
  /* position: relative;
  top: -252px;
  left: 0; */

  /* opacity: 0; */
  background-color: bisque;
}
/*将每个卡牌进行定位*/
.card-item-1 {
  position: absolute;
  left: 20px;
  top: 200px;
}
.card-item-2 {
  position: absolute;
  left: 252px;
  top: 200px;
}
.card-item-3 {
  position: absolute;
  left: 484px;
  top: 200px;
}
.card-item-4 {
  position: absolute;
  left: 20px;
  top: 472px;
}
.card-item-5 {
  position: absolute;
  left: 252px;
  top: 472px;
}
.card-item-6 {
  position: absolute;
  left: 484px;
  top: 472px;
}
/* 卡片翻牌 */
/* 背面 */
.cardAnimate {
  animation: rotetaCard 1s ease-in;
  animation-fill-mode: forwards;
}
/* 正面 */
.contxtAnimate {
  animation: contxtRotate 1s ease-in;
  animation-fill-mode: forwards;
}
/* 正面卡牌翻牌动画 */
@keyframes contxtRotate {
  0% {
    transform: rotateY(180deg);
    opacity: 1;
  }
  50% {
    transform: rotateY(90deg);
    opacity: 1;
  }
  100% {
    transform: rotateY(0deg);
    opacity: 1;
  }
  /* from {
    transform: rotateY(180deg);
    opacity: 1;
  }

  to {
    transform: rotateY(0deg);
    opacity: 1;
  } */
}

/* 背面卡牌翻牌动画 */
@keyframes rotetaCard {
  from {
    transform: rotateY(0);
  }

  to {
    transform: rotateY(180deg);
  }
}
</style>