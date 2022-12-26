<template>
  <svg aria-hidden="true" class="svg-icon">
    <use :xlint:href="icon"></use>
  </svg>
</template>

<script>
export default {
  name: "icon-svg",
  props: {
    name: {
      type: String,
      require: true,
    },
  },
  computed: {
    icon() {
      return `#icon-${this.name}`;
    },
  },
  data() {
    return {};
  },
  components: {},
};
</script>

<style scoped lang="less">
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
