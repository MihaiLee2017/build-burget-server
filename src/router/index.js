import path from 'path'
import koaRouter from 'koa-router'
const router = koaRouter()

export default app => {
  router.get('/client_api/test', async (ctx, next) => {
    // ctx.send({ url: '/client_api/test' }, 'get success')
    ctx.sendError('get error')
  })
  app.use(router.routes()).use(router.allowedMethods())
}
