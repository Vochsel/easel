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
    global $metadata;
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
            //   echo "The file ". htmlspecialchars( basename( $_FILES["upload_media"]["name"])). " has been uploaded.";
        } else {
            //   echo "Sorry, there was an error uploading your file.";
        }
    }
}

function update()
{
    // It seems not all installations of php can file_get_contents from url...
    // This does assume that curl binaries are installed, which doesnt seem to be the case on windows
    // global $CDN_PREFIX;
    $url = "https://cdn.jsdelivr.net/gh/vochsel/easel/src/easel.php";

    // $curlSession = curl_init();
    // curl_setopt($curlSession, CURLOPT_URL, $url);
    // curl_setopt($curlSession, CURLOPT_BINARYTRANSFER, true);
    // curl_setopt($curlSession, CURLOPT_RETURNTRANSFER, true);
    // curl_setopt($curlSession, CURLOPT_FOLLOWLOCATION, true);

    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);

    $remoteContents = curl_exec($curl);
    // echo $remoteContents;

    $local = "./easel.php";
    // echo $url . " -> " . $local;
    if (file_put_contents($local, $remoteContents, LOCK_EX)) {
        // echo "File downloaded successfully";
    } else {
        // echo "File downloading failed.";
    }

}
// print_r($_FILES);

// print_r($_FILES);

// Sync and create rss.xml file
if (isset($_POST['publish_rss']) && $_POST['publish_rss'] != null) {
    rss("./content/feed");
}
if (isset($_POST['update_easel']) && $_POST['update_easel'] != null) {
    update();
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
?>

