<template>
  <div class="basic-chart" ref="echarts"></div>
</template>

<script>
import { throttle } from "lodash-es";
import * as echarts from "echarts";

const elementResizeDetectorMaker = require("element-resize-detector");

const erd = elementResizeDetectorMaker();
export default {
  name: "com-echarts",
  data() {
    return {
      myChart: null,
      myChartDom: null,
    };
  },
  props: {
    options: {
      type: Object,
      require: true,
    },
    finished: Function,
  },
  mounted() {
    this.$nextTick(() => {
      erd.listenTo(this.$refs.echarts, this.resizeFunc);
    });
    // window.addEventListener("resize", this.throttle);
  },
  beforeDestroy() {
    erd.uninstall(this.$refs.echarts);
    // window.removeEventListener("resize", this.throttle);
  },
  methods: {
    // 重绘函数
    resizeFunc() {
      this.$nextTick(() => {
        // 使echarts尺寸重置
        this.myChart.resize();
      });
    },

    throttle: throttle(() => {
      this.initEcharts();
    }, 100),

    // 初始化统计图
    initEcharts() {
      this.$nextTick(() => {
        if (
          this.myChart !== null &&
          this.myChart !== "" &&
          this.myChart !== undefined
        ) {
          this.myChart.dispose(); // 销毁
        }
        this.myChartDom = this.$refs.echarts;
        this.myChart = this.$echarts.init(this.myChartDom, "themeName");
        this.myChart.setOption(this.options);
        if (this.finished) {
          this.myChart.on("finished", () => {
            this.finished(this.myChart, this.options);
          });
        }
      });
    },
  },
  watch: {
    options: {
      handler() {
        console.log("刷新---echarts");
        this.initEcharts();
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="less" scoped>
.basic-chart {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
