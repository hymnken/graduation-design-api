'use strict';
module.exports = (app) => {
    const { INTEGER, BOOLEAN, STRING, TEXT } = app.Sequelize;
    const SysLog = app.model.define('sys_log', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        module_name: { type: STRING(20), allowNull: true, comment: '模块' },
        request_method: { type: STRING(20), allowNull: true, comment: '请求方式' },
        request_host: { type: STRING(50), allowNull: true, comment: '请求ip' },
        request_api: { type: STRING(200), allowNull: true, comment: 'api地址' },
        status_text: { type: STRING(20), allowNull: true, comment: '状态文本' },
        status_code: { type: STRING(20), allowNull: true, comment: '状态码' },
        message: { type: STRING(200), allowNull: true, comment: '消息' },
        err_detail: { type: TEXT, allowNull: true, comment: '详情' },
        handler: { type: STRING(500), allowNull: true, comment: '操作人' },
        handler_id: { type: STRING(500), allowNull: true, comment: '操作人id' },
    }, {
        comment: '系统日志表',
    });

    SysLog.sync({ alter: true })
    return SysLog;
};