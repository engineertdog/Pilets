<?php
require(dirname(__FILE__) . "/src/config.php");
$return = false;

// Check the API Key and API Token are set.
if (isset($_REQUEST['api_key'], $_REQUEST['api_token'])) {
	// Make sure the API Key and API Token are equal to the one in the config file.
	if (($_REQUEST['api_key'] == API_KEY) && ($_REQUEST['api_token'] == API_TOKEN)) {
		// Try to perform the query sent to the server.
		if ($DB->query("UPDATE outlets SET command = ? WHERE id = ?", array($_REQUEST["command"], $_REQUEST["id"])) == 1) {
			// Grab all of the outlet and server info and return it to update the app.
			$return = $DB->query("SELECT * FROM outlets");
		} else {
			// Return a message saying the update couldn't be performed.
			$return = "Bad update";
		}
	}
}

echo json_encode($return);
$DB->CloseConnection;
?>