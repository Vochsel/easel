<?php
session_start();

// Can be overided locally
$VERSION = "latest";

// phpinfo();

if (file_exists("./current_version.txt"))
    $VERSION = file_get_contents("./current_version.txt");

function isLocalhost($whitelist = ['127.0.0.1', '::1'])
{
    return in_array($_SERVER['REMOTE_ADDR'], $whitelist);
}

function getCurrentURL()
{
    // date_default_timezone_set();
    if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on')
        $url = "https://";
    else
        $url = "http://";
    // Append the host(domain name, ip) to the URL.   
    $url .= $_SERVER['HTTP_HOST'];

    // Append the requested resource location to the URL   
    $url .= $_SERVER['REQUEST_URI'];

    $url = str_replace("api.php", '', $url);

    return $url;
}

$CDN_PREFIX = "../../";

if (!isLocalhost()) {
    // Moving to latest to improve testing time
    $CDN_PREFIX = "https://cdn.jsdelivr.net/gh/vochsel/easel@$VERSION/";
}

?>

<?php
// TODO: This needs to be made more extensible
function convert_urls_to_hyperlinks($string)
{
    $url = '~(?!.*(youtube\.(com|it|fr|co\.uk|de|es|ru|in|com\.au|jp|cn)))(?:(https?)://([^\s<]+)|(www\.[^\s<]+?\.[^\s<]+))(?<![\.,:])~i';
    $string = preg_replace($url, '<a href="$0" target="_blank" title="$0">$0</a>', $string);
    return $string;
}
function convert_youtube_to_embed($string)
{
    return preg_replace("/\s*[a-zA-Z\/\/:\.]*youtube.com\/watch\?v=([a-zA-Z0-9\-_]+)([a-zA-Z0-9\/\*\-\_\?\&\;\%\=\.]*)/i", "<iframe width=\"420\" height=\"315\" src=\"//www.youtube.com/embed/$1\" frameborder=\"0\" allowfullscreen></iframe>", $string);
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

    fwrite($rss_file, '<?xml version="1.0" encoding="UTF-8"?>');
    fwrite($rss_file, '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">');
    fwrite($rss_file, "<channel>");
    fwrite($rss_file, "<title>" . $metadata->{'name'} . " - @" . $metadata->{'handle'} . "</title>");
    fwrite($rss_file, "<link>" . getCurrentURL() . "</link>");
    fwrite($rss_file, "<description>" . htmlspecialchars($metadata->{'description'}) . "</description>");

    $manifest_path = $dir . "/manifest.txt";

    // $fileContents = file_get_contents($manifest_path);

    $contents = file($manifest_path);

    foreach ($contents as $line) {
        $file_path = $dir . "/" . $line;
        $file_path = str_replace(array("\r", "\n", ' '), '', $file_path);
        $name = explode(".", $line)[0];
        $author = $metadata->{'handle'};
        $lastModified = date("r", filemtime($file_path));
        // echo "|" . $file_path . "|";
        // echo $dir . "/" . $line . "\n";
        $fileContents = file_get_contents($file_path, true);
        $fileContents = htmlspecialchars($fileContents);
        // $fileContents = file_get_contents($dir . "/" . str_replace(array("\\r", "\\n", ' '), '', $line));
        // echo print_r($fileContents);

        $post_abs_url = getCurrentURL() . substr($file_path, 2);

        fwrite($rss_file, "<item>");
        fwrite($rss_file, "<title>" . $name . "</title>");
        fwrite($rss_file, "<link>$post_abs_url</link>");
        fwrite($rss_file, "<guid isPermaLink='true'>$post_abs_url</guid>");

        // fwrite($rss_file, "<author>$author</author>"); // Needs to be an email?
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

    // $contents = convert_urls_to_hyperlinks($contents);
    // $contents = convert_youtube_to_embed($contents);
    file_put_contents($file_path, $contents);

    $manifest_path = $dir . "/manifest.txt";

    $fileContents = file_get_contents($manifest_path);

    file_put_contents($manifest_path, $name . "\n" . $fileContents);
}

function post_latest($directory, $contents)
{

    $files = glob($directory . "/**.md");

    //Put each file name into an array called $filenames
    foreach($files as $i => $file) $filenames[$i] = basename($file);

    //Sort $filenames
    rsort($filenames, SORT_NUMERIC );
    $fn = (int) filter_var($filenames[0], FILTER_SANITIZE_NUMBER_INT);
    $fn += 1;

    post($directory, $fn . ".md", $contents);
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
    unlink($file_path);

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

    $file_url = getCurrentURL() . $target_file;

    if ($uploadOk == 0) {
        echo "Sorry, your file was not uploaded.";
        // if everything is ok, try to upload file
    } else {
        if (move_uploaded_file($_FILES["upload_media"]["tmp_name"], $target_file)) {
            if ($target_file_extension == "glb") {
                post_latest("./content/feed", "<model-viewer class='media'
                    src='$file_url' ar shadow-intensity='1' camera-controls
                    touch-action='pan-y'></model-viewer>
                ");
            } else if (in_array($target_file_extension, array("png", "jpg", "webp", "svg", "jpeg", "bmp"))) {
                post_latest("./content/feed", "<img class='media' src='$file_url' width='100%' height='100%'/>");
            } else if (in_array($target_file_extension, array("wav", "mp3", "ogg"))) {
                post_latest("./content/feed", "<audio class='media' src='$file_url' width='100%' height='100%' controls/>");
            } else if ($target_file_extension == "mp4") {
                post_latest("./content/feed", "<video class='media' src='$file_url' width='100%' height='100%' muted autoplay playsInline controls/>");
            }
            echo "The file " . htmlspecialchars(basename($_FILES["upload_media"]["name"])) . " has been uploaded.";
        } else {
            echo "Sorry, there was an error uploading your file.";
        }
    }
}

function update($version)
{
    if ($version == "null")
        return;
    echo "Updating with version: $version\n";

    // TODO: move to .easel/
    file_put_contents("current_version.txt", $version);

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

function login($signature)
{
    // var_dump(extension_loaded('openssl'));

    // Open profile manifest
    $easel_metadata_file = fopen("./easel.json", 'r');

    $filesize = filesize("./easel.json");
    $easel_metadata_text = fread($easel_metadata_file, $filesize);
    fclose($easel_metadata_file);

    $metadata = json_decode($easel_metadata_text);

    $public_key = $metadata->{'publicKey'};
    $sig64 = base64_decode($signature);
    $result = openssl_verify("easel", $sig64, $public_key, OPENSSL_ALGO_SHA256);

    if($result == 1) {
        // Succesful login
        $_SESSION['logged_in'] = true;
        $_SESSION['metadata'] = $metadata;
        
        $output = new stdClass();
        $output->result = isset($_SESSION['logged_in']) || !$_SESSION['logged_in'];
        echo json_encode($output);

    } else {
        // Cancel
        $_SESSION['logged_in'] = false;
        die("Invalid login");
    }
}

function logout()
{
    $_SESSION['logged_in'] = false;
    unset($_SESSION["logged_in"]);

    $output = new stdClass();
    $output->result = true;
    echo json_encode($output);
}
?>

<?php

// -- Auth endpoints

if (isset($_POST['login']) && $_POST['login'] != null) {
    login($_POST['login']);
}

if (isset($_POST['logout']) && $_POST['logout'] != null) {
    logout();
}

if (isset($_POST['is_logged_in']) && $_POST['is_logged_in'] != null) {
    $output = new stdClass();
    $output->result = isset($_SESSION['logged_in']) && $_SESSION['logged_in'];
    echo json_encode($output);
}

// Restrict access to other endpoints

if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in'])
    die();

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