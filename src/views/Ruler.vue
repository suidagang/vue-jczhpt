<template>
  <div id="app">
    <vue-ruler-tool
      :content-layout="{ left: 100, top: 20 }"
      :is-scale-revise="true"
      :v-model="presetLine"
    >
      <div class="grid-box">
        <div
          class="item-box"
          v-for="item in listBox"
          :key="item.id"
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
      <button
        style="margin-top: 30px; cursor: pointer; margin-right: 10px"
        @click="reOrder"
      >
        重新排序
      </button>
      <button
        style="margin-top: 30px; cursor: pointer; margin-left: 10px"
        @click="reset"
      >
        重置
      </button>
      <h2>大屏布局方式</h2>
      <p style="text-align: left">2*3（2排3列）</p>
      <h2>格子尺寸最多为6种(高，宽)</h2>
      <ul style="text-align: left">
        <li>第一种:1*1</li>
        <li>第二种:1*2</li>
        <li>第三种:2*1</li>
        <li>第四种:2*2</li>
        <li>第五种:1*3</li>
        <li>第六种:2*3</li>
      </ul>
      <h2>处理逻辑</h2>
      <ul style="text-align: left">
        <li>第一种：全部为1*1卡片</li>
        <li>
          第二种：只有一张2*1卡片，其余全部为1*1卡片（这种页面默认为我们中间为地图的卡片）
        </li>
        <li>第三种：上续两种情况除外的</li>
      </ul>
    </vue-ruler-tool>
  </div>
</template>

<script>
import VueRulerTool from "vue-ruler-tool";
import pageReOrder from "./config/ruler";
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
      saveListBox: [],
      // oldListBox: [
      // {
      //   sx: 0,
      //   sy: 0,
      //   sbW: 1,
      //   sbH: 1,
      //   id: 1,
      //   color: "red",
      // },
      // {
      //   sx: 1,
      //   sy: 0,
      //   sbW: 1,
      //   sbH: 1,
      //   id: 2,
      //   color: "orange",
      // },
      // {
      //   sx: 2,
      //   sy: 0,
      //   sbW: 1,
      //   sbH: 1,
      //   id: 3,
      //   color: "Cyan",
      // },
      // {
      //   sx: 0,
      //   sy: 1,
      //   sbW: 1,
      //   bH: 1,
      //   id: 4,
      //   color: "green",
      // },
      // {
      //   sx: 1,
      //   sy: 1,
      //   sbW: 1,
      //   sbH: 1,
      //   id: 5,
      //   color: "blue",
      // },
      // {
      //   sx: 2,
      //   sy: 1,
      //   sbW: 1,
      //   sbH: 1,
      //   id: 6,
      //   color: "purple",
      // },
      // ],
      oldListBox: [
        // {
        //   sx: 1,
        //   sy: 0,
        //   sbW: 1,
        //   sbH: 1,
        //   id: 1,
        //   color: "red",
        // },
        {
          sx: 0,
          sy: 1,
          sbW: 1,
          sbH: 2,
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
        // {
        //   sx: 1,
        //   sy: 1,
        //   sbW: 1,
        //   sbH: 1,
        //   id: 4,
        //   color: "green",
        // },
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
          sy: 2,
          sbW: 1,
          sbH: 1,
          id: 6,
          color: "purple",
        },
      ],
      listBox: [],
    };
  },
  created() {
    this.listBox = JSON.parse(JSON.stringify(this.oldListBox));
    this.saveListBox = JSON.parse(JSON.stringify(this.oldListBox));
  },
  methods: {
    reset() {
      this.listBox = JSON.parse(JSON.stringify(this.saveListBox));
    },
    reOrder() {
      new pageReOrder(this.oldListBox, "sx", "sy", "sbW", "sbH")
        .init()
        .then((listBox) => {
          this.listBox = listBox;
        });
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
</style>