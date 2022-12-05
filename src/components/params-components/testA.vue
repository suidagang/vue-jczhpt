<template>
  <div class="container">
    第一层子组件{{ title }}
    <TestB />
  </div>
</template>

<script>
import TestB from "./testB.vue";
export default {
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  components: { TestB },
};
</script>

<style scoped lang="less">
</style>
