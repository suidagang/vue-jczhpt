const echartsResizeMixin = {
  methods: {
    resize() {
      // 当宽高变化时就会执行
      // 执行某些操作 重新改变图表， 同时传参，设置动画效果
      this.myChart.resize({ animation: { duration: 1000 } });
    },
  },
  // 自定义指令，图表的宽度采用百分比，父盒子宽度变化，那图表盒子大小也变化了，但是图表不会重新绘制
  // 原理：判断盒子本身宽度改变了，再调用echarts的resize方法重新绘制
  directives: {
    // 使用局部注册指令的方式
    resize: {
      // 指令的名称
      bind(el, binding) {
        // el为绑定的元素，binding为绑定给指令的对象
        let width = '';
        let height = '';
        function isReize() {
          // 这个方法可以获取元素的css样式对象
          const style = document.defaultView.getComputedStyle(el);
          // 对比跟上次宽度是否改变，如果改变了
          if (width !== style.width || height !== style.height) {
            // 调用resize方法
            binding.value(); // 关键
          }
          // 记录当前宽高
          width = style.width;
          height = style.height;
        }
        // 设置监听器，每隔一段时间对比看看
        // eslint-disable-next-line no-underscore-dangle, no-param-reassign
        el._vueSetInterval = setInterval(isReize, 300);
      },
      // 只调用一次，指令与元素解绑时调用
      unbind(el) {
        // 清除定时器
        // eslint-disable-next-line no-underscore-dangle
        clearInterval(el._vueSetInterval);
      },
    },
  },
};

export { echartsResizeMixin };
