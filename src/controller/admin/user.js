import jwt from 'jsonwebtoken'
import conf from '../../config'
import { add } from '../../middleware/func/db'
import userModel from '../../models/user'
import { Promise } from 'mongoose'
import { resolve } from 'url'

const user_controller = {
  sign_in: async (ctx, next) => {
    console.log('---------- 用户登录 ----------------')
    let { name, pwd } = ctx.request.body
    let token = ctx.cookies.get(conf.auth.tokenKey)
    try {
      let data = jwt.verify(token, conf.auth.admin_secret)
      console.log('重定向')
      console.log(ctx.request)
      ctx.redirect('/admin_auth/user/info')
    } catch (e) {
      try {
        let reg = new RegExp(name, 'i')
        let data = await ctx.findOne(userModel, { name: name })
        if (!data) {
          return ctx.sendError('用户不存在！')
        }
        if (data.pwd !== pwd) {
          return ctx.sendError('密码错误，请重新输入！')
        }
        let loginTime = new Date()
        await ctx.update(
          userModel,
          {
            _id: data._id
          },
          {
            $set: {
              loginTime: loginTime
            }
          }
        )
        let payload = {
          name: data.name,
          roles: data.roles
        }
        let token = jwt.sign(payload, conf.auth.admin_secret, {
          expiresIn: '1h'
        })
        ctx.cookies.set(conf.auth.tokenKey, token, {
          httpOnly: false // 是否只用于http请求中获取
        })
        ctx.send({ info: payload, token: token })
      } catch (e) {
        ctx.sendError(e)
      }
    }
  },
  info: async (ctx, next) => {
    console.log('---------- 查询用户信息 ----------------')
    ctx.send({ controller: 'user controller' })
    let token = ctx.cookies.get(conf.auth.tokenKey)
    try {
      let tokenInfo = jwt.verify(token, conf.auth.admin_secret)
      let reg = new RegExp(tokenInfo.name, 'i')
      let data = await ctx.findOne(
        userModel,
        { name: { $regex: reg } },
        { pwd: 0, __v: 0 }
      )
      ctx.send(data)
    } catch (e) {
      if ('TokenExpiredError' === e.name) {
        ctx.sendError('token已过期, 请重新登录!')
        //   ctx.throw(401, 'token expired,请及时本地保存数据！')
      }
      ctx.sendError('token验证失败, 请重新登录!')
    }
  },
  list: async (ctx, next) => {
    console.log('---------- 查询用户列表 ----------------')
    let { keyword, page = 1, pageSize = 10 } = ctx.request.body
    try {
      let reg = new RegExp(keyword, 'i')
      let data = await ctx.findPage(
        userModel,
        {
          $or: [{ name: { $regex: reg } }, { username: { $regex: reg } }]
        },
        { pwd: 0 },
        {
          limit: pageSize * 1,
          skip: (page - 1) * pageSize
        }
      )
      ctx.send(data)
    } catch (e) {
      ctx.sendError(e)
    }
  },
  add: async (ctx, next) => {
    // ctx.send({ controller: 'user controller' })
    console.log('---------- 添加管理员 ----------------')
    let paramsData = ctx.request.body
    try {
      let data = await ctx.findOne(userModel, { name: paramsData.name })
      if (data) {
        ctx.sendError('用户已存在, 请重新添加!')
      } else {
        let data = await ctx.add(userModel, paramsData)
        ctx.send(paramsData)
      }
    } catch (e) {
      ctx.sendError(e)
    }
  },
  update: async (ctx, next) => {
    ctx.send({ controller: 'user controller' })
  },
  del: async (ctx, next) => {
    console.log('---------- 删除用户 ----------------')
    let id = ctx.request.query.id
    try {
      ctx.remove(userModel, { _id: id })
      ctx.send({}, '删除成功')
    } catch (e) {
      ctx.sendError(e)
    }
  }
}
export default user_controller
