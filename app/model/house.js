'use strict';
module.exports = (app) => {
    const { INTEGER, BOOLEAN, STRING, DECIMAL, Op, JSON } = app.Sequelize;
    const House = app.model.define('house', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        fullname: { type: STRING(50), allowNull: false, comment: '全称' },
        mobile: { type: STRING(11), allowNull: true, comment: '联系方式' },
        street: { type: STRING(150), allowNull: false, comment: '地址' },
        cover: { type: STRING(150), allowNull: false, comment: '封面' },
        price: { type: INTEGER, allowNull: false, comment: '单价' },
        rooms: { type: INTEGER, allowNull: false, comment: '房间' },
        house_type: { type: STRING(20), allowNull: true, comment: '标签' },
        surplus_rooms: { type: INTEGER, allowNull: false, comment: '剩余房间' },
        enable: { type: BOOLEAN, defaultValue: 1, comment: '是否启用,1上架,0下架' },
    }, {
        comment: '民宿房间表',
    });

    // House.sync({ alter: true })
    return House;
};