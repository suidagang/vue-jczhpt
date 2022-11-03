<template>
  <div class="home" ref="home">
    <comEcharts
      :style="{ height: eH + 'px', width: eW + 'px' }"
      :options="option"
      :finished="finished"
    />
    <!-- <div id="dom" ></div> -->
    <button @click="scaleEcharts" class="da">放大</button>
    <button @click="minEcharts">缩小</button>

    <button @click="defaultTheme">默认主题</button>
    <button @click="dark">暗黑主题</button>
    <button @click="custom">自定义主题</button>
    <img src="../../cdn/book.png" alt="" />
  </div>
</template>

<script>
import { setTheme } from "../theme/theme";
import comEcharts from "../components/com-echarts/index.vue";
export default {
  name: "Home",
  data() {
    return {
      eW: "500",
      eH: "500",
      myEcharts: null,
      option: {},
      timer: null,
      index: 0,
    };
  },
  components: {
    comEcharts,
  },
  mounted() {
    var colorList = ["#DF3AB9", "#18C79C", "#8555F9", "#F09228"];
    var data = [
      {
        name: "持续加固",
        value: 41,
        number: 502.4,
      },
      {
        name: "新建",
        value: 92,
        number: 302.1,
      },
      {
        name: "改建",
        value: 20,
        number: 502.9,
      },
      {
        name: "扩建",
        value: 2,
        number: 666.0,
      },
    ];
    var newData = [];
    // 加阴影效果
    for (var i = 0; i < data.length; i++) {
      newData.push({
        value: data[i].value,
        name: data[i].name,
        itemStyle: {
          normal: {
            // borderWidth: 0,
            shadowBlur: 15,
            // borderRadius: 1,
            // borderColor: colorList[i],
            shadowColor: colorList[i],
          },
        },
      });
    }
    this.option = {
      title: {
        text: "建设性质",
        left: "39%",
        top: "center",
        // x: 'left',
        // y: 'center',
        textStyle: {
          fontSize: 24,
        },
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          type: "pie",
          center: ["50%", "50%"],
          radius: ["50%", "70%"],
          clockwise: true,
          tooltip: {
            trigger: "item",
            formatter: function (params) {
              return (
                params.name +
                "：" +
                params.value +
                "个<br>占比：" +
                params.percent.toFixed(1) +
                "%"
              );
            },
            backgroundColor: "#f3f3f3",
            textStyle: {
              color: "#666666",
              fontSize: 14,
              fontWeight: 500,
            },
            padding: [10, 20],
            extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);",
          },
          itemStyle: {
            normal: {
              color: function (params) {
                return colorList[params.dataIndex];
              },
              // shadowBlur: 20,
              // shadowColor: function (params) {
              //     return colorListShadow[params.dataIndex];
              // },
            },
          },
          label: {
            show: false,
            position: "outside",
            formatter: "{a|{b}：{d}%}\n{hr|}",
            rich: {
              hr: {
                backgroundColor: "t",
                borderRadius: 1,
                width: 1,
                height: 1,
                padding: [1, 1, 0, -4],
              },
              a: {
                padding: [-15, 7, -10, 7],
              },
            },
          },
          labelLine: {
            normal: {
              length: 10,
              length2: 15,
              lineStyle: {
                width: 1,
              },
            },
          },
          data: newData,
        },
      ],
    };
  },
  methods: {
    finished(myChart, options) {
      let len = options.series[0].data.length;
      // console.log("finish回调", this.index);
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        // myChart.dispatchAction({
        //   type: "pieSelect",
        //   seriesIndex: 0,
        //   dataIndex: this.index === 0 ? len - 1 : this.index - 1,
        // });
        myChart.dispatchAction({
          type: "hideTip",
          seriesIndex: 0,
          dataIndex: this.index === 0 ? len - 1 : this.index - 1,
        });
        // 显示提示框
        myChart.dispatchAction({
          type: "showTip",
          seriesIndex: 0,
          dataIndex: this.index,
        });
        // 取消高亮指定的数据图形
        myChart.dispatchAction({
          type: "downplay",
          seriesIndex: 0,
          dataIndex: this.index === 0 ? len - 1 : this.index - 1,
        });
        myChart.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: this.index,
        });
        this.index++;
        if (this.index > len - 1) {
          this.index = 0;
        }
      }, 2000);
    },
    init() {
      setTheme("default"); // 初始化未默认主题
    },
    // 更改为默认主题
    defaultTheme() {
      setTheme("default");
    },
    // 更改为暗黑主题
    dark() {
      setTheme("dark");
    },
    // 更改为自定义主题
    custom() {
      let newColor = {
        r: 0,
        g: 100,
        b: 0,
      };
      let newPrimaryColor = `${newColor.r},${newColor.g},${newColor.b}`;
      localStorage.setItem("primaryTextColor", newPrimaryColor); // 将新的主题色存入本地
      setTheme();
    },
    minEcharts() {
      this.eW = Number(this.eW) - 50;
      this.eH = Number(this.eH) - 50;
    },
    scaleEcharts() {
      this.eW = Number(this.eW) + 50;
      this.eH = Number(this.eH) + 50;
    },
    getStyle(obj, attr) {
      if (obj.currentStyle) {
        //用于IE
        return obj.currentStyle[attr];
      } else {
        // document.defaultView.getComputedStyle 该方法时DOM2中才出现的方法
        return document.defaultView.getComputedStyle(obj, null)[attr];
        //getComputedStyle DOM1中的方法
        //return getComputedStyle(obj,false)[attr];
      }
    },
  },
};
</script>

<style lang="less" scoped>
#dom {
  border: 1px solid purple;
}
.home {
  font-size: 16px;
}
.da {
  color: rgba(@primaryTextColor, 1);
  background: rgba(@primaryTextColor, 1);
}
button {
  height: 28px;
  min-width: 60px;
  padding: 0 10px;
  margin-left: 10px;
  font-size: 18px;
  border: 0;
}
</style>
