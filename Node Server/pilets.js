// Required Dependencies
var Gpio = require('onoff').Gpio;
var mysql = require('mysql');
var MySQLEvents = require('mysql-events');

// SQL Connections
var con = mysql.createConnection({
	host:         'localhost',
	user:         'outlets',
	password:     '',
	database:     '',
	port:         3306
});

var dsn = {
	host:         'localhost',
	user:         '',
	password:     '',
	port:         3306
};

// Setup GPIO configurations
var light = new Gpio(16, 'out');
var temp = new Gpio(12, 'in');
var out1 = new Gpio(6, 'out');
var out2 = new Gpio(5, 'out');
var out3 = new Gpio(25, 'out');
var out4 = new Gpio(24, 'out');
var out5 = new Gpio(23, 'out');
var out6 = new Gpio(17, 'out');
var out7 = new Gpio(18, 'out');
var out8 = new Gpio(4, 'out');

// Set arrays
var outs = [light, out1, out2, out3, out4, out5, out6, out7, out8];
var sql = {
	"all" : "SELECT * FROM outlets",
	"pi_on" : "UPDATE outlets SET status = 1, checked = 1, color = 'green' WHERE id = 9",
	"pi_off" : "UPDATE outlets SET status = 0, command = 0, checked = 0, color = 'red' WHERE id = 9",
	"outlet_on" : "UPDATE outlets SET status = 1, checked = 1, color = 'green' WHERE id = ",
	"outlet_off" : "UPDATE outlets SET status = 0, checked = 0, color = 'red' WHERE id = "
};

// Connect to MySQL
con.connect(function(err) {
    if (err) throw err;
});

// Let the system know the hardware is running again
updateSQL("pi_on");

// Initialization
light.writeSync(1);
var mysqlEventWatcher = MySQLEvents(dsn);

// Put each outlet back to where it was when the system shut down
con.query(sql["all"], function (err, result) {
	if (err) throw err;

	Object.keys(result).forEach(function(key) {
		var row = result[key];

		if (row.id <= 8) {
			if (row.command == 0) {
				outs[row.id].writeSync(1);
				
				if (outs[row.id].readSync() == 1) {
					updateSQL("outlet_off", row.id);
				}
			} else {
				outs[row.id].writeSync(0);
				
				if (outs[row.id].readSync() == 0) {
					updateSQL("outlet_on", row.id);
				}
			}
		}
	});
});

// SQL Database watcher
var watcher = mysqlEventWatcher.add(
	'pi.outlets',
	function (oldRow, newRow, event) {
		if (oldRow !== null && newRow !== null) {
			if (newRow.fields.id <= 8) {
				if (newRow.fields.command == 0) {
					outs[newRow.fields.id].writeSync(1);
				
					if (outs[newRow.fields.id].readSync() == 1) {
						updateSQL("outlet_off", newRow.fields.id);
					}
				} else {
					outs[newRow.fields.id].writeSync(0);
					
					if (outs[newRow.fields.id].readSync() == 0) {
						updateSQL("outlet_on", newRow.fields.id);
					}
				}
			} else if (newRow.fields.id == 9) {
				if (newRow.fields.command == 1) {
					updateSQLExit();
					require('child_process').exec('sudo /sbin/shutdown -r now');
				}
			}
		}
	}
);

// Functions
function updateSQL(query, id = null) {
	if (id != null) {
		con.query(sql[query] + id, function (err, result) {
			if (err) throw err;
		});
	} else {
		con.query(sql[query], function (err, result) {
			if (err) throw err;
		});
	}
}

// On exit
process.on('SIGINT', function() {
    updateSQL("pi_off");
});
