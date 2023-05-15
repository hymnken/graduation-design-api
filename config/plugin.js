/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
  jwt: {
    enable: true,
    package: 'egg-jwt',
  },
  passport: {
    enable: true,
    package: 'egg-passport',
  },
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
}
