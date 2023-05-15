const md5 = require('md5')

module.exports = {
  schedule: {
    cron: '0 * */30 * * *', // 每隔30s执行一次
    type: 'worker', //
    immediate: true, // 是否立即执行,
    disable: false, // 禁用 ？
  },
  async task(ctx) {
    console.log(`---------->处理过期订单`)
    const orderList = await ctx.model.Order.findAll()
    if (orderList) {
      for (let i = 0; i < orderList.length; i++) {
        let order = orderList[i]
        if (order.status == 1) {
          let createTime = new Date(order.create_at).getTime()
          let nowTime = new Date().getTime()
          if (nowTime >= 20 * 60 * 1000 + createTime) {
            console.log(`订单${order.id} 已过期`)
            await ctx.model.Order.update(
              { status: 0 },
              {
                where: {
                  id: order.id,
                },
              }
            )
            const houseId = order.house_id
            const house = await ctx.model.House.findOne({ where: { id: houseId } })
            if (house) {
              let rooms = house.surplus_rooms + order.rooms >= house.rooms ? house.rooms : house.surplus_rooms + order.rooms
              await ctx.model.House.update({ surplus_rooms: rooms }, { where: { id: houseId } })
            }
          }
        }
      }
    }
  },
}
