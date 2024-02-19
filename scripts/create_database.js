/**
 * Created by barrett on 8/28/14.
 */

var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

connection.query('CREATE DATABASE ' + dbconfig.database);

// create user table
connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.users_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `username` VARCHAR(20) NOT NULL, \
    `password` CHAR(60) NOT NULL, \
    `level` int DEFAULT \'0\' COMMENT \'用户等级\', \
    PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id`), \
    UNIQUE INDEX `username_UNIQUE` (`username`) \
)');

// create session table
connection.query('\
CREATE TABLE `sessions` ( \
	`session_id` varchar(128) COLLATE utf8mb4_bin NOT NULL, \
	`expires` int unsigned NOT NULL, \
	`data` mediumtext COLLATE utf8mb4_bin, \
	PRIMARY KEY (`session_id`) \
) ENGINE InnoDB, \
  CHARSET utf8mb4, \
  COLLATE utf8mb4_0900_ai_ci; \
');

console.log('Success: Database Created!')

connection.end();
