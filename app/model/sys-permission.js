'use strict';
module.exports = (app) => {
    const { INTEGER, BOOLEAN, STRING } = app.Sequelize;
    const SysPermission = app.model.define('sys_permission', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        module: { type: STRING(55), allowNull: false, comment: '权限模块' },
        name: { type: STRING(55), allowNull: false, comment: '权限的名称' },
        ident: { type: STRING(55), allowNull: false, comment: '权限标识' },
        enable: { type: BOOLEAN, defaultValue: 1, comment: '是否启用,1启用,0禁止' },
    }, {
        comment: '权限明细表',
    });

    // SysPermission.associate = () => {
    //     app.model.SysPermission.belongsTo(app.model.SysRolePermission, { foreignKey: 'id', targetKey: 'permission_id', as: 'permission' })
    // }
    // SysPermission.sync({ alter: true })
    return SysPermission;
};