'use strict';
module.exports = (app) => {
    const { INTEGER, BOOLEAN, STRING } = app.Sequelize;
    const SysRole = app.model.define('sys_role', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: STRING(55), allowNull: false, comment: '角色名称' },
        intro: { type: STRING(155), allowNull: true, comment: '角色描述' },
        enable: { type: BOOLEAN, defaultValue: 1, comment: '是否启用,1启用,0禁止' },
    }, {
        comment: '管理员角色表',
    });

    SysRole.sync({ alter: true })
    return SysRole;
};