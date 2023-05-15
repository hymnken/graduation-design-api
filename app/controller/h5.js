'use strict';
const Controller = require('egg').Controller;
const md5 = require('md5')
const H5_CAPTCHA_KEY = 'h5-captcha'
const H5_USER_KEY = 'h5-user-info'
const H5_HOLD_KET = 'h5-hold-key'
class H5Controller extends Controller {

    async login() {
        const { ctx } = this
        const { ...bodyParams } = ctx.bodyParams
        let params = ctx.helper.pick(['mobile', 'password'], bodyParams, true)
        const captchaCache = ctx.session[H5_CAPTCHA_KEY] || ''
        if (!params.mobile || !_check.isMobile(params.mobile)) {
            return ctx.failed(`手机号格式不正确`)
        }
        if (!params.password || !_check.isPassword(params.password)) {
            return ctx.failed(`密码格式不正确`)
        }
        if (!bodyParams.captcha || bodyParams.captcha.toUpperCase() !== captchaCache.toUpperCase()) {
            return ctx.failed(`验证码不正确`)
        }
        const hasOne = await ctx.model.User.findOne({ where: { mobile: params.mobile } })
        if (!hasOne) {
            return ctx.failed(`用户不存在`)
        }
        const password = md5(params.password)
        if (password !== hasOne.password) {
            return ctx.failed(`密码错误`)
        }
        // 重置验证码
        const captcha = await this.service.captcha.createCaptcha()
        this.ctx.session[H5_CAPTCHA_KEY] = captcha.text
        const userInfo = ctx.helper.pick(['id', 'username', 'mobile', 'avatar', 'realname', 'ident'], hasOne.dataValues, true)
        userInfo['token'] = ctx.helper.createToken(userInfo.mobile)
        ctx.session[H5_USER_KEY] = userInfo
        ctx.h5_user = userInfo
        ctx.success(userInfo)
    }
    // 修改信息
    async modify() {
        const { ctx } = this
        const { ...bodyParams } = ctx.bodyParams
        const user = ctx.session[H5_USER_KEY]
        if (!user || !user.id) {
            throw new _api.AuthFailed()
        }
        const userId = user.id
        let params = ctx.helper.pick(
            [
                'mobile',
                'password',
                'rePassword',
                'secret',
                'secret_answer',
                'realname',
                'ident',
                'username',
                'id',
                'oldPassword'
            ]
            , bodyParams, true)
        if (!bodyParams.oldPassword) {
            return ctx.failed(`原密码错误`)
        }
        let changeParams = {}
        if (params.mobile && params.mobile !== user.mobile) {
            if (!_check.isMobile(params.mobile)) {
                return ctx.failed(`请输入正确的手机号`)
            }
            changeParams.mobile = params.mobile
        }
        if (params.password) {
            if (!_check.isPassword(params.password)) {
                return ctx.failed(`请输入6-20位不含特殊字符的密码`)
            }
            if (!params.password || !params.rePassword || params.password !== params.rePassword) {
                return ctx.failed(`两次输入的密码不一致`)
            }
            changeParams.password = md5(params.password)
        }
        if (params.secret) {
            if (!params.secret_answer) {
                return ctx.failed(`请填写密码问题的答案`)
            }
            changeParams.secret = params.secret
            changeParams.secret_answer = params.secret_answer
        }
        if (params.secret_answer) {
            if (!params.secret) {
                return ctx.failed(`请选择密保问题`)
            }
        }
        if (params.realname && params.realname !== user.realname) {
            changeParams.realname = params.realname
        }
        if (params.ident && params.ident !== user.ident) {
            if (!_check.isIdent(params.ident)) {
                return ctx.failed(`请输入正确的身份证号码`)
            }
            changeParams.ident = params.ident
        }
        if (params.username && params.username !== user.username) {
            if (!_check.isNickname(params.username)) {
                return ctx.failed(`非法昵称`)
            }
            changeParams.username = params.username
        }
        const userDbInfo = await ctx.model.User.findOne({ where: { id: userId } })
        if (!userDbInfo || userDbInfo.id !== userId) {
            return ctx.failed(`账号不存在[0]`)
        }
        if (changeParams.mobile) {
            const hasOne = await ctx.model.User.findOne({ where: { mobile: changeParams.mobile } })
            if (hasOne && hasOne.mobile === changeParams.mobile) {
                return ctx.failed(`手机号已存在`)
            }
        }
        const oldPassword = md5(params.oldPassword)
        if (oldPassword !== userDbInfo.password) {
            return ctx.failed(`原密码不正确`)
        }
        const res = await ctx.model.User.update(changeParams, {
            where: {
                id: userId
            }
        })
        // 清空session 需要重新登录
        ctx.session[H5_USER_KEY] = null
        ctx.send(res)
    }
    // 注册新用户
    async register() {
        const { ctx } = this
        const { ...bodyParams } = ctx.bodyParams
        let params = ctx.helper.pick(['mobile', 'password', 'rePassword', 'secret', 'secret_answer', 'realname', 'ident'], bodyParams, true)
        if (!_check.isMobile(params.mobile)) {
            return ctx.failed(`请输入正确的手机号`)
        }
        if (!_check.isPassword(params.password)) {
            return ctx.failed(`请输入6-20位不含特殊字符的密码`)
        }
        if (!params.password || !params.rePassword || params.password !== params.rePassword) {
            return ctx.failed(`两次输入的密码不一致`)
        }
        if (!params.secret) {
            return ctx.failed(`请选择密保问题`)
        }
        if (!params.secret_answer) {
            return ctx.failed(`请填写密码问题的答案`)
        }
        if (!params.realname) {
            return ctx.failed(`请输入真实姓名`)
        }
        if (!_check.isIdent(params.ident)) {
            return ctx.failed(`请输入正确的身份证号码`)
        }
        delete params.rePassword
        params.username = params.mobile
        const hasOne = await ctx.model.User.findOne({ where: { mobile: params.mobile } })
        if (hasOne && hasOne.id) {
            ctx.failed(`手机号已注册`)
            return
        }
        params.password = md5(params.password)
        let res = await ctx.model.User.create(params)
        ctx.send(res, { data: '' })
    }

    //captcha 图形验证码
    async captcha() {
        const captcha = await this.service.captcha.createCaptcha()
        this.ctx.session[H5_CAPTCHA_KEY] = captcha.text
        this.ctx.response.type = 'image/svg+xml'
        this.ctx.body = captcha.data
    }


    async forgot() {
        const { ctx } = this
        const { ...bodyParams } = ctx.bodyParams
        if (!bodyParams.mobile || !_check.isMobile(bodyParams.mobile)) {
            return ctx.failed(`手机号格式不正确`)
        }
        const hasOne = await ctx.model.User.findOne({ where: { mobile: bodyParams.mobile } })
        if (!hasOne) {
            return ctx.failed(`账号不存在`)
        }
        ctx.success({ secret: hasOne.secret })
    }

    async secretCheck() {
        const { ctx } = this
        const { ...bodyParams } = ctx.bodyParams
        if (!bodyParams.mobile || !_check.isMobile(bodyParams.mobile)) {
            return ctx.failed(`手机号格式不正确`)
        }
        if (!bodyParams.secret_answer) {
            return ctx.failed(`答案不能为空`)
        }
        const hasOne = await ctx.model.User.findOne({ where: { mobile: bodyParams.mobile } })
        if (!hasOne) {
            return ctx.failed(`账号不存在`)
        }
        if (hasOne.secret_answer !== bodyParams.secret_answer) {
            return ctx.failed(`答案不正确`)
        }
        const k = ctx.helper.createToken(Math.random())
        ctx.session[H5_HOLD_KET] = k
        ctx.success({ code: k })
    }
    async resetPassword() {
        const { ctx } = this
        const { ...bodyParams } = ctx.bodyParams
        const code = ctx.session[H5_HOLD_KET] || ''
        let params = ctx.helper.pick(['mobile', 'code', 'password', 'rePassword', 'secret_answer'], bodyParams, true)
        if (!params.code || params.code !== code) {
            return ctx.failed(`会话已过期，请刷新页面后重试`)
        }
        if (!_check.isMobile(params.mobile)) {
            return ctx.failed(`请输入正确的手机号`)
        }
        if (!_check.isPassword(params.password)) {
            return ctx.failed(`请输入6-20位不含特殊字符的密码`)
        }
        if (!params.password || !params.rePassword || params.password !== params.rePassword) {
            return ctx.failed(`两次输入的密码不一致`)
        }
        if (!params.secret_answer) {
            return ctx.failed(`答案不正确`)
        }
        const hasOne = await ctx.model.User.findOne({ where: { mobile: params.mobile } })
        if (!hasOne) {
            return ctx.failed(`账号不存在`)
        }
        if (hasOne.secret_answer !== params.secret_answer) {
            return ctx.failed(`答案不正确`)
        }
        const password = md5(params.password)
        let res = await ctx.model.User.update({
            password
        }, { where: { mobile: params.mobile } })
        ctx.session[H5_HOLD_KET] = ''
        ctx.send(res)
    }

    // 退出登录
    async logout() {
        // 清除session
        this.ctx.session[H5_USER_KEY] = null
        this.ctx.success(`ok`)
    }


    // 写入留言
}

module.exports = H5Controller

