const os = require('os')
module.exports = {
  // send(flag, params = {}) 函数用于根据传入的标志 flag 和参数 params 发送响应结果：
  send(flag, params = {}) {
    if (flag) {
      // 如果 flag 为真（truthy），调用 this.ctx.success(params.data || {})，表示操作成功，并将 params.data 作为响应数据传递给 this.ctx.success。
      this.ctx.success(params.data || {})
    } else {
      // 如果 flag 为假（falsy），调用 this.ctx.failed(params.message || '操作失败')，表示操作失败，并将 params.message 或默认的错误信息作为响应消息传递给 this.ctx.failed。
      this.ctx.failed(params.message || '操作失败')
    }
    // 函数没有返回值，但通过上述调用可以将操作结果发送给客户端。
    // this.ctx.body = {status,message,data}
  },
  // createToken(value) 函数用于创建一个 JWT（JSON Web Token）：
  createToken(value) {
    // 调用 this.app.jwt.sign(value, this.app.config.jwt.secret)，使用 JWT 库的 sign 方法来生成一个 JWT，将 value 作为有效载荷（payload），并使用应用配置中的 jwt.secret 作为密钥进行签名。
    // 函数返回生成的 JWT。
    return this.app.jwt.sign(value, this.app.config.jwt.secret)
  },
  // pick(keys, obj, toNull = false) 函数用于从给定的对象 obj 中选取指定的属性 keys：
  pick(keys, obj, toNull = false) {
    // 创建一个空对象 data。
    let data = {}
    // 使用 Object.keys(obj) 获取 obj 的所有属性名。
    Object.keys(obj).forEach((k) => {
      // 对于每个属性名 k，如果 keys 数组中包含该属性名，将属性值赋给 data[k]，如果属性值为空字符串，则根据 toNull 参数决定是否将其设为 null。
      if (keys.indexOf(k) >= 0) {
        data[k] = obj[k] === '' ? null : obj[k]
      }
    })
    // 函数返回选取后的属性构成的对象 data
    return data
  },
}
