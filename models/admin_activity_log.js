
const withDateNoTz = require('sequelize-date-no-tz-postgres');

module.exports = async function (sequelize, Sequelize) {
    const DataTypes = withDateNoTz(Sequelize);

    const AdminActivityLog = await sequelize.define('AdminActivityLog', {
        menu_name: {
            type: Sequelize.STRING(100)
        },
        activity: {
            type: Sequelize.STRING(100)
        },
        input_msg: {
            type: Sequelize.TEXT
        },
        status: {
            type: Sequelize.STRING(50)
        },
        entry_date: {
            type: DataTypes.DATE_NO_TZ,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        device_id: {
            type: Sequelize.STRING(200)
        },
        os_id: {
            type: Sequelize.STRING(200)
        },
        version_id: {
            type: Sequelize.STRING(50)
        },
        ip_address: {
            type: Sequelize.STRING(200)
        },
        bulk_val: {
            type: Sequelize.TEXT
        }
    },
        {
            tableName: 'activity_log',
            schema: 'admin',
            freezeTableName: true,
            timestamps: false,
            underscored: true
            // indexes: [
            //     {
            //         unique: true,
            //         fields: ['name']
            //     }
            // ]
        });
        // AdminActivityLog.removeAttribute('id');
    return AdminActivityLog;
}