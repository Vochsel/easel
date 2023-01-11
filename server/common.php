<?php

// Open profile manifest
$easel_metadata_file = fopen("./easel.json", 'r');

$filesize = filesize("./easel.json");
$easel_metadata_text = fread($easel_metadata_file, $filesize);
fclose($easel_metadata_file);

$metadata = json_decode($easel_metadata_text);
$metadata_JSON = json_encode($metadata);

?>


<script src="<?php echo $CDN_PREFIX ?>dist/bundle.js"></script>
<link href="<?php echo $CDN_PREFIX ?>src/styles.css" type="text/css" rel="stylesheet" crossorigin="crossorigin">

<script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
<link href="https://fonts.googleapis.com" type="text/css" rel="preconnect" crossorigin="crossorigin">
<link href="https://fonts.gstatic.com" type="text/css" rel="preconnect" crossorigin="crossorigin">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&amp;display=swap" type="text/css"
    rel="stylesheet" crossorigin="crossorigin">

<script>
    console.log("Easel - PHP");
    const metadata = <?php echo $metadata_JSON; ?>

        function init() {
            setupPage(metadata)
        }

    window.addEventListener('load', init);
</script>

<title>
    <?php echo $metadata->{'name'} . " - @" . $metadata->{'handle'} ?>
</title>

<meta property="og:title" content="<?php echo $metadata->{'name'} . " - @" . $metadata->{'handle'} ?>" />
<meta property="og:image" content="<?php echo $metadata->{'headerPicture'} ?>" />
<meta property="og:description" content="<?php echo $metadata->{'description'} ?>" />

<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="apple-mobile-web-app-status-bar-style" content="default"/>
<meta name="theme-color" content="#ffffff">
<link rel="apple-touch-icon" href="<?php echo $metadata->{'profilePicture'} ?>"/>
<meta name="apple-touch-fullscreen" content="yes"/>