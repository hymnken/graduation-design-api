const Controller = require('egg').Controller
const md5 = require('md5')

class UserController extends Controller {
  //
  async userList() {
    const { ctx, app } = this
    const { page = 1, keyword } = ctx.query
    const offset = (page - 1) * 10
    const where = {}
    if (keyword) {
      const { Op } = this.app.Sequelize
      where['realname'] = {
        [Op.like]: '%' + keyword + '%',
      }
    }
    const res = await ctx.model.User.findAndCountAll({
      where,
      limit: 10,
      offset,
      attributes: {
        exclude: ['password'],
      },
      order: [['id', 'DESC']],
    })
    ctx.send(res, { data: res })
  }

  async userModify() {
    const { ctx, app } = this
    const { id, ...params } = ctx.bodyParams
    let data = ctx.helper.pick(
      ['avatar', 'mobile', 'username', 'password', 'secret', 'secret_answer', 'realname', 'ident'],
      params,
      true
    )
    if (!data.username || !data.realname) {
      ctx.miss(`请填写用户名和真实姓名`)
      return
    }
    if (data.mobile && !_check.isMobile(data.mobile)) {
      ctx.failed(`请输入正确的手机号`)
      return
    }
    if (data.realname && !_check.isNickname(data.realname)) {
      ctx.failed(`请输入正确的真实姓名`)
      return
    }
    const hasOne = await ctx.model.User.findOne({ where: { mobile: data.mobile } })
    if (hasOne && hasOne.id != id) {
      ctx.failed(`该手机号已存在`)
      return
    }
    if (!id) {
      if (!_check.isPassword(data.password)) {
        ctx.miss(`密码不符合规范`)
      } else {
        data.password = md5(data.password)
        let res = await ctx.model.User.create(data)
        ctx.send(res, { data: res })
      }
    } else {
      let userInfo = await ctx.model.User.findOne({ where: { id } })
      if (!userInfo) {
        ctx.failed(`用户不存在`)
      } else {
        if (data.password) {
          if (!_check.isPassword(data.password)) {
            ctx.failed(`密码不符合规范`)
          } else {
            data.password = md5(data.password)
          }
        } else {
          delete data.password
        }
        let res = await ctx.model.User.update(data, { where: { id } })
        ctx.send(res)
      }
    }
  }

  async userDelete() {
    const { ctx, app } = this
    const { id } = ctx.query
    if (!id) {
      ctx.miss()
    }

    let res = await app.model.User.destroy({ where: { id } })
    ctx.send(res, { data: res })
  }
}

module.exports = UserController
