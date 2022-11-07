<template>
  <div
    class="drag-container"
    ref="gridLayoutContent"
    @drop="drop"
    @dragover.prevent="allowDrop"
  >
    <grid-layout
      ref="gridlayout"
      :layout.sync="layout"
      :col-num="gridLayoutConfig.colNum"
      :max-rows="gridLayoutConfig.rowNum"
      :row-height="gridLayoutConfig.rowHeight"
      :margin="gridLayoutConfig.margin"
      :autoSize="false"
      :is-draggable="computedDraggable"
      :is-resizable="computedResizable"
      :prevent-collision="preventCollision"
      :vertical-compact="false"
      :use-css-transforms="true"
      @layout-updated="layoutUpdatedEvent"
    >
      <grid-item
        :key="item.i"
        v-for="item in layout"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
      >
        <!-- <component ref="gridComponents" :is="componentId"></component> -->
        <span class="text">{{ item.name }}</span>
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
import VueGridLayout from "vue-grid-layout";
import { throttle, cloneDeep } from "lodash-es";
let mouseXY = { x: null, y: null };
let DragPos = { x: null, y: null, w: 10, h: 10, i: null };
export default {
  data() {
    return {
      gridLayoutConfig: {
        colNum: 377,
        rowNum: 96,
        rowHeight: 0,
        margin: [10, 10],
      },
      newGridId: "" /* 新增元素的id */,
      dragingFlag: false /* 拖拽标识，是否新增元素中 */,
      layout: [
        { x: 0, y: 0, w: 165, h: 47, i: "0", name: "卡片原始一" },
        // { x: 124, y: 0, w: 3, h: 10, i: "1", name: "卡片原始二" },
        // { x: 5, y: 0, w: 4, h: 20, i: "2", name: "卡片原始三" },
        // { x: 9, y: 0, w: 40, h: 20, i: "3", name: "卡片原始四" },
      ],
    };
  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
  },
  computed: {
    computedDraggable() {
      return true;
    },
    computedResizable() {
      return true;
    },
    preventCollision() {
      // resize的时候需要设置防止碰撞, 其他情况由数据static状态控制
      return true;
      // 新增拖放元素的时候，防止元素被挤开，这里动态设置
      // 拖拽的时候，防止元素被挤开，这里动态设置
      // return this.dragingFlag || this.resizeFlag || this.keyFlag;
    },
  },
  methods: {
    layoutUpdatedEvent: throttle((newLayout) => {}, 70),
    dragStart(event, data) {
      console.log("拖拽开始", data);
    },
    dragMove(event, data) {
      const dragData = cloneDeep(data);

      mouseXY.y = event.clientY;
      mouseXY.x = event.clientX;
      if (!this.dragingFlag) {
        // 需要对新元素的设置一个i
        this.newGridId = `simple-${this.layout.length}-${Math.random().toFixed(
          3
        )}`;
      }
      this.dragingFlag = true;
      let parentRect = this.$refs.gridLayoutContent.getBoundingClientRect();
      let mouseInGrid = false;
      if (
        mouseXY.x > parentRect.left &&
        mouseXY.x < parentRect.right &&
        mouseXY.y > parentRect.top &&
        mouseXY.y < parentRect.bottom
      ) {
        mouseInGrid = true;
      }
      if (
        mouseInGrid === true &&
        this.layout.findIndex((item) => item.i === this.newGridId) === -1
      ) {
        const tempObj = {
          ...dragData,
          x: (this.layout.length * 2) % (this.colNum || 12),
          y: this.layout.length + (this.colNum || 12),
          w: 10,
          h: 10,
          i: this.newGridId,
          kpstid: data.kpstid,
        };
        this.layout.push(tempObj);
      }
      let index = this.layout.findIndex((item) => item.i === this.newGridId);
      if (index !== -1) {
        let el = this.$refs.gridlayout.$children[index];
        el.dragging = {
          top: mouseXY.y - parentRect.top,
          left: mouseXY.x - parentRect.left,
        };
        let new_pos = el.calcXY(
          mouseXY.y - parentRect.top,
          mouseXY.x - parentRect.left
        );

        if (mouseInGrid === true) {
          this.$refs.gridlayout.dragEvent(
            "dragstart",
            this.newGridId,
            new_pos.x,
            new_pos.y,
            10,
            10
          );
          DragPos.i = String(index);
          DragPos.x = this.layout[index].x;
          DragPos.y = this.layout[index].y;
        }
        if (mouseInGrid === false) {
          this.$refs.gridlayout.dragEvent(
            "dragend",
            this.newGridId,
            new_pos.x,
            new_pos.y,
            1,
            1
          );
          this.layout = this.layout.filter((obj) => obj.i !== this.newGridId);
        }
      }
    },
    dragEnd() {
      this.dragingFlag = false;
      let parentRect = this.$refs.gridLayoutContent.getBoundingClientRect();
      let mouseInGrid = false;
      if (
        mouseXY.x > parentRect.left &&
        mouseXY.x < parentRect.right &&
        mouseXY.y > parentRect.top &&
        mouseXY.y < parentRect.bottom
      ) {
        mouseInGrid = true;
      }
      let index = this.layout.findIndex((item) => item.i === this.newGridId);
      if (mouseInGrid === true && index !== -1) {
        this.$refs.gridlayout.dragEvent(
          "dragend",
          DragPos.i,
          DragPos.x,
          DragPos.y,
          10,
          10
        );
      }
    },
    drop(event) {},
    allowDrop(event) {
      const tempEvent = event;
      tempEvent.dataTransfer.dropEffect = "move";
    },
  },
};
</script>

<style scoped lang="less">
.vue-grid-item {
  touch-action: none;
  // 取消默认位移动画
  transition: none;
  border: none !important;
}

.drag-container {
  height: 960px;
  width: 3780px;
  overflow: hidden;
  background: skyblue;
  margin: 0 auto;
  .vue-grid-layout {
    height: 100%;
    overflow: hidden;
  }
}
.droppable-element {
  width: 150px;
  text-align: center;
  background: #fdd;
  border: 1px solid black;
  margin: 10px 0;
  padding: 10px;
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

.vue-draggable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0;
  left: 0;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>")
    no-repeat;
  background-position: bottom right;
  padding: 0 8px 8px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: pointer;
}

.layoutJSON {
  background: #ddd;
  border: 1px solid black;
  margin-top: 10px;
  padding: 10px;
}

.layoutJSON {
  background: #ddd;
  border: 1px solid black;
  margin-top: 10px;
  padding: 10px;
}

.columns {
  -moz-columns: 120px;
  -webkit-columns: 120px;
  columns: 120px;
}

.container .vue-grid-item.vue-grid-placeholder {
  background: green;
}
</style>
