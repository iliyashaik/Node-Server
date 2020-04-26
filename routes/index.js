const express = require('express')
const router = express.Router();
var path = require('path');
var Test = require('../controllers/test');

router.get('/test', Test.test)

module.exports = router;