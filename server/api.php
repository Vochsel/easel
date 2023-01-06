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

?>

<?php

function rss($dir)
{
    // Open profile manifest
    $easel_metadata_file = fopen("./easel.json", 'r');

    $filesize = filesize("./easel.json");
    $easel_metadata_text = fread($easel_metadata_file, $filesize);
    fclose($easel_metadata_file);

    $metadata = json_decode($easel_metadata_text);
    $metadata_JSON = json_encode($metadata);

    // echo "RSS";
    $rss_file = fopen("./rss.xml", 'w');

    fwrite($rss_file, "");

    fwrite($rss_file, '<?xml version="1.0" encoding="UTF-8" ?>');
    fwrite($rss_file, '<rss version="2.0">');
    fwrite($rss_file, "<channel>");
    fwrite($rss_file, "<title>" . $metadata->{'name'} . " - @" . $metadata->{'handle'} . "</title>");
    fwrite($rss_file, "<link>http://www.vochsel.com/blog/</link>");
    fwrite($rss_file, "<description>Free web building tutorials</description>");

    $manifest_path = $dir . "/manifest.txt";

    // $fileContents = file_get_contents($manifest_path);

    $contents = file($manifest_path);

    foreach ($contents as $line) {
        $file_path = $dir . "/" . $line;
        $file_path = str_replace(array("\r", "\n", ' '), '', $file_path);
        $name = explode(".", $line)[0];
        $author = $metadata->{'handle'};
        $lastModified = date("F d Y H:i:s.", filemtime($file_path));
        // echo "|" . $file_path . "|";
        // echo $dir . "/" . $line . "\n";
        $fileContents = file_get_contents($file_path, true);
        $fileContents = htmlspecialchars($fileContents);
        // $fileContents = file_get_contents($dir . "/" . str_replace(array("\\r", "\\n", ' '), '', $line));
        // echo print_r($fileContents);

        fwrite($rss_file, "<item>");
        fwrite($rss_file, "<title>" . $name . "</title>");
        fwrite($rss_file, "<link>http://www.vochsel.com/blog</link>");

        fwrite($rss_file, "<author>$author</author>");
        fwrite($rss_file, "<description>$fileContents</description>");
        fwrite($rss_file, "<pubDate>$lastModified</pubDate>");
        fwrite($rss_file, "</item>");

    }
    fwrite($rss_file, "</channel>");

    fwrite($rss_file, "</rss>");

    fclose($rss_file);
    echo "Updated RSS";
}

function post($dir, $name, $contents)
{
    $file_path = $dir . "/" . $name;
    // echo $file_path;
    file_put_contents($file_path, $contents);

    $manifest_path = $dir . "/manifest.txt";

    $fileContents = file_get_contents($manifest_path);

    file_put_contents($manifest_path, $name . "\n" . $fileContents);
}

function post_latest($directory, $contents)
{
    $filecount = count(glob($directory . "/*"));

    post($directory, $filecount . ".md", $contents);
}

function edit($dir, $name, $contents)
{
    $file_path = $dir . "/" . $name;
    file_put_contents($file_path, $contents);
    echo "Saved edit";
}

function deleteItem($dir, $name)
{
    $file_path = $dir . "/" . $name;

    // Remove file
    unlink ($file_path);

    // Remove from manifest
    $manifest_path = $dir . "/manifest.txt";

    $fileContents = file_get_contents($manifest_path);
    $fileContents = str_replace($name . "\n", "", $fileContents);

    file_put_contents($manifest_path, $fileContents);

    echo "Deleted item";
}

function upload($dir)
{
    // TODO: make this robust
    if (!file_exists($dir)) {
        mkdir($dir, 0777, true);
    }

    // $target_dir = "uploads/";
    $target_file = $dir . basename($_FILES["upload_media"]["name"]);
    $uploadOk = 1;
    $target_file_extension = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

    if ($uploadOk == 0) {
        echo "Sorry, your file was not uploaded.";
        // if everything is ok, try to upload file
    } else {
        if (move_uploaded_file($_FILES["upload_media"]["tmp_name"], $target_file)) {
            if ($target_file_extension == "glb") {
                post_latest("./content/feed", "<model-viewer
                    src='$target_file' ar shadow-intensity='1' camera-controls
                    touch-action='pan-y'></model-viewer>
                ");
            } else if (in_array($target_file_extension, array("png", "jpg", "webp", "svg", "jpeg", "bmp"))) {
                post_latest("./content/feed", "<img src='$target_file' width='100%' height='100%'/>");
            } else if (in_array($target_file_extension, array("wav", "mp3", "ogg"))) {
                post_latest("./content/feed", "<audio src='$target_file' width='100%' height='100%' controls/>");
            } else if ($target_file_extension == "mp4") {
                post_latest("./content/feed", "<video src='$target_file' width='100%' height='100%' muted autoplay playsInline controls/>");
            }
            echo "The file " . htmlspecialchars(basename($_FILES["upload_media"]["name"])) . " has been uploaded.";
        } else {
            echo "Sorry, there was an error uploading your file.";
        }
    }
}

function update($version)
{
    echo "Updating with version: $version\n";
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

    $_PREFIX = "../../";

    if (!isLocalhost()) {
        // Moving to latest to improve testing time
        $_PREFIX = "https://cdn.jsdelivr.net/gh/vochsel/easel@$version/";
    }


    getRemote("{$_PREFIX}server/api.php", "./api.php");
    getRemote("{$_PREFIX}server/common.php", "./common.php");

    echo "Updated PHP";
}
// print_r($_FILES);

// print_r($_FILES);

// Sync and create rss.xml file
if (isset($_POST['publish_rss']) && $_POST['publish_rss'] != null) {
    rss("./content/feed");
}
if (isset($_POST['update_easel']) && $_POST['update_easel'] != null) {
    update($_POST['update_easel']);
}
if (isset($_POST['has_upload']) && $_POST['has_upload'] != null) {
    upload("uploads/");
}


// TODO: Fix global
$directory = "./content/feed";

if (isset($_POST['new_post']) && $_POST['new_post'] != null) {

    // TODO: make this robust
    if (!file_exists($directory)) {
        mkdir($directory, 0777, true);
        file_put_contents($directory . "/manifest.txt", "");
    }

    post_latest($directory, $_POST['new_post']);
    $_POST = array();
    unset($_POST['new_post']);
}

if (isset($_POST['edit_post']) && $_POST['edit_post'] != null) {
    $new_content = $_POST['edit_post'];
    $source_name = $_POST['source'];
    edit($directory, $source_name, $new_content);
}

if (isset($_POST['delete_post']) && $_POST['delete_post'] != null) {
    $source_name = $_POST['delete_post'];
    deleteItem($directory, $source_name);
}
?>