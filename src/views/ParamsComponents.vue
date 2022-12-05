<template>
  <div class="container">
    组件传参
    <TestA :title="title" :title2="title2" />
  </div>
</template>

<script>
import TestA from "../components/params-components/testA.vue";
export default {
  provide() {
    return {
      //   parentsParams: this.parentObj.title,
      getParentsParams: () => this.parentObj.title,
    };
  },
  data() {
    return {
      title: "333",
      title2: "444",
      parentObj: {
        title: "父级内容",
      },
    };
  },
  mounted() {
    setTimeout(() => {
      this.parentObj.title = "最父级内容改变了";
      this.title = "1111";
      this.title2 = "555";
    }, 2000);
  },
  computed: {
    computedParent() {
      return this.parentObj;
    },
  },
  components: { TestA },
};
</script>

<style scoped lang="less">
</style>
