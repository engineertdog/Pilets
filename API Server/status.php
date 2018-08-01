<?php
require(dirname(__FILE__) . "/src/config.php");
$return = false;

if (isset($_REQUEST['api_key'], $_REQUEST['api_token'])) {
	if (($_REQUEST['api_key'] == API_KEY) && ($_REQUEST['api_token'] == API_TOKEN)) {
		$sql = $DB->query("SELECT * FROM outlets");

		if ($sql !== 0) {
			$return = $sql;
		} else {
			$return = "No data";
		}
	}
}

echo json_encode($return);
$DB->CloseConnection;
?>