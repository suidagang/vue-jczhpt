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
        <span class="text">{{ item.i }}</span>
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
import VueGridLayout from "vue-grid-layout";
import { throttle, cloneDeep } from "lodash-es";
let mouseXY = { x: null, y: null };
let DragPos = { x: null, y: null, w: 1, h: 1, i: null };
export default {
  data() {
    return {
      gridLayoutConfig: {
        colNum: 94,
        rowNum: 94,
        rowHeight: 0,
        margin: [10, 10],
      },
      newGridId: "" /* 新增元素的id */,
      dragingFlag: false /* 拖拽标识，是否新增元素中 */,
      layout: [
        { x: 0, y: 0, w: 10, h: 10, i: "0" },
        { x: 10, y: 0, w: 10, h: 20, i: "1" },
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
      console.log("拖拽移动");
      // 拷贝数据
      const dragData = cloneDeep(data);
      /* 获取鼠标坐标 */
      mouseXY.x = event.clientX;
      mouseXY.y = event.clientY;
      //新增元素
      if (!this.dragingFlag) {
        // 需要对新元素的设置一个i
        this.newGridId = `simple-${this.layout.length}-${Math.random().toFixed(
          3
        )}`;
      }
      this.dragingFlag = true;
      //回去grid-layout容器的dom对象（left、top、right、bottom、x、y、width 和 height）属性
      const parentRect = this.$refs.gridLayoutContent.getBoundingClientRect();
      //用于判断鼠标是否在grid容器内
      let mouseInGrid = false;
      if (
        mouseXY.x > parentRect.left &&
        mouseXY.x < parentRect.right &&
        mouseXY.y > parentRect.top &&
        mouseXY.y < parentRect.bottom
      ) {
        mouseInGrid = true;
      }

      //计算新的坐标点
      const [dragW, dragH] = [dragData.kpkd || 10, dragData.kpdg || 10];
      let [dragX, dragY] = [10, 10];
      dragX = Math.round(mouseXY.x - parentRect.left);
      dragY = Math.round(mouseXY.y - parentRect.top);
      //如果拖拽小于容器最左边显示为0
      if (dragX < 0) {
        dragX = 0;
      }
      if (dragY < 0) {
        dragY = 0;
      }
      //超出容器显示容器的最右边
      if (dragX > this.gridLayoutConfig.colNum - dragW) {
        dragX = this.gridLayoutConfig.colNum - dragW;
      }
      if (dragY > this.gridLayoutConfig.rowNum - dragH) {
        dragY = this.gridLayoutConfig.rowNum - dragH;
      }
      // 判断是否加入到元素列表中
      const dropIndex = this.layout.findIndex(
        (item) => item.i === this.newGridId
      );
      // 判断拖动是否在容器里，新增的就加入到列表中
      if (mouseInGrid === true && dropIndex === -1) {
        const tempObj = {
          ...dragData,
          x: dragX,
          y: dragY,
          w: dragW,
          h: dragH,
          kpid: dragData.kpid,
          i: this.newGridId,
        };
        this.layout.push(tempObj);
      }
      //在列表中处理的逻辑
      if (dropIndex !== -1) {
        try {
          this.$refs.gridlayout.$children[
            this.layout.length
          ].$refs.item.style.display = "none";
        } catch (e) {
          console.log(e, "errrr");
        }
        DragPos.x = dragX;
        DragPos.y = dragY;
        DragPos.w = dragW;
        DragPos.h = dragH;
        //在拖拽内容区
        if (mouseInGrid === true) {
          this.$refs.gridlayout.dragEvent(
            "dragstart",
            this.newGridId,
            dragX,
            dragY,
            dragH,
            dragW
          );
          DragPos.x = this.layout[dropIndex].x;
          DragPos.y = this.layout[dropIndex].y;
        }
        //没在拖拽内容区
        if (mouseInGrid === false) {
          this.$refs.gridlayout.dragEvent(
            "dragend",
            this.newGridId,
            dragX,
            dragY,
            dragH,
            dragW
          );
          this.layout = this.layout.filter((obj) => obj.i !== this.newGridId);
        }
      }

      // this.layOutList.push(tempObj);
    },
    dragEnd() {
      const dropIndex = this.layout.findIndex(
        (item) => item.i === this.newGridId
      );
      // if (dropIndex > -1) {
      this.layout.push({
        x: DragPos.x,
        y: DragPos.y,
        w: DragPos.w,
        h: DragPos.h,
        i: this.newGridId,
      });
      // this.$refs.gridLayout.dragEvent(
      //   "dragend",
      //   this.newGridId,
      //   DragPos.x,
      //   DragPos.y,
      //   DragPos.h,
      //   DragPos.w
      // );
      this.layout[dropIndex].x = DragPos.x;
      this.layout[dropIndex].y = DragPos.y;
      try {
        this.$refs.gridlayout.$children[
          this.layout.length
        ].$refs.item.style.display = "block";
      } catch (e) {
        // eslint-disable-next-line no-empty
      }
      // }
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
.drag-container {
  height: 500px;
  width: 90%;
  overflow: hidden;
  background: skyblue;
  margin: 0 auto;
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
