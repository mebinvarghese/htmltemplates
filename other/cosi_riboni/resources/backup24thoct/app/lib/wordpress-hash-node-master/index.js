module.exports = require('./lib/hash.js');
angular.module('PHPass', [])
.constant("PHPass",require('wordpress-hash-node'));