'use strict';

const Service = require('egg').Service;
class AdminService extends Service {

    // 获取当前用户的所有权限
    async getUserPermissions() {
        const { app, ctx } = this
        if (ctx.user.root) return ['*']
        if (!ctx.user.role_id) return []
        const rolePermissions = await app.model.SysRolePermission.findAll({
            where: { role_id: ctx.user.role_id }
        })
        const { Op } = app.Sequelize
        const permissionIds = rolePermissions.map(v => v.permission_id)
        const permissions = await app.model.SysPermission.findAll({
            where: {
                id: {
                    [Op.in]: permissionIds
                }
            }
        })
        return permissions.map(v => {
            return v.ident
        })
    }

    // 是否为root用户
    async isRootUser(id) {
        return new Promise(async (resolve) => {
            const user = await this.ctx.model.SysUser.findOne({ where: { id } })
            if (user && user.root) {
                resolve(true)
            } else {
                resolve(false)
            }
        })
    }
}
module.exports = AdminService;