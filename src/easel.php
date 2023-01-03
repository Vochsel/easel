<?php

function isLocalhost($whitelist = ['127.0.0.1', '::1'])
{
    return in_array($_SERVER['REMOTE_ADDR'], $whitelist);
}

$CDN_PREFIX = "../../";

if (!isLocalhost()) {
    $CDN_PREFIX = "https://cdn.jsdelivr.net/gh/vochsel/easel@0.0.6/";
}

?>

<!-- <script src="https://cdn.jsdelivr.net/gh/vochsel/easel/src/easel.js"></script> -->
<script src="<?php echo $CDN_PREFIX ?>src/common.js"></script>
<link href="<?php echo $CDN_PREFIX ?>src/styles.css" type="text/css" rel="stylesheet" crossorigin="crossorigin">


<script src="https://cdn.jsdelivr.net/npm/showdown@2.1.0/dist/showdown.min.js"></script>
<link href="https://fonts.googleapis.com" type="text/css" rel="preconnect" crossorigin="crossorigin">
<link href="https://fonts.gstatic.com" type="text/css" rel="preconnect" crossorigin="crossorigin">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&amp;display=swap" type="text/css"
    rel="stylesheet" crossorigin="crossorigin">

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

// Dynamically load items...
$items = array_slice(scandir("./content/feed"), 2);

$content = array();

foreach ($items as $item) {
    // echo "./content/feed/" . $item;
    $item_contents = file_get_contents("./content/feed/" . $item);
    // echo $item_contents;
    array_push($content, $item_contents);
}

$content_JSON = json_encode($content, JSON_HEX_TAG);

?>

<script>

    function init() {
        const metadata = <?php echo $metadata_JSON; ?>

        const items = <?php echo $content_JSON; ?>;
        renderProfileHeader(metadata);
        // renderItems(items)
        loadContent(location.pathname + "/content/feed");

        if (!elementExists("footer")) {
            renderEaselFooter();
        }
    }


    window.addEventListener('load', init);
</script>

<title>
    <?php echo $metadata->{'name'} . " - @" . $metadata->{'handle'} ?>
</title>