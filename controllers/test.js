var md = require('../models')
var env = process.env.NODE_ENV || 'development';
var config = require('../config/db.config')[env];

exports.test = async function (req, res, next) {
    var obj = {
        name: 'testing'
    }
    await md.Test.create(obj).then(async function (success) {
        res.send(success)
    }).catch(async err => {
        res.send(err)
    });
}