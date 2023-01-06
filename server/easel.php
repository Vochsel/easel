<?php
// Can be overided locally
$VERSION = "latest";

if (file_exists("./current_version.txt"))
    $VERSION = file_get_contents("./current_version.txt");

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

        $curl = curl_init();

        $fp = fopen($dest, "w+");
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($curl, CURLOPT_FILE, $fp);
        curl_setopt($curl, CURLOPT_URL, $source);
        curl_exec($curl);
        curl_close($curl);
        fclose($fp);
    }
}

// Always pull in development, only pull if first run on prod
if (isLocalhost() || !file_exists("./common.php"))
    getRemote("{$CDN_PREFIX}server/common.php", "./common.php");
if (isLocalhost() || !file_exists("./api.php"))
    getRemote("{$CDN_PREFIX}server/api.php", "./api.php");

// Require

require_once("common.php");

?>