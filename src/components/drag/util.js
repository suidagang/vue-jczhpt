/* 获取拖拽元素是否超出容器范围 */
export const judgeIsOut = (dragObj, range) => {
  let outFlag = false;
  if (dragObj.x < 0 || dragObj.x + dragObj.w > range.colNum || dragObj.y < 0 || dragObj.y + dragObj.h > range.rowNum) {
    outFlag = true;
  }
  return outFlag;
};

/* 获取两块区域是否有重叠部分 */
export const judgeOverlap = (aArea, bArea) => {
  // 筛选出涉及但不是包含关系的元素
  // 假定矩形是用一对点表达的(minx, miny) (maxx, maxy)，那么两个矩形
  //       rect1{(minx1, miny1)(maxx1, maxy1)}
  //       rect2{(minx2, miny2)(maxx2, maxy2)}
  // 相交的结果一定是个矩形，构成这个相交矩形rect{(minx, miny) (maxx, maxy)}的点对坐标是：
  //       minx    =    max(minx1,    minx2)
  //       miny    =    max(miny1,    miny2)
  //       maxx    =    min(maxx1,    maxx2)
  //       maxy    =    min(maxy1,    maxy2)
  // 如果两个矩形不相交，那么计算得到的点对坐标必然满足：
  //   （ minx   >   maxx ） 或者 （ miny   >   maxy ）
  const [minx, miny, maxx, maxy] = [
    Math.max(aArea.x, bArea.x),
    Math.max(aArea.y, bArea.y),
    Math.min(aArea.x + aArea.w, bArea.x + bArea.w),
    Math.min(aArea.y + aArea.h, bArea.y + bArea.h),
  ];
  if (minx < maxx && miny < maxy) {
    return true;
  }
  return false;
};

/* 获取涉及以及包含的元素 */
export const getInvolveAndContain = (dragObj, list) => {
  const involve = []; /* 所涉及到的元素 */
  const contain = []; /* 所包含的元素 */
  const total = [];
  // involve和contain需要互斥,所以放在一起处理
  for (let j = 0; j < list.length; j++) {
    const tempj = list[j];
    if (tempj.i === dragObj.i) {
      // 跳过当前元素
      // eslint-disable-next-line no-continue
      continue;
    }
    // 优先处理contain
    // 判断列表中元素完全被包含在阴影面积中，即x, y, x+w, y+h符合条件
    if (
      tempj.x >= dragObj.x &&
      tempj.y >= dragObj.y &&
      tempj.x + tempj.w <= dragObj.x + dragObj.w &&
      tempj.y + tempj.h <= dragObj.y + dragObj.h
    ) {
      contain.push(tempj);
      total.push(tempj);
      // eslint-disable-next-line no-continue
      continue;
    }
    if (judgeOverlap(tempj, dragObj)) {
      involve.push(tempj);
      total.push(tempj);
      // eslint-disable-next-line no-continue
      continue;
    }
  }
  return { involve, contain, total };
};

export const changeOtherStatic = (id, list, status) => {
  /* true改变其他元素static元素状态为true
  false改变所有元素为false
  */
  for (let j = 0; j < list.length; j++) {
    const tempj = list[j];
    if ((status && tempj.i !== id) || !status) {
      tempj.static = status;
    }
  }
};

/* 获取两块区域重叠部分的格子数量（面积） */
export const getOverlap = (aArea, bArea) => {
  const overlapSize = {
    area: 0,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  };
  // 筛选出涉及但不是包含关系的元素
  // 假定矩形是用一对点表达的(minx, miny) (maxx, maxy)，那么两个矩形
  //       rect1{(minx1, miny1)(maxx1, maxy1)}
  //       rect2{(minx2, miny2)(maxx2, maxy2)}
  // 相交的结果一定是个矩形，构成这个相交矩形rect{(minx, miny) (maxx, maxy)}的点对坐标是：
  //       minx    =    max(minx1,    minx2)
  //       miny    =    max(miny1,    miny2)
  //       maxx    =    min(maxx1,    maxx2)
  //       maxy    =    min(maxy1,    maxy2)
  // 如果两个矩形不相交，那么计算得到的点对坐标必然满足：
  //   （ minx   >   maxx ） 或者 （ miny   >   maxy ）
  const [minx, miny, maxx, maxy] = [
    Math.max(aArea.x, bArea.x),
    Math.max(aArea.y, bArea.y),
    Math.min(aArea.x + aArea.w, bArea.x + bArea.w),
    Math.min(aArea.y + aArea.h, bArea.y + bArea.h),
  ];
  if (minx < maxx && miny < maxy) {
    overlapSize.x = minx;
    overlapSize.y = miny;
    overlapSize.w = maxx - minx;
    overlapSize.h = maxy - miny;
    overlapSize.area = overlapSize.w * overlapSize.h;
  }
  return overlapSize;
};

/** 校正宽高
 * 在对外进行数据双向绑定的时候，因为实现的限制，在设置元素单位尺寸（宽，高）的时候，
   可能需要对此始的数据进行修饰，将对应的宽（w）高（h）：传入时 +1（单元格）；传出时 -1（单元格）；
 * @param {String} type: 修正类型，in/out:  in+1; out-1;
 * @param {Object: {width: Boolean, height: Boolean}} flagObj: 修正标识，是否处理宽高;
 * @param {Object} data: 数据;
 */
export const correctSize = (type, flagObj, data) => {
  const item = data;
  const addFlag = type === 'in' ? 1 : -1;
  if (type === 'in') {
    item.w = item.kpkd * 1 + (flagObj.width ? addFlag : 0);
    item.h = item.kpgd * 1 + (flagObj.height ? addFlag : 0);
    item.kpkd = item.w;
    item.kpgd = item.h;
  } else {
    item.kpkd = item.w * 1 + (flagObj.width ? addFlag : 0);
    item.kpgd = item.h * 1 + (flagObj.height ? addFlag : 0);
    item.w = item.kpkd;
    item.h = item.kpgd;
  }
  // 需要校正width
  if (flagObj.width) {
    if (item.dpkpstkd) {
      item.dpkpstkd = item.dpkpstkd * 1 + addFlag;
    }
    if (item.dpkpzdzskd) {
      item.dpkpzdzskd = item.dpkpzdzskd * 1 + addFlag;
    }
  }
  // 需要校正height
  if (flagObj.height) {
    if (item.dpkpstgd) {
      item.dpkpstgd = item.dpkpstgd * 1 + addFlag;
    }
    if (item.dpkpzdzsgd) {
      item.dpkpzdzsgd = item.dpkpzdzsgd * 1 + addFlag;
    }
  }
  return item;
};
