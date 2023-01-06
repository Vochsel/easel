<?php


// Download/copy common.php

// $url = "https://cdn.jsdelivr.net/gh/vochsel/easel/src/easel.php";

// $curl = curl_init($url);
// curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);

// $remoteContents = curl_exec($curl);
$remoteContents_api = file_get_contents("../../server/api.php", true);
$remoteContents_com = file_get_contents("../../server/common.php", true);

if (file_put_contents( "./api.php", $remoteContents_api, LOCK_EX)) {
    // echo "File downloaded successfully";
} else {
    // echo "File downloading failed.";
}

if (file_put_contents( "./common.php", $remoteContents_com, LOCK_EX)) {
    // echo "File downloaded successfully";
} else {
    // echo "File downloading failed.";
}
// Require

require_once("common.php");

?>
