'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/db.config.js')[env];
var chalk = require('chalk')
const db = {};



let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}


fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(async file => {
    var model = await sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

//*********relation defin*********** */

//sequelize.models.Player.belongsTo(sequelize.models.Team, {foreignKey : 'team_id'});
//sequelize.models.Team.hasMany(sequelize.models.Player);


db.sequelize = sequelize;
db.Sequelize = Sequelize;
console.log('connecting to database')
db.sequelize.sync({ alter: true }).then(() => {
  console.log(chalk.green('database synced :)'))
}).catch(e => {
  console.log(e)
})

module.exports = db;
