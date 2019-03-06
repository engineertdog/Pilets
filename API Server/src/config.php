<?php
// MySQL Connection info.
define('DBHost', '');
define('DBName', '');
define('DBUser', '');
define('DBPassword', '');

// API Key and Token to be used in the app.
define('API_KEY', '');
define('API_TOKEN', '');

// PDO Class file.
require(dirname(__FILE__) . "/PDO.class.php");

$DB = new Db(DBHost, DBName, DBUser, DBPassword);
?>
