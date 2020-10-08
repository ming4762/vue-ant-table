module.exports = {
  publicPath: './',
  // 将 examples 目录添加为新的页面
  pages: {
    index: {
      // page 的入口c
      entry: 'examples/main.ts',
      // 模板来源
      template: 'public/index.html',
      // 输出文件名
      filename: 'index.html'
    }
  }
}