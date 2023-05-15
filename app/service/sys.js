'use strict';

const Service = require('egg').Service;
class SysService extends Service {

    // 获取当前用户的所有权限
    async createLog(opt) {
        const params = Object.assign({}, {
            module_name: '',
            request_method: '',
            request_host: '',
            request_api: '',
            status_text: '',
            status_code: '',
            message: '',
            err_detail: '',
            handler: '',
            handler_id: ''
        }, opt)
        if (params.status_code == 200) return
        try {
            this.ctx.model.SysLog.create(params)
        } catch (err) {

        }
    }
}


module.exports = SysService;