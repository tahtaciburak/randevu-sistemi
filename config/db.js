//Please update your database info here
var mysql = require("mysql")
var db_config = {
	host	: '127.0.0.1',
	user	: 'root',
	password: '123',
	database: 'calendar'
}

var connection
	connection = mysql.createConnection(db_config)
	connection.connect(function (err) {
		if(err){
			console.log('DB_ERROR_OCCURED: Please enable your database first')
		}
	})

module.exports = connection
