'use strict';
module.exports = (app) => {
    const { INTEGER, BOOLEAN, STRING, DECIMAL, Op, JSON } = app.Sequelize;
    const SysUser = app.model.define('sys_user', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        role_id: { type: INTEGER, allowNull: true, comment: '所属角色' },
        avatar: { type: STRING(255), allowNull: true, comment: '用户头像' },
        mobile: { type: STRING(11), comment: '手机号' },
        username: { type: STRING(20), unique: true, comment: '用户名' },
        nickname: { type: STRING(20), comment: '用户昵称' },
        password: { type: STRING(255), comment: '密码' },
        enable: { type: BOOLEAN, defaultValue: 1, comment: '是否启用,1启用,0禁止' },
        root: { type: BOOLEAN, defaultValue: 0, comment: '是否为超级管理员,超级管理员不可删除' },
    }, {
        comment: '管理员用户表',
    });

    SysUser.associate = () => {
        app.model.SysUser.belongsTo(app.model.SysRole, { foreignKey: 'role_id', targetKey: 'id', as: 'role' })
    }
    // SysUser.sync({ force: true })
    return SysUser;
};