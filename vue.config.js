const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
// 访问api的时候转向 target/api/v1 方便之后api的升级 为部署做准备
module.exports={
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:8000',//后端接口地址
        changeOrigin: true,//是否允许跨越
        secure: true,  // 如果是https接口，需要配置这个参数为true
        pathRewrite: {
          '^/api': '/api/v1'//重写,
        }
      }
    }
  },
  publicPath: './'
}
