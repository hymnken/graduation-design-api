// 权限判断
/**
 *
 * @param {Array} options  ['admin','user'] 判断当前用户是普通用户，管理员
 * @param {} app
 * @returns
 */
const H5_USER_KEY = 'h5-user-info'
module.exports = (options, app) => {
    return async function (ctx, next) {
        if (options.ident === 'admin') {
            if (!ctx.user) {
                throw new _api.AuthFailed()
            } else {
                await next()
            }
        } else {
            if (options.ident === 'h5-user') {
                const userInfo = ctx.session[H5_USER_KEY]
                if (!userInfo || !userInfo.id) {
                    throw new _api.AuthFailed()
                } else {
                    let header = ctx.request.header
                    let authIdent = await ctx.app.jwt.verify(header['h5-token'], app.config.jwt.secret)
                    if (authIdent !== userInfo.mobile) {
                        //h5 以手机号 创建的token ，不一致则 验证失败
                        throw new _api.AuthFailed()
                    } else {
                        ctx.h5_user = userInfo
                        await next()
                    }
                }
            } else {
                await next()
            }
        }
    }
};