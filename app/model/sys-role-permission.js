'use strict';
module.exports = (app) => {
    const { INTEGER } = app.Sequelize;
    const SysRolePermission = app.model.define('sys_role_permission', {
        role_id: { type: INTEGER, allowNull: false, comment: '角色id' },
        permission_id: { type: INTEGER, allowNull: false, comment: '权限id' }
    }, {
        comment: '角色权限表',
    });

    // SysRolePermission.sync({ force: true })
    return SysRolePermission;
};