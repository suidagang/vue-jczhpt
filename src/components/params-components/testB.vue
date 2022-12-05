<template>
  <div class="container">
    第二层子组件-{{ getTitle2 }}----provide{{ reactiveNameFromParent }}
  </div>
</template>

<script>
export default {
  inject: ["getParentsParams"],
  data() {
    return {};
  },
  props: {
    title2: ["title2"],
  },
  computed: {
    reactiveNameFromParent() {
      return this.getParentsParams();
    },
    getTitle2() {
      if (this.title2) {
        return this.title2;
      }

      if (this.$parent?.$attrs?.title2) {
        return this.$parent?.$attrs?.title2;
      } else {
        return "默认没有title2";
      }
    },
  },
};
</script>

<style scoped lang="less">
</style>
