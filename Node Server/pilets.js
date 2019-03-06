/**
 * Connect to a local MySQL server to perform updates to GPIO outputs and also listen for changes to
 * the database from the PHP API server.
 *
 */

// @TODO Change all throw events to try/catch in order to not crash the application.
// @TODO Change the way the app connects to the MySQL database to ensure that the app only runs once
// the connection has been made.

// Dependencies
const Gpio = require('onoff').Gpio;
const mysql = require('mysql');
const MySQLEvents = require('mysql-events');

// SQL Info
const sqlInfo = {
	host: 'localhost',
	user: 'outlets',
	password: '',
	database: '',
	port: 3306
}

// SQL Connection
const con = mysql.createConnection(sqlInfo);

// GPIO configuration
const light = new Gpio(16, 'out');
const temp = new Gpio(12, 'in');
const out1 = new Gpio(6, 'out');
const out2 = new Gpio(5, 'out');
const out3 = new Gpio(25, 'out');
const out4 = new Gpio(24, 'out');
const out5 = new Gpio(23, 'out');
const out6 = new Gpio(17, 'out');
const out7 = new Gpio(18, 'out');
const out8 = new Gpio(4, 'out');

// Set arrays
const outs = [light, out1, out2, out3, out4, out5, out6, out7, out8];
const sql = {
	"all" : "SELECT * FROM outlets",
	"pi_on" : "UPDATE outlets SET status = 1, checked = 1, color = 'green' WHERE id = 9",
	"pi_off" : "UPDATE outlets SET status = 0, command = 0, checked = 0, color = 'red' WHERE id = 9",
	"outlet_on" : "UPDATE outlets SET status = 1, checked = 1, color = 'green' WHERE id = ",
	"outlet_off" : "UPDATE outlets SET status = 0, checked = 0, color = 'red' WHERE id = "
};

// Connect to the MySQL server.
con.connect(err => {
    if (err) throw err;
});

// Let the system know the hardware is running again
updateSQL("pi_on");

// Initialization
light.writeSync(1);
// SQL Watcher Connection
const mysqlEventWatcher = MySQLEvents(sqlInfo);

/**
 * Perform a SQL query with the passed SQL string.
 *
 * @param {string} query SQL query string.
 * @param {number} id Optional ID for row to update.
 */
const updateSQL = (query, id = null) => {
	if (id != null) {
		con.query(sql[query] + id, (err, result) => {
			if (err) throw err;
		});
	} else {
		con.query(sql[query], (err, result) => {
			if (err) throw err;
		});
	}
}

// Put each outlet back to where it was when the system shut down
con.query(sql["all"], (err, result) => {
	if (err) throw err;

	// Loop the result object from finding all of the rows in the outlet tablet.
	Object.keys(result).forEach(key => {
		// Set an accessible constant for the result object.
		const row = result[key];

		// Make sure the row's ID is 1-8 (outlets only).
		if (row.id <= 8) {
			// Check the command stored in the database.
			if (row.command == 0) {
				// Turn the outlet off if the command is off.
				outs[row.id].writeSync(1);

				// Update the SQL table for the outlet if it is in fact off now.
				if (outs[row.id].readSync() == 1) {
					updateSQL("outlet_off", row.id);
				}
			} else {
				// Turn the outlet on if the command is on.
				outs[row.id].writeSync(0);

				// Update the SQL table for the outlet if it is in fact on now.
				if (outs[row.id].readSync() == 0) {
					updateSQL("outlet_on", row.id);
				}
			}
		}
	});
});

// SQL Database watcher
mysqlEventWatcher.add(
	'pi.outlets',
	(oldRow, newRow, event) => {
		// Make sure there has been a change in the row.
		if (oldRow !== null && newRow !== null) {
			// Check if the row is an outlet or the system info.
			if (newRow.fields.id <= 8) {
				// Check the new command.
				if (newRow.fields.command == 0) {
					// Turn the outlet off if the new command is off.
					outs[newRow.fields.id].writeSync(1);

					// Update the SQL table for the outlet if it is in fact off now.
					if (outs[newRow.fields.id].readSync() == 1) {
						updateSQL("outlet_off", newRow.fields.id);
					}
				} else {
					// Turn the outlet on if the new command is on.
					outs[newRow.fields.id].writeSync(0);

					// Update the SQL table for the outlet if it is in fact on now.
					if (outs[newRow.fields.id].readSync() == 0) {
						updateSQL("outlet_on", newRow.fields.id);
					}
				}
			} else if (newRow.fields.id == 9) {
				// Reboot the Raspberry PI if the command is off.
				if (newRow.fields.command == 0) {
					updateSQL("pi_off");
					require('child_process').exec('sudo /sbin/shutdown -r now');
				}
			}
		}
	}
);

// On exit
process.on('SIGINT', () => {
    updateSQL("pi_off");
});
