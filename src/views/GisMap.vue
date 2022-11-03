<template>
  <div class="gismap" ref="gisMap" id="map">公共地图1</div>
</template>

<script>
import { TGISMap } from "tgismap";
export default {
  data() {
    return {};
  },
  mounted() {
    var map = TGISMap.initMap({
      container: this.$refs.gisMap, // 必填项，(HTMLElement | string) ，进行地图渲染的HTML元素，或该元素的字符串id
      //自定义layers
      layers: [
        {
          serviceType: "WMTS", //服务类型
          serviceUrl:
            "http://124.114.202.110:15234/tianditu/service/vec_c/getTile?z={z}&x={x}&y={y}&tk=ca1de17ed90d29bcef88358c2dde6d99", //服务地址
          tileSize: 256, //切片大小
          minzoom: 1, //图层最小级别
          maxzoom: 8, //图层最大级别
          id: "tianditu_tiles_layer", //图层唯一id
        },
        {
          serviceType: "WMTS",
          serviceUrl:
            "http://124.114.202.110:15234/tianditu/service/img_c/getTile?z={z}&x={x}&y={y}&tk=ca1de17ed90d29bcef88358c2dde6d99",
          tileSize: 256,
          minzoom: 8,
          maxzoom: 15,
          id: "tianditu_tiles_layer_2",
        },
      ],
      minZoom: 1.5, //地图缩放最小级别
      maxZoom: 14, //地图缩放最大级别
      center: [113.726533, 37.012005], // 非必填，([x,y]) ，初始中心点坐标,默认[0,0]
      zoom: 3, // 非必填，(Number) ,地图初始的缩放比例,默认值0
      pitch: 0, //非必填，(Number) ,地图初始化时的倾角，按偏离屏幕水平面的度数计量，默认是0
    });
    map.setCenter([112, 32]); //设置中心点
    // map.setZoom(7); //设置地图缩放级别为7级
    // map.setPitch(20); //设置倾角(0-90)
    // map.flyTo({ center: [0, 0], zoom: 1 });
    $.getJSON(
      "http://124.114.202.110:15248/data/webgis/testGeoData/shanxiAndNextLevel.json",
      function (testData) {
        map.addSource("polygonSource", {
          type: "geojson",
          data: testData,
        });
        map.addLayer({
          id: "polygonLayer",
          type: "fill", //图层渲染样式："fill"填充型
          source: "polygonSource",
          layout: {},
          paint: {
            "fill-color": "#ff0000", //填充颜色
            "fill-opacity": 0.6, //填充透明度
          },
        });
      }
    );
    // const bbox = [
    //   [-79, 43],
    //   [-73, 45],
    // ];
    // map.fitBounds(bbox);
  },
  components: {},
};
</script>

<style scoped lang="less">
.gismap {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
