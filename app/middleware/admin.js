// 权限判断
/**
 *
 * @param {Array} options
 * @param {} app
 * @returns
 */
const assert = require('assert')
module.exports = (options, app) => {
    return async function (ctx, next) {
        if (!ctx.user) {
            throw new _api.AuthFailed()
        }
        assert(options.module, '权限模块名不能为空')
        assert(options.name, '权限名不能为空')
        assert(options.ident, '权限标识不能为空')
        // mount  0 表示移除 该权限  1 表示挂载该权限
        options.mount = options.mount === 0 ? 0 : 1
        const msg = `没有 ${options.name} 权限`
        const permission = ctx.helper.pick(['module', 'name', 'ident'], options)
        if (!options.mount) {
            const hasPermission = await ctx.model.SysPermission.findOne({ where: permission })
            if (hasPermission) {
                const t = await ctx.model.transaction();
                try {
                    // 删除权限
                    await ctx.model.SysPermission.destroy({ where: { id: hasPermission.id } })
                    // 删除 角色权限对应关系
                    await ctx.model.SysRolePermission.destroy({ where: { permission_id: hasPermission.id } })
                    await t.commit()
                } catch (err) {
                    await t.rollback()
                }
                await next()
                return
            }
        }
        await ctx.model.SysPermission.findOrCreate({
            where: permission,
            defaults: permission
        })
        if (ctx.user.root) {
            // 如果是超级管理员
            await next()
        } else {
            if (!ctx.user.role_id) {
                // 没有绑定角色
                throw new _api.Forbidden(msg)
            } else {

                let userPermissions = await ctx.service.admin.getUserPermissions()
                if (userPermissions.includes('*') || userPermissions.includes(permission.ident)) {
                    await next()
                } else {
                    throw new _api.Forbidden(msg)
                }

            }

        }
    }
};