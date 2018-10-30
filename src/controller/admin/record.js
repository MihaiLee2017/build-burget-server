import jwt from 'jsonwebtoken'
import conf from '../../config'
import recordModel from '../../models/record'
import { stat } from 'fs'
const record_controller = {
  add: async (ctx, next) => {
    console.log('---------- 添加记录列表 ----------------')
    let params = ctx.request.body
    try {
      let data = await ctx.add(recordModel, params)
      ctx.send(data, '添加成功')
    } catch (e) {
      ctx.sendError(e)
    }
  },
  list: async (ctx, next) => {
    console.log('---------- 查询记录列表 ----------------')
    let { state = '', type = '', page = 1, pageSize = 10 } = ctx.request.query
    let coditions = {}
    if (state.length > 0) {
      coditions.state = new RegExp(state, 'i')
    }
    type = type.toString()
    if (type.length > 0) {
      coditions.type = new RegExp(type, 'i')
    }
    try {
      //   let reg = new RegExp(keyword, 'i')
      let data = await ctx.findPage(
        recordModel,
        coditions,
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
  update: async (ctx, next) => {
    console.log('---------- 修改记录列表 ----------------')
    try {
      let params = ctx.request.body
      params.payerTime = new Date(ctx.request.body.payerTime)
      console.log(params)
      let id = params._id || params.id
      let data = await ctx.update(recordModel, { _id: id }, params)
      ctx.send({}, '修改成功')
    } catch (e) {
      ctx.sendError(e)
    }
  },
  del: async (ctx, next) => {
    console.log('---------- 添加记录列表 ----------------')
    let id = ctx.request.query.id
    try {
      ctx.remove(recordModel, { _id: id })
      ctx.send({}, '删除成功')
    } catch (e) {
      ctx.sendError(e)
    }
  }
}

export default record_controller
