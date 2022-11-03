const path = require('path')
const fs = require('fs')
// 把 index.html 拷贝到 public 下
fs.copyFileSync(path.resolve('./index.html'), path.resolve('./public/index.html'))