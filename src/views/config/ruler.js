/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/**
 * @name 重新排序
 * @type1 第一种情况：全部为1*1格子大小的尺寸
 * @type2 第二种情况：只有一个1*2的格子，其余全部为1*1的格子，默认让1*2的格子放中间
 * TODO 第三种情况：排除情况一和情况二之外的页面配置，暂时不支持排序（后续可根据需要完善代码）
 * @autor sg
 * @DETA 2022/12
 * */
class pageReOrder {
    /**
     * @params 【listBox：需要排序的数组】
     * @params 【x：盒子距离页面左上角原点的横向偏移】
     * @params 【y：盒子距离页面左上角原点的纵向偏移】
     * @params 【bW：盒子宽度】
     * @params 【bH：盒子高度】
     * */
    constructor(listBox, x, y, bW, bH) {
        this.listBox = listBox;
        this.x = x;
        this.y = y;
        this.bW = bW;
        this.bH = bH;
    }

    /**
     * @name 第一种算法只有1*1格子
     * */
    _dealTypeOne() {
        const { topRow, bottomRow } = this._getRowList(this.listBox);
        this._dealOneByOneRow(topRow, bottomRow);
    }

    /**
     * @name 第二种算法只有一个1*2，其余都为1*1
     * */
    _dealTypeTwo(bH2List) {
        const bH2ListNew = bH2List;
        // 先把这一张1*2的卡片放在图中间
        bH2ListNew[0][this.y] = 0;
        bH2ListNew[0][this.x] = 1;
        const { topRow, bottomRow } = this._getRowList(this.listBox, true);
        this._dealOneByOneRow(topRow, bottomRow, bH2ListNew, 2);
    }

    /**
     * @name 第三种算法，有其余尺寸卡片
     * */
    _dealTypeThree() {
        alert('该页面暂不支持排序');
    }

    /**
     * @name 处理xy定位在容器之外的情况
     * @des  因为目前的卡片布局为2*3的方式
     * */
    _dealDataToCurrent(listArr) {
        listArr.map((item) => {
            if (item[this.x] >= 2) {
                item[this.x] = 2;
            }
            if (item[this.y] >= 1) {
                item[this.y] = 1
            }
            return item;
        })
        return listArr;
    }

    /**
     * @name 获取上一排下一排数组
     * @des 由于目前大屏格子布局为2*3（2排3列），最多6张一倍卡
     * @params [listArr]:需要处理的数组
     * @params [exclude]:需要特殊处理的条件(第二种情况获取上一排或者下一排需要排除盒子高度为2的卡片)
     */
    _getRowList(listArr, exclude) {
        const topRow = [];
        const bottomRow = [];
        listArr.forEach((item) => {
            if (!exclude || (exclude && item[this.bH] !== 2)) {
                if (item[this.y] === 0) {
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
    }

    /**
     * @name 上下排处理,下排往上排移动
     * @params [topRow]：上一排的数组
     * @params [bottomRow]：下一排的数组
     * @params [bH2List]:需要组合的数据
     * @params [rowLen]：一排最多显示几个（默认为3）
     * */
    _dealOneByOneRow(topRow, bottomRow, bH2List = [], rowLen = 3) {
        const topLen = topRow.length;
        const bottomLen = bottomRow.length;
        let exclude = 0;
        if (rowLen === 2) {
            exclude = 1;
        }
        // 上一排还差多少？
        let topNeedLen = 0;
        // 说明上一排的格式不够，需要下一排来补
        if (topLen < rowLen) {
            topNeedLen = rowLen - topLen;
            // 下一排够补上一排
            if (bottomLen >= topNeedLen) {
                const needArr = bottomRow.splice(0, topNeedLen);
                needArr.map((item, index) => {
                    item[this.y] = 0;
                    item[this.x] = rowLen + index;
                    return item;
                });

                topRow = this._rowOrder([...topRow, ...needArr], exclude);
                bottomRow = this._rowOrder(bottomRow, exclude);
                this.listBox = [...topRow, ...bottomRow, ...bH2List];
            } else {
                // 不够，全部为上一排
                bottomRow.map((item, index) => {
                    item[this.y] = 0;
                    item[this.x] = rowLen + index;
                    return item;
                });
                topRow = this._rowOrder([...topRow, ...bottomRow], exclude);
                this.listBox = [...topRow, ...bH2List];
            }
        } else {
            topRow = this._rowOrder(topRow, exclude);
            bottomRow = this._rowOrder(bottomRow, exclude);
            this.listBox = [...bottomRow, ...topRow, ...bH2List];
        }
    }

    /**
     * @name 同一排排序处理
     * @params [listArr]：需要排序的数组
     * @params [dealIndex]：固定占位需要特殊处理
     * */
    _rowOrder(listArr, dealIndex) {
        // 排序
        listArr.sort((a, b) => {
            return a[this.x] - b[this.x];
        });
        listArr.map((item, index) => {
            if (dealIndex && index === dealIndex) {
                item[this.x] = index + dealIndex;
                return item;
            }
            item[this.x] = index;
            return item;
        });
        return listArr;
    }

    init() {
        return new Promise((resolve) => {
            //把超出容器的盒子校正数据
            this.listBox = this._dealDataToCurrent(this.listBox);
            // 第一种情况
            const isOnlyOneByOne = this.listBox.some((item) => {
                if (item[this.bW] !== 1 || item[this.bH] !== 1) {
                    return item;
                }
            });
            if (!isOnlyOneByOne) {
                this._dealTypeOne();
                resolve(this.listBox)
                return;
            }
            // 判断是否有除1*1和1*2以外的卡片
            const flag = this.listBox.some((item) => {
                if (item[this.bW] > 1) {
                    return item;
                }
            });
            if (!flag) {
                // 找出1*2的卡片
                const bH2List = this.listBox.filter((item) => {
                    return item[this.bW] === 1 && item[this.bH] === 2;
                });
                if (bH2List.length === 1) {
                    // 第二种情况
                    this._dealTypeTwo(bH2List);
                    resolve(this.listBox)
                    return;
                }
            }
            // 第三种情况
            this._dealTypeThree();
            resolve(this.listBox)
        })

    }
}
export default pageReOrder;
