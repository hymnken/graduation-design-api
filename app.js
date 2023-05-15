/* eslint-disable strict */

const { error } = require('./app/middleware/error')
const { errorHandler } = require('./app/lib/http-error')
const httpErrors = require("./app/lib/http-exception")
const { localAuth } = require("./app/lib/jwt")
const check = require('./app/utils/validate')
const database = require('./app/lib/database')
global._api = httpErrors
global._check = check

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  configWillLoad() {

  }

  async didLoad() {
    // 错误中间件的使用
    this.app.use(error);
    this.app.on('error', errorHandler)
    // 挂载登录鉴权
    localAuth(this.app)

  }

  async willReady() {
    this.app.model.sync({ alter: true })
    database.install(this.app)
  }

  async didReady() {

  }

  async serverDidReady() {

  }
}

module.exports = AppBootHook;