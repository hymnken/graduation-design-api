'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, jwt, controller } = app

  const isLogin = app.middleware.auth({ ident: 'h5-user' }, app)
  router.post('/h5/login', controller.h5.login)
  router.get('/h5/logout', controller.h5.logout)
  router.post('/h5/register', controller.h5.register)
  router.post('/h5/user/modify', controller.h5.modify)
  router.post('/h5/user/message', isLogin, controller.message.createMessage)
  router.get('/h5/user/message/list', isLogin, controller.message.messageList)
  router.get('/h5/user/message/detail', isLogin, controller.message.messageDetail)
  // 验证码
  router.get('/h5/captcha', controller.h5.captcha)
  // 忘记密码
  router.post('/h5/forgot/mobile', controller.h5.forgot)
  router.post('/h5/forgot/secret/check', controller.h5.secretCheck)
  router.post('/h5/forgot/reset', controller.h5.resetPassword)
  // 民宿相关
  router.get('/h5/house/list', isLogin, controller.house.houseList)
  router.get('/h5/house/detail', isLogin, controller.house.houseDetail)
  // 订单
  router.post('/h5/house/order/create', isLogin, controller.order.createOrder)
  router.get('/h5/house/order/detail', isLogin, controller.order.orderDetail)
  router.post('/h5/house/order/payment', isLogin, controller.order.payment)
  router.get('/h5/house/order/list', isLogin, controller.order.orderList)
}
