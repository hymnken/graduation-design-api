'use strict';
const Controller = require('egg').Controller;
const dayjs = require('dayjs')
class OrderController extends Controller {
    // 创建订单
    async createOrder() {
        const { ctx } = this
        const bodyParams = ctx.bodyParams
        const { house_id, rooms, ...params } = bodyParams
        const user = ctx.h5_user
        if (!house_id || !rooms) {
            return ctx.miss()
        }
        const house = await ctx.model.House.findByPk(house_id)
        if (!house || !house.enable) {
            return ctx.failed(`房屋不存在`)
        }
        if (house.surplus_rooms < rooms) {
            return ctx.failed(`房屋数量不足，请重新选择`)
        }
        if (!params.consumer_name) {
            return ctx.miss(`请输入入住人姓名`)
        }
        if (!_check.isIdent(params.consumer_ident)) {
            return ctx.failed(`请输入正确的证件号`)
        }
        if (!_check.isMobile(params.consumer_mobile)) {
            return ctx.failed(`请输入正确的手机号`)
        }
        const earnest_money = rooms * house.price * 0.4
        const total_money = rooms * house.price
        const surplus_money = total_money - earnest_money
        const t = await ctx.model.transaction()
        let state = true
        try {
            const res = await ctx.model.Order.create({
                house_id,
                user_id: user.id,
                rooms,
                earnest_money,
                total_money,
                surplus_money,
                consumer_ident: params.consumer_ident,
                consumer_mobile: params.consumer_mobile,
                consumer_name: params.consumer_name,
            })
            if (res) {
                state = res.id
                const r2 = await ctx.model.House.update({
                    surplus_rooms: house.surplus_rooms - rooms
                }, {
                    where: {
                        id: house.id
                    }
                })
                if (!r2) {
                    state = false
                    t.rollback()
                } else {
                    t.commit()
                }
            } else {
                t.rollback()
                state = false
            }
        } catch (err) {
            t.rollback()
        }
        ctx.send(state, { data: { order_id: state } })
    }

    async orderDetail() {
        const { ctx } = this
        const { id } = ctx.query
        if (!id) {
            return ctx.miss()
        }

        const info = await ctx.model.Order.findOne({
            where: {
                id
            },
            include: [
                {
                    model: ctx.model.House,
                    as: 'house',
                    attributes: ['cover', 'fullname', 'price', 'street']
                }
            ]
        })
        console.log('%c [ info ]-95', 'font-size:13px; background:pink; color:#bf2c9f;', info)
        ctx.send(info, { data: info })
    }
    async payment() {
        const { ctx } = this
        const { id } = ctx.bodyParams
        if (!id) {
            return ctx.miss()
        }
        const info = await ctx.model.Order.findOne({ where: { id } })
        if (!info) {
            return ctx.failed(`订单不存在`)
        }
        let nextStatus = 2
        if (info.status == 1) {
            nextStatus = 2
        }
        if (info.status == 2) {
            nextStatus = 3
        }
        const res = await ctx.model.Order.update({ status: nextStatus }, {
            where: {
                id
            }
        })
        ctx.send(res)
    }
    async orderList() {
        const { ctx } = this
        let { page, limit, type } = ctx.query
        console.log('%c [ type ]-113', 'font-size:13px; background:pink; color:#bf2c9f;', type)
        const user = ctx.h5_user
        let order = [['id', 'DESC']]
        let where = {
            user_id: user.id,
        }
        const { Op } = this.app.Sequelize

        if (type == 1) {
            limit = 10
        }
        if (type == 2) {
            where = Object.assign(where, {
                [Op.or]: [
                    { status: 1 },
                    { status: 2 },
                ]
            })
        }
        const list = await ctx.model.Order.findAll({
            limit,
            where,
            include: [
                {
                    model: ctx.model.House,
                    as: 'house',
                    attributes: ['cover', 'fullname', 'price', 'street', 'mobile']
                }
            ],
            order
        })
        ctx.send(list, { data: list })
    }

    async orderList2() {

        const { ctx, app } = this
        const { page = 1, keyword, isComplete, isCome } = ctx.query
        const offset = (page - 1) * 10
        let order = [['id', 'DESC']]
        const { Op } = this.app.Sequelize
        let where = {
            [Op.or]: [
                { status: 0 },
                { status: 1 },
                { status: 2 },
            ]
        }
        if (isComplete) {
            where = {
                [Op.or]: [
                    { status: 5 },
                ]
            }
        }
        if (isCome) {
            where = {
                [Op.or]: [
                    { status: 3 },
                    { status: 4 },
                ]
            }
        }
        const list = await ctx.model.Order.findAndCountAll({
            limit: 10,
            where,
            offset,
            include: [
                {
                    model: ctx.model.House,
                    as: 'house',
                    attributes: ['cover', 'fullname', 'price', 'street', 'mobile']
                }
            ],
            order
        })
        ctx.send(list, { data: list })
    }

    async orderDelete() {
        const { ctx, app } = this
        let res = await app.model.Order.destroy({ where: { id: ctx.query.id } })
        const info = await ctx.model.Order.findOne({ where: { id } })
        if (!info || !info.id) {
            return ctx.failed(`订单不存在`)
        }
        const house = await ctx.model.House.findOne({ where: { id: houseId } })
        const houseId = info.house_id
        if (house) {
            let rooms = house.surplus_rooms + info.rooms >= house.rooms ? house.rooms : house.surplus_rooms + info.rooms
            await ctx.model.House.update({ surplus_rooms: rooms }, {
                where: {
                    id: houseId
                }
            })
        }
        ctx.send(res, { data: res })
    }

    async orderRenew() {
        const { ctx, app } = this
        let { id, days, price } = ctx.bodyParams
        const info = await ctx.model.Order.findOne({ where: { id } })
        if (!info || !info.id) {
            return ctx.failed(`订单不存在`)
        }
        const moreMoney = price * days * 100
        const surplus_money = info.surplus_money + moreMoney
        const total_money = info.total_money + moreMoney
        days = info.days + Number(days)
        const res = ctx.model.Order.update({ surplus_money, total_money, days }, {
            where: { id }
        })
        ctx.send(res, {})
    }

    async orderComplete() {
        const { ctx, app } = this
        let { id } = ctx.query
        const info = await ctx.model.Order.findOne({ where: { id } })
        if (!info || !info.id) {
            return ctx.failed(`订单不存在`)
        }
        const houseId = info.house_id
        const house = await ctx.model.House.findOne({ where: { id: houseId } })
        if (house) {
            let rooms = house.surplus_rooms + info.rooms >= house.rooms ? house.rooms : house.surplus_rooms + info.rooms
            await ctx.model.House.update({ surplus_rooms: rooms }, {
                where: {
                    id: houseId
                }
            })
        }
        const res = ctx.model.Order.update({ status: 5 }, {
            where: { id }
        })
        ctx.send(res, {})
    }
    async orderComeIn() {
        const { ctx, app } = this
        let { id } = ctx.query

        const res = ctx.model.Order.update({ status: 4 }, {
            where: { id }
        })
        ctx.send(res, {})
    }

    async orderAnalysis() {
        function getLastYear(yearNum = 1) {
            let today = new Date() //当天
            today.setFullYear(today.getFullYear() - yearNum)
            return today.getTime();
        }
        function getDay(day) {
            var today = new Date();
            var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
            today.setTime(targetday_milliseconds); //注意，这行是关键代码
            var tYear = today.getFullYear();
            var tMonth = today.getMonth();
            var tDate = today.getDate();
            tMonth = doHandleMonth(tMonth + 1);
            tDate = doHandleMonth(tDate);
            return new Date(tYear + "-" + tMonth + "-" + tDate).getTime();

        }
        const { ctx, app } = this
        const { type = 4 } = ctx.query
        const today = new Date().getTime()
        let lastDay = getLastYear()
        let lastDate = dayjs(lastDay).format('YYYY-MM-DD HH:mm:ss')
        if (type == 1) { //7天
            lastDate = dayjs().day(-7).format('YYYY-MM-DD HH:mm:ss')
        }
        if (type == 2) { // 1个月
            lastDate = dayjs().month(-1).format('YYYY-MM-DD HH:mm:ss')
        }
        if (type == 3) { // 半年
            lastDate = dayjs().month(-6).format('YYYY-MM-DD HH:mm:ss')
        }
        console.log('%c [ lastDate ]-261', 'font-size:13px; background:pink; color:#bf2c9f;', lastDate)
        const { Op } = this.app.Sequelize
        const list = await ctx.model.Order.findAll({
            where: {
                [Op.or]: [
                    { status: 4 },
                    { status: 5 },
                ],
                create_at: {
                    [Op.between]: [lastDate, dayjs(today).format('YYYY-MM-DD HH:mm:ss')]
                }
            }
        })
        ctx.send(list, { data: list })
    }
}

module.exports = OrderController


