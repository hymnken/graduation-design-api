'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, jwt, controller } = app
  const adminLogin = app.passport.authenticate('local', { successRedirect: '/admin/auth', failureRedirect: '/admin/auth' })
  const mountAuth = (module = '', name = '', ident = '', mount = 1) => {
    const params = { module, name, ident, mount }
    return app.middleware.admin(params, app)
  }
  const isLogin = app.middleware.auth({ ident: 'admin' }, app)
  router.post('/admin/login', adminLogin)
  router.get('/admin/auth', controller.admin.login)
  router.get('/admin/logout', isLogin, controller.admin.logout)
  router.get('/admin/user/list', mountAuth('管理员', '查看管理员列表', 'sys_user_list'), controller.admin.userList)
  router.get('/admin/user/profile', isLogin, controller.admin.userProfile)
  router.post('/admin/user/profile/modify', isLogin, controller.admin.userProfileModify)
  router.get('/admin/user/detail', mountAuth('管理员', '获取管理员详情', 'sys_user_detail'), controller.admin.userDetail)
  router.post('/admin/user/modify', mountAuth('管理员', '编辑用户', 'sys_user_modify'), controller.admin.userModify)
  router.get('/admin/user/delete', mountAuth('管理员', '删除用户', 'sys_user_delete'), controller.admin.userDelete)
  router.get('/admin/role/list', mountAuth('管理员', '角色列表', 'sys_role_list'), controller.admin.roleList)
  router.post('/admin/role/create', mountAuth('管理员', '创建角色', 'sys_role_create'), controller.admin.roleCreate)
  router.get('/admin/role/delete', mountAuth('管理员', '删除角色', 'sys_role_delete'), controller.admin.roleDelete)
  router.post('/admin/role/modify', mountAuth('管理员', '编辑角色', 'sys_role_modify'), controller.admin.roleModify)
  router.get(
    '/admin/permission/list',
    mountAuth('管理员', '获取权限列表', 'sys_permission_list'),
    controller.admin.permissionList
  )
  router.get('/admin/role/detail', mountAuth('管理员', '获取角色详情', 'sys_role_detail'), controller.admin.roleDetail)
  router.get('/admin/log/list', mountAuth('管理员', '系统日志', 'sys_log'), controller.admin.sysLogList)
  router.get('/admin/message/list', mountAuth('管理员', '留言管理', 'sys_message'), controller.message.adminMessageList)
  router.get('/admin/message/detail', mountAuth('管理员', '留言管理', 'sys_message'), controller.message.messageDetail)
  router.post('/admin/message/reply', mountAuth('管理员', '留言管理', 'sys_message'), controller.message.adminReply)
  router.get('/admin/house/list', mountAuth('管理员', '民宿管理', 'sys_house'), controller.house.houseList)
  router.post('/admin/house/modify', mountAuth('管理员', '民宿管理', 'sys_house'), controller.house.houseModify)
  router.post('/admin/house/off', mountAuth('管理员', '民宿管理', 'sys_house'), controller.house.houseOff)
  router.get('/admin/house/images/list', mountAuth('管理员', '民宿管理', 'sys_house'), controller.house.imagesList)
  router.get('/admin/h5/user/list', mountAuth('管理员', '用户管理', 'sys_h5_user'), controller.user.userList)
  router.post('/admin/h5/user/modify', mountAuth('管理员', '用户管理', 'sys_h5_user'), controller.user.userModify)
  router.get('/admin/h5/user/delete', mountAuth('管理员', '用户管理', 'sys_h5_user'), controller.user.userDelete)
  router.get('/admin/order/list', mountAuth('管理员', '订单管理', 'sys_order'), controller.order.orderList2)
  router.get('/admin/order/delete', mountAuth('管理员', '订单管理', 'sys_order'), controller.order.orderDelete)
  router.post('/admin/order/renew', mountAuth('管理员', '订单管理', 'sys_order'), controller.order.orderRenew)
  router.get('/admin/order/complete', mountAuth('管理员', '订单管理', 'sys_order'), controller.order.orderComplete)
  router.get('/admin/order/come', mountAuth('管理员', '订单管理', 'sys_order'), controller.order.orderComeIn)
  router.get('/admin/order/analysis', mountAuth('管理员', '订单管理', 'sys_order'), controller.order.orderAnalysis)
  router.post('/admin/upload', isLogin, controller.admin.imageUpload)
  router.post('/admin/house/cover/upload', isLogin, controller.house.coverUpload)
  router.post('/admin/house/images/upload', isLogin, controller.house.imageUpload)
}
