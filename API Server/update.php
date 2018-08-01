<?php
require(dirname(__FILE__) . "/src/config.php");
$return = false;

if (isset($_REQUEST['api_key'], $_REQUEST['api_token'])) {
	if (($_REQUEST['api_key'] == API_KEY) && ($_REQUEST['api_token'] == API_TOKEN)) {
		if ($DB->query("UPDATE outlets SET command = ? WHERE id = ?", array($_REQUEST["command"], $_REQUEST["id"])) == 1) {
			$return = $DB->query("SELECT * FROM outlets");
		} else {
			$return = "Bad update";
		}
	}
}

echo json_encode($return);
$DB->CloseConnection;
?>