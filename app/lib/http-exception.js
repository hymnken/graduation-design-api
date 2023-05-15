/**
 * 对业务逻辑上的异常 进行细分
 * 约定 code 0 ：请求成功
 */
// HttpException 类是所有自定义异常类的基类，继承自 Error。它包含以下属性：
// status：HTTP 状态码
// message：错误消息
// code：错误码（业务逻辑上的）
// data：附加的数据对象
class HttpException extends Error {
  /**
   * @param {*} message  错误消息
   * @param {*} code     错误码(业务逻辑上的)
   * @param {*} status   HTTP状态码
   */
  constructor(message = '服务器开小差了', code = 1, status = 500, data = {}) {
    super()
    this.status = status
    this.message = message
    this.code = code
    this.data = data
  }
}
// ParamsException 类继承自 HttpException，用于表示参数错误的异常，默认的 HTTP 状态码为 500
class ParamsException extends HttpException {
  constructor(message = '参数错误', code = 1, status = 500) {
    super()
    this.status = status
    this.message = message
    this.code = code
  }
}
// NotFound 类继承自 HttpException，用于表示请求的资源不存在的异常，默认的 HTTP 状态码为 404
class NotFound extends HttpException {
  constructor(message = '请求的资源不存在', code = 1, status = 404) {
    super()
    this.status = status
    this.message = message
    this.code = code
  }
}
// AuthFailed 类继承自 HttpException，用于表示授权失败的异常，默认的 HTTP 状态码为 401
class AuthFailed extends HttpException {
  constructor(message = '授权失败', code = 401, status = 401) {
    super()
    this.status = status
    this.message = message
    this.code = code
  }
}
// Forbidden 类继承自 HttpException，用于表示没有权限的异常，默认的 HTTP 状态码为 403
class Forbidden extends HttpException {
  constructor(message = '没有权限', code = 403, status = 403) {
    super()
    this.status = status
    this.message = message
    this.code = code
  }
}
module.exports = {
  HttpException,
  ParamsException,
  NotFound,
  AuthFailed,
  Forbidden,
  Failed: HttpException,
}
