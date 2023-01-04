<?php
$VERSION = "0.0.14";
?>

<?php

function isLocalhost($whitelist = ['127.0.0.1', '::1'])
{
    return in_array($_SERVER['REMOTE_ADDR'], $whitelist);
}

$CDN_PREFIX = "../../";

if (!isLocalhost()) {
    $CDN_PREFIX = "https://cdn.jsdelivr.net/gh/vochsel/easel@$VERSION/";
}

?>

<?php

// Open profile manifest
$easel_metadata_file = fopen("./easel.json", 'r');

$filesize = filesize("./easel.json");
$easel_metadata_text = fread($easel_metadata_file, $filesize);
fclose($easel_metadata_file);

$metadata = json_decode($easel_metadata_text);
$metadata_JSON = json_encode($metadata);

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

function update()
{
    global $CDN_PREFIX;

    $url = "{$CDN_PREFIX}src/easel.php";
    $local = "./easel.php";
    // echo $url . " -> " . $local;
    if (file_put_contents($local, file_get_contents($url))) {
        // echo "File downloaded successfully";
    } else {
        // echo "File downloading failed.";
    }
}

// Sync and create rss.xml file
if (isset($_POST['publish_rss']) && $_POST['publish_rss'] != null) {
    rss("./content/feed");
}
// print_r($_POST);
if (isset($_POST['update_easel']) && $_POST['update_easel'] != null) {
    update();
}

if (isset($_POST['new_post']) && $_POST['new_post'] != null) {
    $directory = "./content/feed";

    // TODO: make this robust
    if (!file_exists($directory)) {
        mkdir($directory, 0777, true);
        file_put_contents($directory . "/manifest.txt", "");
    }

    $filecount = count(glob($directory . "/*"));

    post($directory, $filecount . ".md", $_POST['new_post']);
    $_POST = array();
    unset($_POST['new_post']);
}
?>


<script src="<?php echo $CDN_PREFIX ?>src/common.js"></script>
<link href="<?php echo $CDN_PREFIX ?>src/styles.css" type="text/css" rel="stylesheet" crossorigin="crossorigin">

<script src="https://cdn.jsdelivr.net/npm/showdown@2.1.0/dist/showdown.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/travist/jsencrypt/bin/jsencrypt.min.js"></script>
<link href="https://fonts.googleapis.com" type="text/css" rel="preconnect" crossorigin="crossorigin">
<link href="https://fonts.gstatic.com" type="text/css" rel="preconnect" crossorigin="crossorigin">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&amp;display=swap" type="text/css"
    rel="stylesheet" crossorigin="crossorigin">

<script>
    console.log("Easel - PHP");
    const metadata = <?php echo $metadata_JSON; ?>

        function init() {

            renderProfileHeader(metadata);
            renderNav();
            // renderItems(items)
            loadContent(location.pathname + "content/feed");

            if (!elementExists("footer")) {
                renderEaselFooter();
            }
        }

    window.addEventListener('load', init);
</script>

<title>
    <?php echo $metadata->{'name'} . " - @" . $metadata->{'handle'} ?>
</title>

<meta property="og:title" content="<?php echo $metadata->{'name'} . " - @" . $metadata->{'handle'} ?>" />
<meta property="og:image" content="<?php echo $metadata->{'headerPicture'} ?>" />
<meta property="og:description" content="<?php echo $metadata->{'description'} ?>" />