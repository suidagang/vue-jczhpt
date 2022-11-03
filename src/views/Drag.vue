<template>
  <div class="container">
    <com-head @showLibrary="showLibrary" />
    <right-library
      ref="comLibrary"
      :dragStart="dragStart"
      :dragMove="dragMove"
      :dragEnd="dragEnd"
    />
    <drag-grid-layout ref="gridLayoutBox" />
  </div>
</template>

<script>
import comHead from "../components/drag/head.vue";
import rightLibrary from "../components/drag/rightLibrary.vue";
import dragGridLayout from "../components/drag/dragGridLayout.vue";

export default {
  data() {
    return {};
  },
  components: {
    comHead,
    rightLibrary,
    dragGridLayout,
  },
  methods: {
    showLibrary() {
      this.$refs.comLibrary.show();
    },
    dragStart(event, data) {
      return this.$refs?.gridLayoutBox?.dragStart(event, data);
    },
    dragMove(event, data) {
      return this.$refs?.gridLayoutBox?.dragMove(event, data);
    },
    dragEnd(event, data) {
      return this.$refs?.gridLayoutBox?.dragEnd(event, data);
    },
  },
};
</script>

<style scoped lang="less">
.container {
  position: relative;
  width: 100%;
  height: 1080px;
  overflow: hidden;
  background: #eee;
}
</style>
