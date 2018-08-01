<?php
define('DBHost', '');
define('DBName', '');
define('DBUser', '');
define('DBPassword', '');

define('API_KEY', '');
define('API_TOKEN', '');

require(dirname(__FILE__) . "/PDO.class.php");

$DB = new Db(DBHost, DBName, DBUser, DBPassword);
?>
