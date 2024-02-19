// config/connection.js

// load up the user model
var mysql = require('mysql');
var dbconfig = require('./database');
var connection = mysql.createPool(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

module.exports = {
	connection: connection
};