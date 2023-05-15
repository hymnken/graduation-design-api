/* eslint-disable strict */

const md5 = require('md5')
exports.install = async app => {

    // 同步表结构
    // await app.model.sync({ alter: true })

    // 创建超级管理员
    let admin = app.config.admin
    // 修改了密码也会新创建一个默认管理员账号
    admin.password = md5(admin.password)
    // 没有 root 用户 则创建一个默认的root用户
    await app.model.SysUser.findOrCreate({
        where: admin,
        defaults: {
            ...admin,
            root: true
        }
    })
}