function addCSS(href, rel = "stylesheet") {

    var link = document.createElement("link");
    link.href = href;
    link.type = "text/css";
    link.rel = rel;
    link.media = "screen,print";
    link.crossOrigin = 'crossorigin';

    document.getElementsByTagName("head")[0].appendChild(link);
}

function addJS(src) {
    var script = document.createElement('script');
    script.src = src;
    document.getElementsByTagName("head")[0].appendChild(script);
}

function loadFile(path) {
    return new Promise((resolve, reject) => {
        fetch(path).then(async data => {
            if (data.ok) {
                const content = await data.text();

                resolve({
                    lastModified: data.headers.get('Last-Modified'),
                    content: content
                });
            }
            else
                reject("No file")
        })

    })
}

function loadMarkdown(path) {
    var converter = new showdown.Converter();
    return loadFile(path).then(data => {
        return { ...data, content: converter.makeHtml(data.content) }
    });
}

addJS("https://cdn.jsdelivr.net/npm/showdown@2.1.0/dist/showdown.min.js");

addCSS("/src/styles.css");
addCSS("https://fonts.googleapis.com", "preconnect");
addCSS("https://fonts.gstatic.com", "preconnect");
addCSS("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap");

async function loadContent(dir) {
    var missedIndex = false;
    var counter = 1;
    var container = document.createElement("div");
    container.className = "container"
    while (!missedIndex) {
        try {
            const data = await loadMarkdown(`${dir}/${counter}.md`).catch(err => missedIndex = true);//.then(md => document.body.innerHTML += `<hr><br>${md}<hr>`);
            console.log(data)
            if (!missedIndex) {
                var el = document.createElement("div");
                el.innerHTML = `<hr>#<b>${counter}</b> - ${data.lastModified}<br/>${data.content}`
                container.prepend(el)
            }
            console.log("loaded", counter)
        } catch {

            missedIndex = true;
        }
        counter += 1;
    }
    document.body.appendChild(container);
    console.log("Finished loading content");
}

function init() {
    loadContent("/demo/blog/content/feed");
}


window.addEventListener('load', init);