export default () => {
  let render = ctx => {
    return (data, msg) => {
      ctx.set('Content-Type', 'application/json')
      ctx.body = JSON.stringify({
        code: 0,
        data: data || {},
        msg: msg || 'success'
      })
    }
  }
  let renderError = ctx => {
    return msg => {
      ctx.set('Content-Type', 'application/json')
      ctx.body = JSON.stringify({
        code: 1,
        data: {},
        msg: msg.toString() || 'error'
      })
    }
  }
  return async (ctx, next) => {
    ctx.send = render(ctx)
    ctx.sendError = renderError(ctx)
    await next()
  }
}
