'use strict';
module.exports = (app) => {
    const { INTEGER, BOOLEAN, STRING, DECIMAL, Op, JSON } = app.Sequelize;
    const User = app.model.define('user', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        avatar: { type: STRING(255), allowNull: true, comment: '用户头像' },
        mobile: { type: STRING(11), unique: true, comment: '手机号' },
        username: { type: STRING(20), comment: '用户名' },
        password: { type: STRING(255), comment: '密码' },
        secret: { type: STRING(100), comment: '密保问题' },
        secret_answer: { type: STRING(100), comment: '密保答案' },
        realname: { type: STRING(10), comment: '真实姓名' },
        ident: { type: STRING(30), comment: '证件号' },
        enable: { type: BOOLEAN, defaultValue: 1, comment: '是否启用,1启用,0禁止' },
    }, {
        comment: '用户表',
    });

    // User.sync({ force: true })

    return User;
};