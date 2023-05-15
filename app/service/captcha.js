const Service = require('egg').Service
// 验证码插件
const svgCaptcha = require('svg-captcha')
class CaptchaService extends Service {
  // 获取当前用户的所有权限
  async createCaptcha() {
    const { app, ctx } = this
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      background: '#cc9966',
    })
    return captcha
  }
}

module.exports = CaptchaService
