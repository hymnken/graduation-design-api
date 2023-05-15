'use strict';
const Controller = require('egg').Controller;

class MessageController extends Controller {

    // 写入留言
    async createMessage() {
        const { ctx } = this
        const params = ctx.bodyParams
        const content = '' + params.content
        if (!content || content.length < 10) {
            return ctx.failed(`请至少输入10个字`)
        }
        let parent_id = params.parent_id || ''
        const opt = {
            content,
            user_id: ctx.h5_user.id,
            mobile: ctx.h5_user.mobile,
            status: 1,
        }
        if (parent_id) {
            opt.parent_id = parent_id
        }
        const res = await ctx.model.Message.create(opt)
        if (res && parent_id) {
            await ctx.model.Message.update({ status: 1 }, {
                where: {
                    id: parent_id
                }
            })
        }
        this.ctx.send(res, {})
    }
    async adminReply() {
        const { ctx } = this
        const params = ctx.bodyParams
        const content = '' + params.content
        const parent_id = params.parent_id || ''
        const user = ctx.user
        if (!parent_id) {
            return ctx.failed(`回复失败[0]`)
        }
        if (!content || content.length < 1) {
            return ctx.failed(`请至少输入1个字`)
        }
        const opt = {
            content,
            admin_id: user.id,
            admin_username: user.nickname,
            status: 2,
            parent_id
        }
        const res = await ctx.model.Message.create(opt)
        if (res) {
            await ctx.model.Message.update({ status: 2 }, {
                where: {
                    id: parent_id
                }
            })
        }
        this.ctx.send(res, {})
    }

    async messageList() {
        const userId = this.ctx.h5_user.id
        const res = await this.ctx.model.Message.findAndCountAll({
            where: {
                user_id: userId,
                parent_id: null
            },
            order: [['id', 'DESC']]
        })
        this.ctx.send(res, { data: res })
    }
    async adminMessageList() {
        const { ctx, app } = this
        const { page } = ctx.query
        const params = {}
        if (page) {
            params.offset = (page - 1) * 10
            params.limit = 10
        }
        const res = await ctx.model.Message.findAndCountAll({
            where: {
                parent_id: null
            },
            ...params,
            order: [['id', 'DESC']]
        })
        ctx.send(res, { data: res })
    }
    async messageDetail() {
        const params = this.ctx.query
        const { Op } = this.app.Sequelize
        const res = await this.ctx.model.Message.findAndCountAll({
            where: {
                [Op.or]: [
                    {
                        parent_id: params.parent_id || null
                    },
                    {
                        id: params.parent_id
                    }
                ]
            },
            order: [['id', 'ASC']]
        })
        this.ctx.send(res, { data: res })
    }
    async adminMessageDetail() {

    }
}

module.exports = MessageController

