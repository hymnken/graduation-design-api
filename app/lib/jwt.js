// passport-local 是一个 Passport.js 的策略（Strategy）库，用于实现基于用户名和密码的本地认证。它提供了一种简单而灵活的方式来验证用户的身份，
// 并与 Passport.js 无缝集成，用于处理用户认证和会话管理。通过 passport-local，开发人员可以轻松地实现基于用户名和密码的登录功能。
const LocalStrategy = require('passport-local').Strategy
const md5 = require('md5')
// 登录认证
// 登录成功后 会挂载到 ctx.user 上
// 对于小程序这种不能携带cookie的客户端不能使用该方式进行登录
exports.localAuth = async (app) => {
  // 挂载 strategy
  app.passport.use(
    new LocalStrategy(
      {
        //将请求信息传递到callback界面
        passReqToCallback: true,
        //中间件会自动从username和passport字段读取用户名和密码，如果需要更改：
        usernameField: 'username',
        passwordField: 'password',
      },
      (req, username, password, done) => {
        req.ctx.session.passport = {}
        req.ctx.session.user = {}
        // format user
        let user = {
          provider: 'local',
          username,
          password,
        }
        app.passport.doVerify(req, user, done)
      }
    )
  )

  // 处理用户信息  以下代码是使用 Egg.js 的 Passport 插件进行身份验证的配置。
  // `app.passport.verify` 是 Passport 插件的方法，用于定义身份验证的验证函数。该函数接收两个参数：`ctx` 和 `user`，分别表示当前请求的上下文和用户对象。
  app.passport.verify(async (ctx, user) => {
    // 在验证函数中，首先检查 `user` 对象是否包含有效的 `username` 和 `password` 字段，如果不存在则直接返回 `false` 表示验证失败。
    if (!user.username || !user.password) return false
    // 接下来，通过调用 `ctx.model.SysUser.findOne` 方法查询数据库，查找符合条件的用户信息。条件包括用户名、经过 MD5 加密后的密码以及启用状态为 `true`。
    let userInfo = await ctx.model.SysUser.findOne({
      where: {
        username: user.username,
        password: md5(user.password),
        enable: true,
      },
    })

    if (!userInfo) {
      return false
    }
    // 如果找到匹配的用户信息，则将其转换为普通对象（通过 `userInfo.dataValues` 获取实际数据），并为该用户生成一个 token，使用 `ctx.helper.createToken(userInfo.id)` 方法创建 token。
    userInfo = userInfo.dataValues
    userInfo.token = ctx.helper.createToken(userInfo.id)
    // 最后，返回包含用户信息及生成的 token 的对象作为验证成功的结果。
    // 如果验证失败或未找到匹配的用户信息，则返回 `false` 表示验证失败。
    return userInfo
  })
  // 以下代码是使用 Egg.js 的 Passport 插件对用户对象进行序列化和反序列化的配置。
  // app.passport.serializeUser 是 Passport 插件的方法，用于定义序列化用户对象的函数。该函数接收两个参数：ctx 和 user，分别表示当前请求的上下文和用户对象。
  // 在序列化函数中，首先检查 user 对象是否存在以及是否包含有效的 id 字段。如果 user 为空或 id 字段不存在，直接返回 user。
  // 如果 user 对象存在且包含有效的 id 字段，将通过对象解构赋值的方式移除 password 字段，并将剩余的属性构造成一个新的对象 ret。
  // 最后，返回新的对象 ret 作为序列化后的用户信息。
  // app.passport.deserializeUser 是 Passport 插件的方法，用于定义反序列化用户对象的函数。该函数接收两个参数：ctx 和 user，分别表示当前请求的上下文和用户对象。
  // 在反序列化函数中，直接返回传入的 user 对象，即不进行任何处理。
  // 这段代码的作用是在用户登录成功后，对用户对象进行序列化和反序列化操作。序列化函数用于移除敏感信息，只保留需要持久化的用户信息，而反序列化函数用于将持久化的用户信息恢复为用户对象。
  app.passport.serializeUser(async (ctx, user) => {
    //序列化user信息
    if (!user || !user.id) return user
    // 移除password字段
    let { password, ...ret } = user
    return ret
  })
  app.passport.deserializeUser(async (ctx, user) => {
    return user
    //反序列化user信息
  })
}
