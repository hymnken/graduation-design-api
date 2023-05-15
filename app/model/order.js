'use strict';
module.exports = (app) => {
    const { INTEGER, BOOLEAN, STRING, DECIMAL, Op, JSON } = app.Sequelize;
    const Order = app.model.define('order', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        house_id: { type: INTEGER, allowNull: false, comment: '房屋id' },
        user_id: { type: INTEGER, allowNull: false, comment: '用户id' },
        rooms: { type: INTEGER, allowNull: false, comment: '房间数' },
        days: { type: INTEGER, defaultValue: 1, comment: '预定天数默认1' },
        earnest_money: { type: INTEGER, allowNull: false, comment: '定金' },
        surplus_money: { type: INTEGER, allowNull: false, comment: '剩余金额' },
        total_money: { type: INTEGER, allowNull: false, comment: '总金额' },
        consumer_name: { type: STRING(20), allowNull: false, comment: '住户姓名' },
        consumer_mobile: { type: STRING(11), allowNull: false, comment: '住户联系方式' },
        consumer_ident: { type: STRING(30), allowNull: false, comment: '住户证件号' },
        status: { type: INTEGER, allowNull: false, defaultValue: 1, comment: '状态，1未支付，2待入住，3已入住，4离店，5完成,0过期' }
    }, {
        comment: '订单表',
    });

    Order.associate = () => {
        app.model.Order.belongsTo(app.model.House, { foreignKey: 'house_id', targetKey: 'id', as: 'house' })
        app.model.Order.belongsTo(app.model.User, { foreignKey: 'user_id', targetKey: 'id', as: 'user' })
    }
    // Order.sync({ force: true })
    return Order;
};