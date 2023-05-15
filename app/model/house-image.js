'use strict';
module.exports = (app) => {
    const { INTEGER, STRING } = app.Sequelize;
    const HouseImage = app.model.define('house_image', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        houseId: { type: INTEGER, allowNull: false, comment: '民宿id' },
        src: { type: STRING(150), allowNull: false, comment: '封面' },
    }, {
        comment: '民宿图片表',
    });
    HouseImage.associate = () => {
        app.model.HouseImage.belongsTo(app.model.House, { foreignKey: 'houseId', targetKey: 'id', as: 'house' })
    }
    // HouseImage.sync({ alter: true })
    return HouseImage;
};