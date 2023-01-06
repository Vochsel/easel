<?php
// Can be overided locally
$VERSION = "latest";
// phpinfo();

function isLocalhost($whitelist = ['127.0.0.1', '::1'])
{
    return in_array($_SERVER['REMOTE_ADDR'], $whitelist);
}

$CDN_PREFIX = "../../";

if (!isLocalhost()) {
    // Moving to latest to improve testing time
    $CDN_PREFIX = "https://cdn.jsdelivr.net/gh/vochsel/easel@$VERSION/";
}

function getRemote($source, $dest)
{
    if (isLocalhost()) {
        $remote_contents = file_get_contents($source, true);

        if (file_put_contents($dest, $remote_contents, LOCK_EX)) {
            // echo "File downloaded successfully";
        } else {
            // echo "File downloading failed.";
        }
    } else {
        // $url = "https://cdn.jsdelivr.net/gh/vochsel/easel/src/easel.php";

        $curl = curl_init($source);
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        $remoteContents = curl_exec($curl);
        if (file_put_contents($dest, $remoteContents, LOCK_EX)) {
            // echo "File downloaded successfully";
        } else {
            // echo "File downloading failed.";
        }
    }
}

getRemote("{$CDN_PREFIX}server/common.php", "./common.php");
getRemote("{$CDN_PREFIX}server/api.php", "./api.php");

// Require

require_once("common.php");

?>