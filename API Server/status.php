<?php
require(dirname(__FILE__) . "/src/config.php");
$return = false;

// Check the API Key and API Token are set.
if (isset($_REQUEST['api_key'], $_REQUEST['api_token'])) {
	// Make sure the API Key and API Token are equal to the one in the config file.
	if (($_REQUEST['api_key'] == API_KEY) && ($_REQUEST['api_token'] == API_TOKEN)) {
		// Grab all of the outlet and server info.
		$sql = $DB->query("SELECT * FROM outlets");

		// Make sure there is a result.
		if ($sql !== 0) {
			// Return the result.
			$return = $sql;
		} else {
			// Return a message saying there is no data available.
			$return = "No data";
		}
	}
}

echo json_encode($return);
$DB->CloseConnection;
?>