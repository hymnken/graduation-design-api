const _ = require('lodash')
// 权限判断
/**
 *
 * @param {Array} options  ['admin','user'] 判断当前用户是普通用户，管理员
 * @param {} app
 * @returns
 */
module.exports = (options, app) => {
    return async function (ctx, next) {
        if (!ctx.user) {
            let header = ctx.request.header
            if (header['x-token'] && header['authorization-id']) {
                let loginId = await ctx.app.jwt.verify(header['x-token'], app.config.jwt.secret)
                if (loginId == header['authorization-id']) {
                    let userInfo = await app.model.User.findOne({ where: { id: header['authorization-id'] } })
                    userInfo = userInfo.dataValues
                    userInfo.token = ctx.helper.createToken(userInfo.id)
                    userInfo.ident = 'user'
                    let { password, ...info } = userInfo
                    ctx.user = info
                    ctx.session.user = info

                }
            }
        }
        await next()
    }
};