// config/database.js
module.exports = {
    'connection': {
        'host': 'localhost',
        'user': 'root',
        'password': 'password',
        'database': 'database_name',
        'ssl': {},
        retry: {
            enabled: true,
            retries: 5,
            factor: 2,
            minTimeout: 1000,
            maxTimeout: 5000,
        },
    },
    'users_table': 'users_table_name'
};
