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

function createOrGetElement(id) {

    var element = document.getElementById(id);

    if (!element) {
        element = document.createElement("div");
        element.id = id;
        document.body.appendChild(element);
    }

    return element;
}

function elementExists(id) {
    return document.getElementById(id) !== null;
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

function appendEaselFooter() {
    var el = document.createElement("div");
    el.id = "footer";
    el.innerHTML = "Created on <a target='_blank' href='https://github.com/Vochsel/easel'>Easel</a>"
    document.body.appendChild(el)
}

async function loadEaselJSON(dir) {
    const metadata = await fetch(dir + "easel.json").then(data => data.json()).catch(x => null);

    if (!metadata) return;

    var profile = createOrGetElement("profile");

    profile.innerHTML = `
    <img class='profilePicture' src='${metadata.profilePicture}' width='75' height='75'/>
    <span id='name'>${metadata.name}</span>
    <span id='handle'>@${metadata.handle}</span>
    <div id='description'>${metadata.description}</div>
    `

    document.body.prepend(profile);

}

async function loadContent(dir) {
    var missedIndex = false;
    var counter = 1;
    var container = createOrGetElement("container");

    while (!missedIndex) {
        try {
            const data = await loadMarkdown(`${dir}/${counter}.md`).catch(err => missedIndex = true);//.then(md => document.body.innerHTML += `<hr><br>${md}<hr>`);
            console.log(data)
            if (!missedIndex) {
                var d = new Date(data.lastModified);
                var df = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }) //weekday: 'long',

                var el = document.createElement("div");
                el.className = "item";
                el.innerHTML = `
                <hr>#<b>${counter}</b> - ${df}
                <div class='content'>${data.content}</div>
                `
                container.prepend(el)
            }
            console.log("loaded", counter)
        } catch {

            missedIndex = true;
        }
        counter += 1;
    }
    console.log("Finished loading content");
}

function init() {
    loadEaselJSON(location.pathname)
    loadContent(location.pathname + "/content/feed");

    if (!elementExists("footer")) {
        appendEaselFooter();
    }
}


window.addEventListener('load', init);