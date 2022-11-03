import { defineConfig, loadEnv } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
export default defineConfig(({ mode }) => {
    // 加载环境变量，因为 vite 中不会加载以 VUE 开头的，我们得自己指定下
    const envPrefix = ['VUE']
    const env = loadEnv(mode, process.cwd(), envPrefix)
    return {
        plugins: [
            createHtmlPlugin({
                minify: true,
                template: './index.html',
                entry: '/src/main.js', // 这个会帮我们注入入口 js 文件
                inject: {
                    data: {
                        // 这是我们 index.html 用到的环境变量
                        ...env
                    }
                }
            })
        ]
    }
})