const Controller = require('egg').Controller
const md5 = require('md5')
class AdminController extends Controller {
  // 管理员登录
  async login() {
    if (this.ctx.isAuthenticated()) {
      let permissions = await this.ctx.service.admin.getUserPermissions()
      this.ctx.success({ ...this.ctx.user, permissions })
    } else {
      this.ctx.failed(`登录失败`)
    }
  }

  // 管理员列表
  async userList() {
    const { ctx, app } = this
    const { page = 1 } = ctx.query
    const offset = (page - 1) * 10
    const res = await ctx.model.SysUser.findAndCountAll({
      limit: 10,
      offset,
      include: [
        {
          model: ctx.model.SysRole,
          as: 'role',
          attributes: ['name'],
        },
      ],
      attributes: {
        exclude: ['password'],
      },
      order: [['id', 'DESC']],
    })
    ctx.send(res, { data: res })
  }

  // 获取角色列表
  async roleList() {
    const { ctx, app } = this
    const { page } = ctx.query
    const params = {}
    if (page) {
      params.offset = (page - 1) * 10
      params.limit = 10
    }
    const res = await ctx.model.SysRole.findAndCountAll(params)
    ctx.send(res, { data: res })
  }

  // 图片上传
  async imageUpload() {
    const res = await this.ctx.service.file.imageUpload()
    this.ctx.success(res)
  }

  //用户详情
  async userDetail() {
    const { ctx, app } = this
    const { id } = ctx.query
    if (!id) {
      ctx.miss()
    }
    const res = await ctx.model.SysUser.findOne({
      where: { id },
      include: [
        {
          model: ctx.model.SysRole,
          as: 'role',
          attributes: ['name'],
        },
      ],
      attributes: {
        exclude: ['password'],
      },
    })
    ctx.send(res, { data: res, message: '用户不存在' })
  }

  // 编辑/新增 用户
  async userModify() {
    const { ctx, app } = this
    const { id, ...params } = ctx.bodyParams

    if (id) {
      const isRoot = await ctx.service.admin.isRootUser(id)
      if (isRoot) {
        ctx.failed(`该用户不可编辑`)
      }
    }
    let data = ctx.helper.pick(['role_id', 'avatar', 'mobile', 'username', 'nickname', 'password', 'enable'], params, true)
    if (!data.username || !data.nickname) {
      ctx.miss(`请填写用户名和昵称`)
      return
    }
    if (data.mobile && !_check.isMobile(data.mobile)) {
      ctx.failed(`请输入正确的手机号`)
      return
    }
    if (data.nickname && !_check.isNickname(data.nickname)) {
      ctx.failed(`请输入正确的昵称`)
      return
    }
    if (data.username && !_check.isUsername(data.username)) {
      ctx.failed(`请输入正确的用户名`)
      return
    }
    const hasOne = await ctx.model.SysUser.findOne({ where: { username: data.username } })
    if (hasOne && hasOne.id != id) {
      ctx.failed(`用户名已存在`)
      return
    }
    if (!id) {
      if (!_check.isPassword(data.password)) {
        ctx.miss(`密码不符合规范`)
      } else {
        data.password = md5(data.password)
        let res = await ctx.model.SysUser.create(data)
        ctx.send(res, { data: res })
      }
    } else {
      let userInfo = await ctx.model.SysUser.findOne({ where: { id } })
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
        let res = await ctx.model.SysUser.update(data, { where: { id } })
        ctx.send(res)
      }
    }
  }

  // 删除用户
  async userDelete() {
    const { ctx, app } = this
    const { id } = ctx.query
    if (!id) {
      ctx.miss()
    }
    if (ctx.user.id == id) {
      ctx.failed(`不可删除自己`)
      return
    }
    const isRoot = await ctx.service.admin.isRootUser(id)
    if (isRoot) {
      ctx.failed(`该用户不可编辑`)
    }
    let res = await app.model.SysUser.destroy({ where: { id } })
    ctx.send(res, { data: res })
  }

  // 新增角色
  async roleCreate() {
    const { ctx, app } = this
    const { name, intro } = ctx.bodyParams
    if (!name) {
      ctx.miss()
    }
    const res = await app.model.SysRole.create({ name, intro })
    ctx.send(res)
  }
  // 删除角色
  async roleDelete() {
    const { ctx, app } = this
    const { id } = ctx.query
    if (!id) {
      ctx.miss()
    }
    const t = await ctx.model.transaction()
    let state = true
    try {
      // 删除角色
      await app.model.SysRole.destroy({ where: { id } })
      // 更新用户
      await app.model.SysUser.update({ role_id: null }, { where: { role_id: id } })
      await t.commit()
    } catch (err) {
      await t.rollback()
      state = false
    }
    if (state) {
      ctx.success()
    } else {
      ctx.failed()
    }
  }

  // 权限列表
  async permissionList() {
    const list = await this.app.model.SysPermission.findAll()
    this.ctx.send(list, { data: list })
  }
  //角色详情
  async roleDetail() {
    const { ctx, app } = this
    const { id } = ctx.query
    if (!id) {
      ctx.miss()
    }
    const role = await app.model.SysRole.findOne({ where: { id } })
    if (!role) {
      ctx.failed(`该角色不存在`)
    }
    const permissions = await app.model.SysRolePermission.findAll({
      where: { role_id: id },
    })
    let ids = []
    if (permissions) {
      ids = permissions.map((v) => v.permission_id)
    }
    const { Op } = app.Sequelize
    const permissionList = await app.model.SysPermission.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      attributes: ['id'],
    })

    ctx.success({
      ...role.dataValues,
      permissions: permissionList.map((v) => v.id),
    })
  }

  // 编辑角色
  async roleModify() {
    const { ctx, app } = this
    const { id, name, intro = '', permissions } = ctx.bodyParams
    if (!id || !name || !Array.isArray(permissions)) {
      ctx.miss()
    }
    let state = true
    let t = await ctx.model.transaction()
    try {
      // 更新角色基本信息
      await app.model.SysRole.update({ name, intro }, { where: { id } })
      // 删除角色-权限对照表
      await app.model.SysRolePermission.destroy({ where: { role_id: id } })
      // 重新插入角色-权限 表
      const items = permissions.map((v) => {
        return {
          role_id: id,
          permission_id: v,
        }
      })
      await app.model.SysRolePermission.bulkCreate(items)
      await t.commit()
    } catch (err) {
      state = false
      await t.rollback()
    }
    if (state) {
      ctx.success()
    } else {
      ctx.failed(`保存失败`)
    }
  }

  // 个人信息
  async userProfile() {
    const { ctx, app } = this
    const user = ctx.user
    const info = await ctx.model.SysUser.findOne({ where: { id: user.id } })
    if (info) {
      let { password, ...data } = info.dataValues
      ctx.success(data)
    } else {
      ctx.failed(`用户不存在`)
    }
  }
  // 个人信息编辑
  async userProfileModify() {
    const { ctx, app } = this
    const params = ctx.bodyParams
    const user = ctx.user
    let data = ctx.helper.pick(['nickname', 'username', 'avatar', 'mobile', 'password'], params)
    if (!data.nickname || !_check.isNickname(data.nickname)) {
      ctx.failed(`请输入正确的昵称`)
    }
    if (!data.username || !_check.isUsername(data.username)) {
      ctx.failed(`请输入正确的用户名`)
    }
    if (data.mobile && !_check.isMobile(data.mobile)) {
      ctx.failed(`请输入正确的手机号`)
    }
    if (data.password) {
      if (!_check.isPassword(data.password)) {
        ctx.failed(`请输入正确密码`)
      } else {
        data.password = md5(data.password)
      }
    } else {
      delete data.password
    }
    let res = await ctx.model.SysUser.update(data, { where: { id: user.id } })
    ctx.send(res)
  }

  //退出登录
  async logout() {
    this.ctx.logout()
    this.ctx.success()
  }

  // 读取日志
  async sysLogList() {
    const { ctx, app } = this
    const { page } = ctx.query
    const params = {}
    if (page) {
      params.offset = (page - 1) * 10
      params.limit = 10
    }
    const res = await ctx.model.SysLog.findAndCountAll({
      ...params,
      order: [['id', 'DESC']],
    })
    ctx.send(res, { data: res })
  }
}

module.exports = AdminController
