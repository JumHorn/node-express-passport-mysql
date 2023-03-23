// config/database.js
module.exports = {
    'connection': {
        'host': 'localhost',
        'user': 'root',
        'password': 'password',
		'ssl': {},
		retry: {
			enabled: true,
			retries: 5,
			factor: 2,
			minTimeout: 1000,
			maxTimeout: 5000,
		},
    },
	'database': 'my_schema',
    'users_table': 'users'
};
