<template>
  <div>
    <grid-layout
      :layout.sync="layout"
      :col-num="8"
      :row-height="100"
      :is-draggable="true"
      :is-resizable="false"
      :vertical-compact="false"
      :margin="[20, 24]"
      :use-css-transforms="true"
    >
      <grid-item
        v-for="(item, index) in layout"
        :key="index"
        :item="watchitem(item)"
        :static="item.static"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        @move="moveEvent"
        @moved="movedEvent"
      >
        <span class="text">{{ item.i }}</span>
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
var historyLayout = [
  { x: 0, y: 0, w: 1, h: 1, i: "0", static: false },
  { x: 1, y: 0, w: 1, h: 1, i: "1", static: false },
  { x: 2, y: 0, w: 1, h: 1, i: "2", static: false },
  { x: 3, y: 0, w: 1, h: 1, i: "3", static: false },
  { x: 4, y: 0, w: 1, h: 1, i: "4", static: false },
  { x: 5, y: 0, w: 1, h: 1, i: "5", static: false },
  { x: 6, y: 0, w: 1, h: 1, i: "6", static: false },
  { x: 7, y: 0, w: 1, h: 1, i: "7", static: false },
  { x: 0, y: 1, w: 1, h: 1, i: "8", static: false },
  { x: 1, y: 1, w: 1, h: 1, i: "9", static: false },
  { x: 2, y: 1, w: 1, h: 1, i: "10", static: false },
  { x: 3, y: 1, w: 1, h: 1, i: "11", static: false },
  { x: 4, y: 1, w: 1, h: 1, i: "12", static: false },
  { x: 5, y: 1, w: 1, h: 1, i: "13", static: false },
  { x: 6, y: 1, w: 1, h: 1, i: "14", static: false },
  { x: 7, y: 1, w: 1, h: 1, i: "15", static: false },
  { x: 0, y: 2, w: 1, h: 1, i: "16", static: false },
  { x: 1, y: 2, w: 1, h: 1, i: "17", static: false },
  { x: 2, y: 2, w: 1, h: 1, i: "18", static: false },
  { x: 3, y: 2, w: 1, h: 1, i: "19", static: false },
];

import { GridLayout, GridItem } from "vue-grid-layout";
export default {
  components: {
    GridLayout,
    GridItem,
  },
  data() {
    return {
      layout: [
        { x: 0, y: 0, w: 1, h: 1, i: "0", static: false },
        { x: 1, y: 0, w: 1, h: 1, i: "1", static: false },
        { x: 2, y: 0, w: 1, h: 1, i: "2", static: false },
        { x: 3, y: 0, w: 1, h: 1, i: "3", static: false },
        { x: 4, y: 0, w: 1, h: 1, i: "4", static: false },
        { x: 5, y: 0, w: 1, h: 1, i: "5", static: false },
        { x: 6, y: 0, w: 1, h: 1, i: "6", static: false },
        { x: 7, y: 0, w: 1, h: 1, i: "7", static: false },
        { x: 0, y: 1, w: 1, h: 1, i: "8", static: false },
        { x: 1, y: 1, w: 1, h: 1, i: "9", static: false },
        { x: 2, y: 1, w: 1, h: 1, i: "10", static: false },
        { x: 3, y: 1, w: 1, h: 1, i: "11", static: false },
        { x: 4, y: 1, w: 1, h: 1, i: "12", static: false },
        { x: 5, y: 1, w: 1, h: 1, i: "13", static: false },
        { x: 6, y: 1, w: 1, h: 1, i: "14", static: false },
        { x: 7, y: 1, w: 1, h: 1, i: "15", static: false },
        { x: 0, y: 2, w: 1, h: 1, i: "16", static: false },
        { x: 1, y: 2, w: 1, h: 1, i: "17", static: false },
        { x: 2, y: 2, w: 1, h: 1, i: "18", static: false },
        { x: 3, y: 2, w: 1, h: 1, i: "19", static: false },
      ],
      draggable: true,
      resizable: true,
      index: 0,
      newX: 0,
      newY: 0,
      curBox: "",
    };
  },
  methods: {
    watchitem(item) {
      if (this.curBox != item.i) {
        console.log(item, "----");
        for (let j = 0; historyLayout[j] != undefined; j++) {
          if (historyLayout[j].i == item.i) {
            item.x = historyLayout[j].x;
            item.y = historyLayout[j].y;
          }
        }
      }
      return item;
    },
    moveEvent(i) {
      this.curBox = i;
    },
    movedEvent(i, newX, newY) {
      for (let j = 0; historyLayout[j] != undefined; j++) {
        if (historyLayout[j].i == i) {
          this.newX = historyLayout[j].x;
          this.newY = historyLayout[j].y;
          historyLayout[j].x = newX;
          historyLayout[j].y = newY;
        }
      }
      for (let j = 0; historyLayout[j] != undefined; j++) {
        if (
          i != historyLayout[j].i &&
          historyLayout[j].x === newX &&
          historyLayout[j].y === newY
        ) {
          historyLayout[j].x = this.newX;
          historyLayout[j].y = this.newY;
        }
      }
    },
  },
};
</script>

<style scoped>
.vue-grid-layout {
  background: #eee;
}
.vue-grid-item:not(.vue-grid-placeholder) {
  background: #ccc;
  border: 1px solid black;
}
.vue-grid-item .resizing {
  opacity: 0.9;
}
.vue-grid-item .static {
  background: #cce;
}
.vue-grid-item .text {
  font-size: 24px;
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 100%;
  width: 100%;
}
.vue-grid-item .no-drag {
  height: 100%;
  width: 100%;
}
.vue-grid-item .minMax {
  font-size: 12px;
}
.vue-grid-item .add {
  cursor: pointer;
}
</style>