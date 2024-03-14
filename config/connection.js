// config/connection.js

// load up the user model
var mysql = require('mysql2');
var dbconfig = require('./database');
var connection = mysql.createPool(dbconfig.connection);

module.exports = {
	connection: connection
};