import path from 'path'
import koaRouter from 'koa-router'
import jwt from 'jsonwebtoken'
import conf from '../config'
import user_controller from '../controller/admin/user'
const router = koaRouter()
export default app => {
  /**
   * ******************* admin api *****************************
   */
  router.post('/admin/user/sign_in', user_controller.sign_in)
  router.get('/admin_auth/user/info', user_controller.info)
  router.get('/admin_auth/user/list', user_controller.list)
  router.post('/admin_auth/user/add', user_controller.add)
  router.get('/admin_auth/user/del', user_controller.del)
  /**
   * ******************* test api*******************************
   */
  router.get('/client_api/test', async (ctx, next) => {
    // ctx.send({ url: '/client_api/test' }, 'get success')
    ctx.sendError('get error')
  })

  router.post('/login/test', async (ctx, next) => {
    let { name, pwd } = ctx.request.body
    let payload = {
      name: name,
      role: 'test'
    }
    let token = jwt.sign(payload, conf.auth.admin_secret, { expiresIn: '1h' }) //token签名 有效期为24小时
    ctx.cookies.set(conf.auth.tokenKey, token, {
      httpOnly: false // 是否只用于http请求中获取
    })
    ctx.send({ message: '登录成功', token: token })
  })
  router.get('/auth/test', async (ctx, next) => {
    ctx.send({ message: 'test success' })
  })
  app.use(router.routes()).use(router.allowedMethods())
}
