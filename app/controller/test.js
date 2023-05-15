'use strict';
const Controller = require('egg').Controller;

class TestController extends Controller {

    // 分类列表
    async test() {
        this.ctx.success('test success')
    }
    async login() {
        if (this.ctx.isAuthenticated()) {
            this.ctx.success(this.ctx.user)
        } else {
            this.ctx.failed(`登录失败`)
        }
    }
}

module.exports = TestController

