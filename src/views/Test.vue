<template>
  <div class="container">
    <div v-if="pageId == 1">显示id为1的组件</div>
    <div v-if="pageId == 2">显示id为2的组件</div>
    <markdown-it-vue class="md-body" :content="content" />
    <button @click="goPage(1)">跳转1</button>
    <button @click="goPage(2)">跳转2</button>
  </div>
</template>

<script>
import MarkdownItVue from "markdown-it-vue";
import "markdown-it-vue/dist/markdown-it-vue.css";
import MarkdownText from "./test";
export default {
  data() {
    return {
      pageId: "",
      content: MarkdownText,
    };
  },
  components: {
    MarkdownItVue,
  },
  mounted() {
    // this.getAjax(1);
  },
  methods: {
    getAjax(num) {
      this.pageId = num;
    },
    goPage(num) {
      console.log("id:", this.$route.params.id, "num:", num);
      if (this.$route.params.id == num) {
        return;
      } else {
        this.$router.push("/test/" + num);
      }
    },
  },
  watch: {
    $route() {
      console.log(this.$route.params.id, "--==---");
      this.getAjax(this.$route.params.id);
    },
  },
};
</script>

<style scoped lang="less">
.container {
  padding: 20px;
  text-align: left;
}
</style>
