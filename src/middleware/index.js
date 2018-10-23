import path from 'path'
import bodyParser from 'koa-bodyparser'
import staticFiles from 'koa-static'

import Log from './log'
import Send from './send'
import Func from './func'
// import Auth from './auth'

export default app => {
  //缓存拦截器
  app.use(async (ctx, next) => {
    if (ctx.url == '/favicon.ico') return
    await next()
    ctx.status = 200
    ctx.set('Cache-Control', 'must-revalidation')
    if (ctx.fresh) {
      ctx.status = 304
      return
    }
  })

  app.use(Log())

  app.use(Send())
  app.use(Func())

  //post请求中间件 body转json
  app.use(bodyParser())

  // 静态文件
  app.use(staticFiles(path.resolve(__dirname, '../../static')))

  // 增加错误的监听处理
  app.on('error', (err, ctx) => {
    if (ctx && !ctx.headerSent && ctx.status < 500) {
      ctx.status = 500
    }
    if (ctx && ctx.log && ctx.log.error) {
      if (!ctx.state.logged) {
        ctx.log.error(err.stack)
      }
    }
  })
}
