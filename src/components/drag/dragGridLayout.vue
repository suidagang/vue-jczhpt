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
        :class="{ danger: judgeDanger(item) }"
        v-for="item in previewArr"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
      />
      <grid-item
        :key="item.i"
        v-for="item in layout"
        :class="{ danger: judgeDanger(item), preview: judgePreview(item) }"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        @move="moveEvent"
      >
        <!-- <component ref="gridComponents" :is="componentId"></component> -->
        <div class="drag-box">
          <span class="remove" @click.prevent.stop="removeItem(item.i)">x</span>
          <span class="text">{{ item.name }}</span>
        </div>
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
import VueGridLayout from "vue-grid-layout";
import { throttle, cloneDeep } from "lodash-es";
import {
  judgeIsOut,
  getInvolveAndContain,
  changeOtherStatic,
  getOverlap,
  correctSize,
} from "./util";
let mouseXY = { x: null, y: null };
let DragPos = { x: null, y: null, w: 10, h: 10, i: null };

export default {
  data() {
    return {
      gridLayoutConfig: {
        colNum: 377,
        rowNum: 96,
        rowHeight: 0,
        colWidth: 0,
        margin: [10, 10],
      },
      involveArr: [],
      previewArr: [],
      newGridId: "" /* 新增元素的id */,
      dragingFlag: false /* 拖拽标识，是否新增元素中 */,
      resizeFlag: false /* resize标识，是否新增元素中 */,
      dragingType: "" /* 拖拽标识, 拖拽移动加了延时，导致偶尔出现元素错误 */,
      layout: [
        { x: 0, y: 0, w: 15, h: 32, i: "0", name: "卡片原始一" },
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
    computedCorrect() {
      return {
        width: !this.colWidth,
        height: !this.rowHeight,
      };
    },
    computedDraggable() {
      return true;
    },
    computedResizable() {
      return true;
    },
    preventCollision() {
      // resize的时候需要设置防止碰撞, 其他情况由数据static状态控制
      return this.resizeFlag;
      // 新增拖放元素的时候，防止元素被挤开，这里动态设置
      // 拖拽的时候，防止元素被挤开，这里动态设置
      // return this.dragingFlag || this.resizeFlag || this.keyFlag;
    },
  },
  methods: {
    judgePreview(item) {
      return this.previewArr.some((el) => el.oldI === item.i);
    },
    judgeDanger(item) {
      return this.involveArr.some((el) => el.i === item.i);
    },
    moveEvent(i, newX, newY) {
      // console.log("MOVED i=" + i + ", X=" + newX + ", Y=" + newY);
    },
    layoutUpdatedEvent: throttle(function (newLayout) {
      this.resizeFlag = false;
      if (this.dragingFlag) {
        return;
      }
      // console.log("Updated layout: ", newLayout);
    }, 70),
    dragStart() {
      this.dragingType = "dragStart";
    },
    dragMove: throttle(function (event, data) {
      if (this.dragingType === "dragStop") {
        // 拖拽结束之后的延迟不继续执行；
        return;
      }
      // drop弹起的时候，位置为空
      if (!event.clientX && !event.clientY) {
        return;
      }
      if (mouseXY.x === event.clientX && mouseXY.y === event.clientY) {
        return;
      }
      const dragData = cloneDeep(data);
      // 校正新增元素的宽高
      correctSize("in", this.computedCorrect, dragData);
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
      const [newW, newH] = [dragData.kpkd || 10, dragData.kpgd || 10];
      let [newX, newY] = [10, 10];
      newX = Math.round(
        (mouseXY.x - parentRect.left) /
          (this.gridLayoutConfig.colWidth
            ? this.gridLayoutConfig.margin[0] + this.gridLayoutConfig.colWidth
            : this.gridLayoutConfig.margin[0]) -
          newW / 2
      );
      newY = Math.round(
        (mouseXY.y - parentRect.top) /
          (this.gridLayoutConfig.rowHeight
            ? this.gridLayoutConfig.margin[1] + this.gridLayoutConfig.rowHeight
            : this.gridLayoutConfig.margin[1]) -
          newH / 2
      );
      if (newX < 0) {
        newX = 0;
      }
      if (newX > this.gridLayoutConfig.colNum - newW) {
        newX = this.gridLayoutConfig.colNum - newW;
      }
      if (newY < 0) {
        newY = 0;
      }
      if (newY > this.gridLayoutConfig.rowNum - newH) {
        newY = this.gridLayoutConfig.rowNum - newH;
      }
      const dropIndex = this.layout.findIndex(
        (item) => item.i === this.newGridId
      );
      // 鼠标在容器内，并且未创建新增元素，则创建新增元素；
      if (mouseInGrid === true && dropIndex === -1) {
        const tempObj = {
          ...dragData,
          x: newX,
          y: newY,
          w: newW,
          h: newH,
          i: this.newGridId,
          kpstid: data.kpstid,
        };
        const involveAndContain = getInvolveAndContain(tempObj, this.layout);
        this.involveArr = involveAndContain.involve.concat(
          involveAndContain.contain
        );
        changeOtherStatic(this.newGridId, this.layout, true);
        this.layout.push(tempObj);
      }
      if (dropIndex !== -1) {
        try {
          const tempIndex = this.$refs.gridlayout.$children.findIndex(
            (el) => el?.$vnode?.key === this.newGridId
          );
          const dragEl = this.$refs.gridlayout.$children[tempIndex];
          // 隐藏拖拽placeholder
          dragEl.$el.style.transform = `translate3d(
            ${
              mouseXY.x -
              parentRect.left -
              (dragEl.$el.offsetWidth - this.gridLayoutConfig.margin[0]) / 2
            }px,
            ${
              mouseXY.y -
              parentRect.top -
              (dragEl.$el.offsetHeight - this.gridLayoutConfig.margin[1]) / 2
            }px, 0px)`;
        } catch (e) {
          // eslint-disable-next-line no-empty
        }
        DragPos.x = newX;
        DragPos.y = newY;
        DragPos.w = newW;
        DragPos.h = newH;
        DragPos.i = String(dropIndex);
        if (mouseInGrid === true) {
          // 获取鼠标拖拽元素所覆盖的子项
          const previewObj = {
            isDraggable: false,
            isResizable: false,
            static: true,
            x: newX,
            y: newY,
            w: newW,
            h: newH,
            oldI: this.newGridId,
            i: `preview-${dropIndex}`,
          };
          const involveAndContain = getInvolveAndContain(
            previewObj,
            this.layout.filter((el) => el.i !== this.newGridId)
          );
          this.involveArr = involveAndContain.total;
          if (this.involveArr.length) {
            this.previewArr = [];
          } else {
            this.previewArr = [previewObj];
          }
        }
        if (mouseInGrid === false) {
          this.involveArr = [];
          this.$refs.gridlayout.dragEvent(
            "dragend",
            this.newGridId,
            DragPos.x,
            DragPos.y,
            DragPos.w,
            DragPos.h
          );
          this.layout = this.layout.filter((obj) => obj.i !== this.newGridId);
        }
      }
    }, 50),
    dragEnd() {
      this.dragingType = "dragStop";
      this.dragingFlag = false;
      if (this.involveArr.length) {
        this.layout = this.layout.filter((obj) => obj.i !== this.newGridId);
        this.involveArr = [];
        this.dragingFlag = false;
      }
      this.previewArr = [];
      let index = this.layout.findIndex((item) => item.i === this.newGridId);
      if (index !== -1) {
        this.$refs.gridlayout.dragEvent(
          "dragend",
          this.newGridId,
          DragPos.x,
          DragPos.y,
          DragPos.h,
          DragPos.w
        );
        this.layout[index].x = DragPos.x;
        this.layout[index].y = DragPos.y;
        try {
          const tempIndex = this.$refs.gridlayout.$children.findIndex(
            (el) => el?.$vnode?.key === this.newGridId
          );

          const dragEl = this.$refs.gridlayout.$children[tempIndex];
          const tempPosition = dragEl.calcPosition(
            DragPos.x,
            DragPos.y,
            DragPos.w,
            DragPos.h
          );
          // 当preview元素的位置无变化时，不会触发内部事件位置更新，手动赋值
          dragEl.$el.style.transform = `translate3d(${tempPosition.left}px, ${tempPosition.top}px, 0px)`;
        } catch (e) {
          // eslint-disable-next-line no-empty
        }
      }
    },
    drop(event) {},
    allowDrop(event) {
      const tempEvent = event;
      tempEvent.dataTransfer.dropEffect = "move";
    },
    removeItem(val) {
      const index = this.layout.map((item) => item.i).indexOf(val);
      this.layout.splice(index, 1);
    },
  },
  watch: {
    layOutList: {
      deep: true,
      handler(newVal, oldVal) {
        const tempArr = cloneDeep(newVal);
        tempArr.forEach((el) => {
          correctSize("out", this.computedCorrect, el);
        });
      },
    },
  },
};
</script>

<style scoped lang="less">
.drag-box {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 0, 0.3);
  .text {
    color: red;
    font-size: 40px;
  }
}
.remove {
  position: absolute;
  right: 2px;
  top: 0;
  cursor: pointer;
  font-size: 50px;
  z-index: 999;
}
.vue-grid-item {
  touch-action: none;
  // 取消默认位移动画
  // transition: none;
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
  font-size: 40px;
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

.vue-grid-item {
  &.preview {
    background-color: rgba(13, 214, 73, 0.45);
  }
  &.danger {
    background-color: rgba(240, 13, 13, 0.85);
  }
  /deep/ &.vue-grid-placeholder {
    background: green;
    // opacity: 1;
  }
}
</style>
