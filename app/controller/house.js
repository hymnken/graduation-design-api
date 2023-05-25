'use strict'
const Controller = require('egg').Controller
class HouseController extends Controller {
  async houseList() {
    const { ctx, app } = this
    const { page, enable, house_type, reset, keyword } = ctx.query
    const params = {}
    const { Op } = this.app.Sequelize
    let where = {}
    if (page) {
      params.offset = (page - 1) * 10
      params.limit = 10
    }
    if (enable) {
      where = {
        enable: true,
      }
    }
    if (house_type) {
      where.house_type = house_type
    }
    if (reset) {
      where.surplus_rooms = {
        [Op.gte]: 1,
      }
    }
    if (keyword) {
      where['fullname'] = {
        [Op.like]: '%' + keyword + '%',
      }
    }
    // console.log('%c [ where ]-26', 'font-size:13px; background:pink; color:#bf2c9f;', where)
    const res = await ctx.model.House.findAndCountAll({
      ...params,
      where,
      include: [
        {
          association: ctx.model.House.hasMany(ctx.model.HouseImage, {}),
          as: 'images',
          attributes: ['src'],
        },
      ],
      order: [['id', 'DESC']],
    })
    ctx.send(res, { data: res })
  }
  async houseOff() {
    const params = this.ctx.bodyParams
    if (!params.id) {
      return this.ctx.failed()
    }
    const id = params.id
    const enable = Boolean(params.enable)
    const res = await this.ctx.model.House.update(
      { enable },
      {
        where: {
          id,
        },
      }
    )
    this.ctx.send(res)
  }
  async imagesList() {
    const { ctx, app } = this
    const { house_id } = ctx.query
    if (!house_id) {
      return ctx.failed(`错误请求[0]`)
    }
    const res = await ctx.model.HouseImage.findAll({
      where: {
        houseId: house_id,
      },
    })
    ctx.send(res, { data: res })
  }
  async coverUpload() {
    const res = await this.ctx.service.file.imageUpload()
    this.ctx.success(res)
  }
  async imageUpload() {
    const res = await this.ctx.service.file.imageUpload()
    this.ctx.success(res)
  }
  async houseModify() {
    const { ctx } = this
    const params = ctx.bodyParams
    const houseData = params.house || {}
    const images = params.images
    const houseParams = ctx.helper.pick(['id', 'fullname', 'mobile', 'street', 'cover', 'price', 'rooms'], houseData, true)
    if (!houseParams.cover) {
      return ctx.failed(`请上传封面图`)
    }
    if (!houseParams.street) {
      return ctx.failed(`请填写地址`)
    }
    if (!_check.isMobile(houseParams.mobile)) {
      return ctx.failed(`请输入正确的手机号`)
    }
    if (!_check.isPrice(houseParams.price)) {
      return ctx.failed(`金额不正确`)
    }
    if (!_check.isNumberStr(houseParams.rooms) || houseParams.rooms <= 0) {
      return ctx.failed(`房间数不正确`)
    }
    // houseParams.price = houseParams.price * 100
    let modifyRes
    if (houseParams.id) {
      const houseDbData = ctx.model.House.findOne({
        where: { id: houseParams.id },
      })
      let oRooms = houseDbData.rooms
      let offsetRooms = houseDbData.surplus_rooms
      let orderRooms = oRooms - offsetRooms //已经被订购的房间数
      houseParams['houseParams'] = orderRooms >= houseParams.rooms ? 0 : houseParams.rooms - orderRooms
      modifyRes = await ctx.model.House.update(houseParams, {
        where: {
          id: houseParams.id,
        },
      })
    } else {
      houseParams.surplus_rooms = houseParams.rooms
      modifyRes = await ctx.model.House.create(houseParams)
    }
    if (modifyRes) {
      let houseId = houseParams.id ? houseParams.id : modifyRes.id
      let imageItems = images.map((v) => {
        return {
          houseId: houseId,
          src: v,
        }
      })
      await ctx.model.HouseImage.destroy({ where: { houseId: houseId } })
      await ctx.model.HouseImage.bulkCreate(imageItems)
    }
    ctx.send(modifyRes)
  }
  async houseDetail() {
    const { ctx } = this
    const params = ctx.query
    if (!params.id) {
      return ctx.miss()
    }
    const house = await ctx.model.House.findOne({ where: { id: params.id } })
    if (!house || !house.enable) {
      ctx.failed(`该房屋不存在`)
    }
    const images = await ctx.model.HouseImage.findAll({ where: { houseId: params.id } })
    ctx.success({
      house,
      images: images || [],
    })
  }
}
module.exports = HouseController
