// eslint-disable-next-line strict
const { HttpException } = require('../lib/http-exception')
module.exports = {
  // success(data = {}, code = 0, message = 'ok')：用于表示操作成功的响应。抛出一个 HttpException 异常，传入指定的消息 message、错误码 code（默认为 0）、HTTP 状态码 200 和数据 data
  success(data = {}, code = 0, message = 'ok') {
    throw new HttpException(message, code, 200, data)
  },
  // failed(message = '服务器开小差了', code = 1, status = 500)：用于表示操作失败的响应。抛出一个 HttpException 异常，传入指定的消息 message、错误码 code（默认为 1）和 HTTP 状态码 status（默认为 500）
  failed(message = '服务器开小差了', code = 1, status = 500) {
    throw new HttpException(message, code, status)
  },
  // miss(message = '参数错误', code = 1, status = 500)：用于表示缺少参数的响应。抛出一个 HttpException 异常，传入指定的消息 message、错误码 code（默认为 1）和 HTTP 状态码 status（默认为 500）
  miss(message = '参数错误', code = 1, status = 500) {
    throw new HttpException(message, code, status)
  },
  // send(flag, params = {})：根据传入的标志 flag 和参数 params 发送响应结果。如果 flag 为真，调用 success 函数，否则调用 failed 函数
  send(flag, params = {}) {
    if (flag) {
      this.success(params.data || {})
    } else {
      this.failed(params.message || '操作失败')
    }
  },
  // port 访问器属性：获取应用配置中 cluster.listen.port 的值。
  get port() {
    return this.app.config.cluster.listen.port
  },
  // bodyParams 访问器属性：获取请求的 req.body 对象的值，默认为空对象。
  get bodyParams() {
    const { body } = this.req
    return body || {}
  },
}
