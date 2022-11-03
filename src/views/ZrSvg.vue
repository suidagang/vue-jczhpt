<template>
  <div class="svgBox" :style="{ width: `${size}px`, height: `${size}px` }">
    <img
      :src="require(`../svg/${type}.svg`)"
      v-bind="{ alt: alt || type, width: size, height: size }"
      :style="
        color
          ? {
              marginLeft: `-${size}px`,
              filter: `drop-shadow(${color} ${size}px 0)`,
            }
          : null
      "
    />
  </div>
</template>
<script>
/**
 * @type 图标类型
 * @size 图标尺寸
 * @color 图标颜色
 * @alt img的alt属性，seo需要，默认取值type
 * description：如果有动态颜色在页面组件中通过css修改,如下
 *  /deep/ img {
 *   margin-left: -20px;
 *   filter: drop-shadow(red 20px 0);
 *  }
 */
export default {
  props: {
    type: {
      type: String,
      require: true,
    },
    size: {
      type: Number | String,
      default: 20,
    },
    color: String,
    alt: String,
  },
};
</script>
<style lang="less" scoped>
.svgBox {
  display: inline-block;
  vertical-align: middle;
  overflow: hidden;
  img {
    float: left;
  }
}
</style>