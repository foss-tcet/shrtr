const mysql = require('mysql')

var connection = mysql.createConnection({
    host     : 'host_name',
    user     : 'user_name',
    password : 'password',
    database : 'db_name'
})

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;