module.exports = async function(sequelize, Sequelize) {
    const Test =await sequelize.define('Test', {
        Id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
       /*  LevelData: {
            type: Sequelize.TEXT,
            allowNull: false
        }, */
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            allowNull: true
        }
    });
 
    return Test;
 }