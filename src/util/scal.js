/**
 * @desc 修正浏览器缩放处理
 * @data 2022年11月9日
 * @author sg
 * 
 * */

class BrowserZoomCorrect {
    constructor() { }
    // 系统名称，windows和mac的devicePixelRatio不一样，windows = 1，mac = 2
    static #systemName = '';
    // 获取系统类型
    _getSystem() {
        let agent = navigator.userAgent.toLowerCase();
        let isMac = /macintosh|mac os x/i.test(navigator.userAgent);
        if (isMac) {
            BrowserZoomCorrect.#systemName = 'mac';
            return true;
        }
        if (agent.indexOf("windows") >= 0) {
            BrowserZoomCorrect.#systemName = 'windows';
            return true;
        }
    }
    //监听方法兼容写法
    _addHandler(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    }
    //校正浏览器缩放比例
    _correct() {
        let t = this;
        if (BrowserZoomCorrect.#systemName === 'windows') {
            document.getElementsByTagName('body')[0].style.zoom = 1 / window.devicePixelRatio;
        } else if (BrowserZoomCorrect.#systemName === 'mac') {
            document.getElementsByTagName('body')[0].style.zoom = 2 / window.devicePixelRatio;

        }
    }
    //监听页面缩放
    _watch() {
        let t = this;
        //注意这个方法是解决全局有两个window.resize
        t._addHandler(window, 'resize', () => {
            //重新校正
            t._correct()
        })
    }
    //初始化页面比例
    init() {
        let t = this;
        //判断设备，目前只在windows和mac系统下校正浏览器缩放比例
        if (t._getSystem()) {
            //初始化页面校正浏览器缩放比例
            t._correct();
            //开启监听页面缩放
            t._watch();
        }
    }
}

// export
export default BrowserZoomCorrect;
