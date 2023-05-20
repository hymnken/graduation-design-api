/* eslint valid-jsdoc: "off" */

const path = require('path')
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {})

  //以下代码是关于 Egg.js 应用程序配置的部分。
  // config.keys 用于设置应用程序的 Cookie 安全密钥。在这里，它使用了 appInfo.name（应用程序的名称）和一个时间戳进行拼接生成密钥。
  // config.cluster 用于配置集群模式下的应用程序监听选项。
  // listen 对象包含了监听的相关设置：
  // path: '' 指定了监听的路径，这里为空字符串，表示不使用特定的路径。
  // port: 8001 指定了监听的端口号为 8001。
  // hostname: '0.0.0.0' 指定了监听的主机名为 0.0.0.0，表示监听所有可用的网络接口。
  // 这段代码是用于配置 Egg.js 应用程序的一些基本选项，包括 Cookie 安全密钥和应用程序的监听设置。
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1645150955335_461'
  config.cluster = {
    listen: {
      path: '',
      port: 8001,
      hostname: '0.0.0.0',
    },
  }

  // 以下代码是关于 Egg.js 应用程序的安全配置、JWT 配置、跨域配置和会话配置。具体解释如下：
  // 这段代码是用于配置 Egg.js 应用程序的安全性、JWT、跨域和会话相关的选项。其中包括禁用 CSRF 防护、设置 JWT 密钥、配置跨域请求允许和会话设置等。
  // config.security 用于设置应用程序的安全相关配置选项：
  config.security = {
    csrf: {
      enable: false, // csrf.enable: false 表示禁用 CSRF（跨站请求伪造）防护功能。
    },
    domainWhiteList: [], // domainWhiteList: [] 是一个空数组，表示允许跨域请求的白名单域名列表，此处为空，表示不限制跨域请求的来源域名。
  }
  // config.jwt 用于配置 JWT（JSON Web Token）的相关选项：
  config.jwt = {
    secret: 'egg', // 自定义token的加密条件字符串，可按各自的需求填写 secret: 'egg' 指定了自定义的 JWT 加密条件字符串，用于生成和验证 JWT。
  }
  // config.cors 用于配置跨域资源共享（CORS）的选项：
  config.cors = {
    // origin: 'http://127.0.0.1:1996',
    origin: (ctx) => ctx.get('origin'), // origin: (ctx) => ctx.get('origin') 指定了允许跨域请求的来源，这里根据请求的头部获取实际的来源。
    credentials: true, // 支持cookie跨域 credentials: true 表示支持跨域请求时携带和接收 Cookies。
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS', // allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS' 指定了允许的跨域请求方法。
  }
  // config.session 用于配置会话（Session）的选项：
  config.session = {
    key: 'homestay_ss', // 设置session cookie里面的key  key: 'homestay_ss' 指定了会话 cookie 的键名。
    maxAge: 1000 * 60 * 30, //  指定了会话的过期时间，这里设置为 30 分钟。
    httpOnly: true, // httpOnly: true 表示只允许通过 HTTP 请求访问会话 cookie。
    encrypt: true, // encrypt: true 表示对会话 cookie 进行加密。
    renew: true, // renew: true 表示在会话过期之后自动续签会话。
    sameSite: 'none', // sameSite: 'none' 设置了 SameSite 属性为 "none"，允许跨站点的会话访问。
  }
  config.mysql = {
    client: {
      // host
      host: 'localhost',
      // 端口号
      port: '3306',
      // 用户名
      user: 'admin',
      // 密码
      password: '123456',
      // 数据库名
      database: 'homestay',
    },
  }
  config.sequelize = {
    dialect: 'mysql', // 指定了使用 MySQL 作为数据库类型。
    host: '127.0.0.1',
    port: 3306,
    database: 'homestay',
    timezone: '+08:00',
    username: 'admin',
    password: '123456',
    define: {
      freezeTableName: true, // 表示禁止自动为模型名称添加复数形式的 "s" 后缀。
      createdAt: 'create_at',
      updatedAt: 'update_at',
    },
    // sync: {
    //   alter: true, //表示在应用启动时，自动根据模型定义修改数据库表结构，以保持与模型定义的一致性。
    // },
    dialectOptions: {
      dateStrings: true,
      /**
       *
       *dateStrings: true 表示将日期类型的字段以字符串形式返回，而不是默认的 JavaScript Date 对象。
       *typeCast 函数用于自定义字段类型转换。在这里，对于字段类型为 DATETIME 的情况，将其转换为正确的时间格式返回。
       */
      typeCast(field, next) {
        if (field.type === 'DATETIME') {
          // 返回正确得时间
          return field.string()
        }
        return next()
      },
    },
  }
  // config.customLogger 是一个对象，用于配置自定义的日志记录器。

  // devLogger 定义日志记录器的名称，可以根据实际需要进行命名。

  // file: path.join(appInfo.root, 'logs/dev/runtime.log') 指定了日志文件输出的路径，使用了 path.join 函数将日志文件名与应用程序根目录进行拼接。

  // formatter(meta) 是一个函数，用于格式化日志记录的元数据。在这里，它接收一个 meta 参数，其中包含了日志的日期和消息，通过拼接返回了格式化后的日志字符串。

  // contextFormatter(meta) 是一个函数，用于格式化上下文相关的日志记录的元数据。在这里，它接收一个 meta 参数，其中包含了日志的日期和消息。还可以包含了上下文的方法和URL信息，但被注释掉了。通过拼接返回了格式化后的日志字符串。

  // 这段代码是用于配置自定义日志记录器的选项，包括日志文件路径、日志消息的格式化函数等。它可以根据需要配置多个自定义的日志记录器。

  config.customLogger = {
    devLogger: {
      file: path.join(appInfo.root, 'logs/dev/runtime.log'),
      // egg自带的日志格式化插件
      formatter(meta) {
        return `[${meta.date}] ${meta.message}`
      },
      // ctx logger
      contextFormatter(meta) {
        // return `[${meta.date}] [${meta.ctx.method} ${meta.ctx.url}] ${meta.message}`;
        return `[${meta.date}] ${meta.message}`
      },
    },
  }
  // add your user config here
  const userConfig = {
    // 系统默认超级管理员配置
    admin: {
      username: 'admin',
      password: '123456',
      nickname: '超级管理员',
    },
  }

  return {
    ...config,
    ...userConfig,
  }
}
