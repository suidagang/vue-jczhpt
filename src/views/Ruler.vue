<template>
  <div id="app">
    <vue-ruler-tool
      :content-layout="{ left: 200, top: 100 }"
      :is-scale-revise="true"
      :v-model="presetLine"
    >
      <div class="grid-box">
        <div
          class="item-box"
          v-for="item in listBox"
          :key="item.id"
          :style="{
            left: item.x * 200 + 'px',
            top: item.y * 100 + 'px',
            width: item.bW * 200 + 'px',
            height: item.bH * 100 + 'px',
            background: item.color,
          }"
        >
          {{ item.id }}
        </div>
      </div>
      <button style="margin-top: 30px; cursor: pointer" @click="reOrderNew">
        重新排序
      </button>
    </vue-ruler-tool>
  </div>
</template>

<script>
import VueRulerTool from "vue-ruler-tool";
export default {
  name: "app",
  components: {
    VueRulerTool,
  },
  data() {
    return {
      presetLine: [
        { type: "l", site: 100 },
        { type: "v", site: 200 },
      ],
      // oldListBox: [
      //   // {
      //   //   x: 0,
      //   //   y: 0,
      //   //   bW: 1,
      //   //   bH: 1,
      //   //   id: 1,
      //   //   color: "red",
      //   // },
      //   // {
      //   //   x: 1,
      //   //   y: 0,
      //   //   bW: 1,
      //   //   bH: 1,
      //   //   id: 2,
      //   //   color: "orange",
      //   // },
      //   // {
      //   //   x: 2,
      //   //   y: 0,
      //   //   bW: 1,
      //   //   bH: 1,
      //   //   id: 3,
      //   //   color: "Cyan",
      //   // },
      //   // {
      //   //   x: 0,
      //   //   y: 1,
      //   //   bW: 1,
      //   //   bH: 1,
      //   //   id: 4,
      //   //   color: "green",
      //   // },
      //   // {
      //   //   x: 1,
      //   //   y: 1,
      //   //   bW: 1,
      //   //   bH: 1,
      //   //   id: 5,
      //   //   color: "blue",
      //   // },
      //   {
      //     x: 2,
      //     y: 1,
      //     bW: 1,
      //     bH: 1,
      //     id: 6,
      //     color: "purple",
      //   },
      // ],
      oldListBox: [
        {
          x: 1,
          y: 0,
          bW: 1,
          bH: 1,
          id: 1,
          color: "red",
        },
        {
          x: 0,
          y: 0,
          bW: 1,
          bH: 2,
          id: 2,
          color: "orange",
        },
        // {
        //   x: 2,
        //   y: 0,
        //   bW: 1,
        //   bH: 1,
        //   id: 3,
        //   color: "Cyan",
        // },
        // {
        //   x: 1,
        //   y: 1,
        //   bW: 1,
        //   bH: 1,
        //   id: 4,
        //   color: "green",
        // },
        {
          x: 1,
          y: 1,
          bW: 1,
          bH: 1,
          id: 5,
          color: "blue",
        },
        {
          x: 2,
          y: 1,
          bW: 1,
          bH: 1,
          id: 6,
          color: "purple",
        },
      ],
      listBox: [],
    };
  },
  created() {
    this.listBox = JSON.parse(JSON.stringify(this.oldListBox));
  },
  methods: {
    /**
     * @name 重新排序
     * @type1 第一种情况：全部为1*1格子大小的尺寸
     * @type2 第二种情况：只有一个1*2的格子，其余全部为1*1的格子，默认让1*2的格子放中间
     * */
    reOrderNew() {
      //第一种情况
      let isOnlyOneByOne = this.oldListBox.some((item) => {
        if (item.bW !== 1 || item.bH !== 1) {
          return item;
        }
      });
      if (!isOnlyOneByOne) {
        this.dealTypeOne();
        return;
      }
      //判断是否有除1*1和1*2以外的卡片
      let flag = this.oldListBox.some((item) => {
        if (item.bW > 1) {
          return item;
        }
      });
      if (!flag) {
        //找出1*2的卡片
        let bH2List = this.oldListBox.filter((item) => {
          return item.bW === 1 && item.bH === 2;
        });
        if (bH2List.length === 1) {
          // 第二种情况
          this.dealTypeTwo(bH2List);
          return;
        }
      }
      //第三种情况
      this.dealTypeThree();
    },
    /**
     * @name 第一种算法只有1*1格子
     * */
    dealTypeOne() {
      let { topRow, bottomRow } = this.getRowList(this.oldListBox);
      this.dealOneByOneRow(topRow, bottomRow);
    },
    /**
     * @name 第二种算法只有一个1*2，其余都为1*1
     * */
    dealTypeTwo(bH2List) {
      //先把这一张1*2的卡片放在图中间
      bH2List[0].y = 0;
      bH2List[0].x = 1;
      let { topRow, bottomRow } = this.getRowList(this.oldListBox, true);

      this.dealOneByOneRow(topRow, bottomRow, bH2List, 2);
    },
    /**
     * @name 第三种算法，有其余尺寸卡片
     * */
    dealTypeThree() {
      alert("该页面不支持排序");
    },
    /**
     * @name 获取上一排下一排数组
     * @des 由于目前大屏格子布局为2*3（2排3列），最多6张一倍卡
     * @params [listArr]:需要处理的数组
     * @params [exclude]:需要特殊处理的条件
     */
    getRowList(listArr, exclude) {
      let topRow = [];
      let bottomRow = [];
      listArr.forEach((item) => {
        if (exclude && item.bH !== 2) {
          if (item.y === 0) {
            topRow.push(item);
          } else {
            bottomRow.push(item);
          }
        }
      });
      return {
        topRow,
        bottomRow,
      };
    },
    /**
     * @name 上下排处理,下排往上排移动
     * @params [topRow]：上一排的数组
     * @params [bottomRow]：下一排的数组
     * @params [bH2List]:需要组合的数据
     * @params [rowLen]：一排最多显示几个（默认为3）
     * */
    dealOneByOneRow(topRow, bottomRow, bH2List = [], rowLen = 2) {
      let topLen = topRow.length;
      let bottomLen = bottomRow.length;
      let exclude = 0;
      if (rowLen === 2) {
        exclude = 1;
      }
      //上一排还差多少？
      let topNeedLen = 0;
      //说明上一排的格式不够，需要下一排来补
      if (topRow.length < rowLen) {
        topNeedLen = rowLen - topLen;
        //下一排够补上一排
        if (bottomLen >= topNeedLen) {
          let needArr = bottomRow.splice(0, topNeedLen);
          needArr.map((item, index) => {
            item.y = 0;
            item.x = rowLen + index;
            return item;
          });

          topRow = this.rowOrder([...topRow, ...needArr], exclude);
          bottomRow = this.rowOrder(bottomRow, exclude);
          this.listBox = [...topRow, ...bottomRow, ...bH2List];
        } else {
          //不够，全部为上一排
          bottomRow.map((item, index) => {
            item.y = 0;
            item.x = rowLen + index;
            return item;
          });
          topRow = this.rowOrder([...topRow, ...bottomRow], exclude);
          this.listBox = [...topRow, ...bH2List];
        }
      } else {
        topRow = this.rowOrder(topRow, exclude);
        bottomRow = this.rowOrder(bottomRow, exclude);
        this.listBox = [...bottomRow, ...topRow, ...bH2List];
      }
    },
    /**
     * @name 同一排排序处理
     * @params [listArr]：需要排序的数组
     * @params [dealIndex]：固定占位需要特殊处理
     * */
    rowOrder(listArr, dealIndex) {
      //排序
      listArr.sort((a, b) => {
        return a.x - b.x;
      });
      listArr.map((item, index) => {
        if (dealIndex && index === dealIndex) {
          return (item.x = index + dealIndex);
        }
        return (item.x = index);
      });
      return listArr;
    },
  },
};
</script>
<style lang="less" scoped>
.grid-box {
  position: relative;
  width: 600px;
  height: 200px;
  box-sizing: border-box;
  background: pink;
  overflow: hidden;
  .item-box {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    width: 200px;
    box-sizing: border-box;
    overflow: hidden;
    font-size: 40px;
    color: #fff;
  }
}
</style>