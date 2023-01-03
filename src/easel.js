console.log("Easel - JS");

function isLocalhost() {
    return (location.hostname === "localhost" || location.hostname === "127.0.0.1")
}

function addCSS(href, rel = "stylesheet") {
    var link = document.createElement("link");
    link.href = href;
    link.type = "text/css";
    link.rel = rel;
    // link.media = "screen,print";
    link.crossOrigin = 'crossorigin';

    document.getElementsByTagName("head")[0].appendChild(link);
}

function addJS(src) {
    var script = document.createElement('script');
    script.src = src;
    document.getElementsByTagName("head")[0].appendChild(script);
}

let CDN_PREFIX = "/";

if (!isLocalhost()) {
    var _script_src = document.currentScript.src;
    CDN_PREFIX = _script_src.substring(0, _script_src.substring(0, _script_src.lastIndexOf("/")).lastIndexOf("/")) + "/"
    console.log("CDN Prefix: ", CDN_PREFIX)
}

// External Deps

addJS("https://cdn.jsdelivr.net/npm/showdown@2.1.0/dist/showdown.min.js");
addJS("https://cdn.jsdelivr.net/gh/travist/jsencrypt/bin/jsencrypt.min.js");

addCSS("https://fonts.googleapis.com", "preconnect");
addCSS("https://fonts.gstatic.com", "preconnect");
addCSS("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap");

// Internal Deps

addJS(CDN_PREFIX + "src/common.js");
addCSS(CDN_PREFIX + "src/styles.css");

// -- JS Frontend

function init() {
    loadEaselJSON(location.pathname).then(metadata => renderProfileHeader(metadata));
    
    loadContent(location.pathname + "/content/feed");

    if (!elementExists("footer")) {
        renderEaselFooter();
    }
}

window.addEventListener('load', init);