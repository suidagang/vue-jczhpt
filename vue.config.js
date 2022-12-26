const path = require("path");
const UselessFile = require('useless-files-webpack-plugin');
const webpack = require("webpack");
// import UselessFile from 'useless-files-webpack-plugin'
module.exports = {
    pluginOptions: {
        "style-resources-loader": {
            preProcessor: "less",
            patterns: [
                // 这个是加上自己的路径,不能使用(如下:alias)中配置的别名路径
                path.resolve(__dirname, "./src/theme/style.less"),
            ],
        },
    },
    // 会接收一个基于 webpack-chain 的 ChainableConfig 实例。
    // 允许对内部的 webpack 配置进行更细粒度的修改。
    chainWebpack: config => {
        const svgRule = config.module.rule('svg')
        svgRule.uses.clear()
        svgRule
            .test(/\.svg$/)
            .include.add(path.resolve(__dirname, './src/icons/svg'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
        const fileRule = config.module.rule('file')
        fileRule.uses.clear()
        fileRule
            .test(/\.svg$/)
            .exclude.add(path.resolve(__dirname, './src/icons/svg'))
            .end()
            .use('file-loader')
            .loader('file-loader')
        // const cdn = {
        //     // 访问https://unpkg.com/element-ui/lib/theme-chalk/index.css获取最新版本
        //     css: ["//unpkg.com/element-ui@2.10.1/lib/theme-chalk/index.css"],
        //     js: [
        //         "//unpkg.com/vue@2.6.10/dist/vue.min.js", // 访问https://unpkg.com/vue/dist/vue.min.js获取最新版本
        //     ]
        // };
        // use show markdown file
        config.module
            .rule('md')
            .test(/\.md$/)
            .use('html-loader')
            .loader('html-loader')
            .end()
            .use('markdown-loader')
            .loader('markdown-loader')
            .end();
        config.plugin('uselessFile')
            .use(
                new UselessFile({
                    root: './src', // 项目目录
                    out: './fileList.json', // 输出文件列表
                    clean: false, // 是否删除文件,
                    exclude: [/node_modules/] // 排除文件列表
                })
            )
        // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
        // config.plugin("html").tap(args => {
        //     // html中添加cdn
        //     args[0].cdn = cdn;
        //     return args;
        // });

    },
    // configureWebpack: config => {
    //     config.externals = {
    //         vue: "Vue"
    //     };
    // }
}
