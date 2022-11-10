<template>
  <div class="library-box" :class="{ show: isShowLibrary }">
    <div class="close" @click="isShowLibrary = false">关闭</div>
    <div
      class="list-box"
      v-for="(item, index) in listArr"
      :key="index"
      :draggable="true"
      @dragstart="itemDragStart($event, item)"
      @drag="itemDragMove($event, item)"
      @dragend="itemDragEnd($event, item)"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShowLibrary: true,
      listArr: [
        {
          name: "卡片一",
          kpstid: "1",
          kpkd: 70,
          kpgd: 40,
        },
        {
          name: "卡片二",
          kpstid: "2",
          kpkd: 70,
          kpgd: 40,
        },
        {
          name: "卡片三",
          kpstid: "3",
          kpkd: 12,
          kpgd: 10,
        },
        {
          name: "卡片四",
          kpstid: "4",
          kpkd: 16,
          kpgd: 30,
        },
        {
          name: "卡片五",
          kpstid: "5",
          kpkd: 22,
          kpgd: 30,
        },
        {
          name: "卡片六",
          kpstid: "6",
          kpkd: 35,
          kpgd: 20,
        },
      ],
    };
  },
  props: {
    dragStart: {
      type: Function,
      default: null,
    },
    dragMove: {
      type: Function,
      default: null,
    },
    dragEnd: {
      type: Function,
      default: null,
    },
  },
  components: {},
  methods: {
    show() {
      this.isShowLibrary = true;
    },
    // 卡片不可重复添加
    judgeDisable(item) {
      // 卡片不可重复添加
      return this.alreadyList.some((el) => el.kpstid === item.kpstid);
    },
    // 卡片拖拽事件
    itemDragStart(event, data) {
      console.log(event, data, "-------000");
      const tempEvent = event;
      this.isShowLibrary = false;
      // 设置一张透明的1像素图片，隐藏效果
      const dragIcon = document.createElement("img");
      dragIcon.src =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=";
      tempEvent.dataTransfer.setDragImage(dragIcon, 0, 0); //后面两个参数为偏移量
      tempEvent.dataTransfer.dropEffect = "move"; //控制光标手势
      this.dragStart && this.dragStart(tempEvent, data);
    },

    // 卡片拖拽事件
    itemDragMove(event, data) {
      const tempEvent = event;
      this.dragMove && this.dragMove(tempEvent, data);
    },

    // 卡片拖拽事件
    itemDragEnd(event, data) {
      const tempEvent = event;
      this.dragEnd && this.dragEnd(tempEvent, data);
    },
  },
};
</script>

<style scoped lang="less">
.library-box {
  transform: translateX(100%);
  transition: all 0.2s linear;
  height: 100%;
  width: 500px;
  background: rgba(255, 255, 255, 1);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  overflow-y: auto;
  overflow-x: hidden;
  &.show {
    transform: translateX(0);
  }
  .close {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 50px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .list-box {
    width: 300px;
    height: 120px;
    border: 1px solid#ccc;
    text-align: center;
    line-height: 200px;
    margin-top: 20px;
    overflow: hidden;
    font-size: 40px;
    color: red;
    -moz-user-select: none; /*火狐*/
    -webkit-user-select: none; /*webkit浏览器*/
    -ms-user-select: none; /*IE10*/
    -khtml-user-select: none; /*早期浏览器*/
    user-select: none;
    background: url("http://5b0988e595225.cdn.sohucs.com/images/20200226/453b2d9aaf0b403d850b4cea3766c982.jpeg")
      center no-repeat;
  }
}
</style>
