<template>
  <div class="com-head">
    <div class="drag-library" @click="showDragLibrary">拖拽元素库</div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  components: {},
  methods: {
    showDragLibrary() {
      this.$emit("showLibrary");
    },
  },
};
</script>

<style scoped lang="less">
.com-head {
  position: relative;
  height: 60px;
  width: 100%;
  background: pink;
  overflow: hidden;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  .drag-library {
    position: absolute;
    right: 20px;
    height: 30px;
    width: 120px;
    background: #409eff;
    color: #fff;
    text-align: center;
    line-height: 30px;
    border-radius: 4px;
    cursor: pointer;
  }
}
</style>
