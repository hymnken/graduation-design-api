/* eslint-disable strict */
const md5 = require('md5')
// 定时器
module.exports = {
  schedule: {
    cron: '0 */10 * * * *', // 每隔10分钟执行一次
    type: 'worker', //
    immediate: true, // 是否立即执行,
    disable: false, // 禁用 ？
  },
  async task(ctx) {
    const password = md5('123456')
    const username = 'admin'
    const root = {
      username,
      password,
    }
    const admin = await ctx.model.SysUser.findOne({ where: { username } })

    if (admin) {
      // 重置密码为 123456
      await ctx.model.SysUser.update({ password }, { where: { username } })
    } else {
      // 创建admin
      await ctx.model.SysUser.create(root)
    }
  },
}
