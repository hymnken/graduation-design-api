'use strict';
module.exports = (app) => {
    const { INTEGER, BOOLEAN, STRING, DECIMAL, Op, JSON } = app.Sequelize;
    const Message = app.model.define('message', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: INTEGER, allowNull: true, comment: '所属用户id' },
        admin_id: { type: INTEGER, allowNull: true, comment: '管理员id' },
        admin_username: { type: STRING(20), allowNull: true, comment: '管理员name' },
        parent_id: { type: INTEGER, allowNull: true, comment: '父级id' },
        mobile: { type: STRING(11), allowNull: true, comment: '手机号' },
        content: { type: STRING(500), allowNull: false, comment: '留言内容' },
        status: { type: INTEGER, allowNull: false, defaultValue: 1, comment: '状态1待回复，2已回复，0关闭' },
    }, {
        comment: '用户留言表',
    });

    Message.associate = () => {
        app.model.Message.belongsTo(app.model.User, { foreignKey: 'user_id', targetKey: 'id', as: 'user' })
    }
    // Message.sync({ force: true })
    return Message;
};