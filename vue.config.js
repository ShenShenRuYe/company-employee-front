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

/**以下是nginx配置文件
 * 
 *     # 转发 API 请求到 localhost:8000
    location /api/ {
        proxy_pass http://localhost:8000;  # 将请求转发到本地的8000端口
        proxy_set_header Host $host;       # 保持 Host 头
        proxy_set_header X-Real-IP $remote_addr;  # 保持客户端真实IP
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  # 保持原始客户端IP
        proxy_set_header X-Forwarded-Proto $scheme;  # 保持请求协议
        proxy_redirect off;  # 禁止重定向
        rewrite ^/api(/.*)$ /api/v1$1 break;  # 将 /api 重写为 /api/v1
    }
 */