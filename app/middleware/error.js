// module.exports = require('koa-json-error');
const H5_USER_KEY = 'h5-user-info'
// 以上代码是一个错误处理中间件函数，使用了Egg.js框架的上下文ctx对象和服务类ctx.service来处理请求中出现的错误。
// 首先，它使用try...catch块来捕获并处理下一个中间件函数或路由处理器中抛出的错误。如果请求的状态码为404
// 则抛出一个自定义的NotFound错误。如果捕获到其他类型的错误，它会根据请求的路径和用户信息，记录错误日志到数据库中
// 然后根据错误的类型和代码进行不同的响应处理。如果错误是自定义的HttpException类错误，根据错误的代码和状态码返回相应的响应体。
// 如果错误不是HttpException类错误，则触发应用程序的错误监听事件，并传递错误对象和上下文对象，以便记录详细的错误堆栈日志。
exports.error = async (ctx, next) => {
  try {
    await next()
    if (ctx.status === 404) {
      // throw new errs.NotFound()
      throw new _api.NotFound()
    }
  } catch (err) {
    let handler = ''
    let handler_id = ''
    let module_name = 'REQUEST'
    if (ctx.path.startsWith('/admin') && ctx.user) {
      module_name = 'ADMIN'
      handler = ctx.user.username
      handler_id = ctx.user.id
    } else {
      let user = ctx.session[H5_USER_KEY]
      if (ctx.path.startsWith('/h5')) {
        module_name = 'USER'
      }
      if (user) {
        handler = user.mobile
        handler_id = user.id
      }
    }
    ctx.service.sys.createLog({
      module_name,
      request_method: ctx.method,
      request_api: ctx.path,
      message: err.message,
      request_host: ctx.request.header.origin,
      status_code: err.status || 500,
      err_detail: err.stack,
      handler,
      handler_id,
    })
    if (typeof err.code === 'number') {
      // 如果是自己主动抛出的 HttpException类 错误
      ctx.status = err.status || 500
      if (err.code === 0) {
        // 0 为正常业务请求
        ctx.body = {
          code: err.code,
          message: err.message,
          data: err.data || {},
        }
      } else {
        ctx.body = {
          code: err.code,
          message: err.message,
          request: `${ctx.method} ${ctx.path}`,
        }
      }
    } else {
      // 触发  app.on('error') 错误监听事件，可以打印出详细的错误堆栈 log
      ctx.app.emit('error', err, ctx)
    }
  }
}
