
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

function loadManifest(path) {
    return loadFile(path + "/manifest.txt").then(data => data.content.split('\n'));
}

function renderEaselFooter() {
    var el = document.createElement("div");
    el.id = "footer";
    el.innerHTML = "Created on <a target='_blank' href='https://github.com/Vochsel/easel'>Easel</a>"
    document.body.appendChild(el)
}

function renderProfileHeader(metadata) {

    var profile = createOrGetElement("profile");

    profile.innerHTML = `
    <div id='profileHeader'>
        <img id='headerProfile' class='profilePicture' src='${metadata.profilePicture}' width='75' height='75'/>
        <img id='headerPicture' src='${metadata.headerPicture}' />
    </div>
    <span id='name'>${metadata.name}</span>
    <span id='handle'>@${metadata.handle}</span>
    <div id='description'>${metadata.description}</div>
    `

    document.body.prepend(profile);
}

async function loadEaselJSON(dir) {
    return fetch(dir + "easel.json").then(data => data.json()).catch(x => null);

}


function createItem(data, counter, container) {
    // console.log(data)
    var d = new Date(data.lastModified);
    var df = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }) //weekday: 'long',

    var el = document.createElement("div");
    el.className = "item";
    el.innerHTML = `
            <hr>
            <div class='metadata'>#<b>${counter}</b> - ${df}</div>
            <div class='content'>${data.content}</div>
            `
    console.log("loaded", counter)
    return el;

}

function renderItems(items) {
    for (let i = 0; i < items.length; i++) {
        createItem(items[i], i);
    }
}

async function loadContentDynamically(dir) {
    var container = createOrGetElement("container");
    var missedIndex = false;
    var counter = 1;

    while (!missedIndex) {
        const data = await loadMarkdown(`${dir}/${counter}.md`)
            .catch(err => missedIndex = true);

        if (!missedIndex) {
            var el = createItem(data, counter, container)
            container.prepend(el);
        }
        counter += 1;
    }
    console.log("Finished loading content");
}


async function loadContentFromManifest(dir) {
    var container = createOrGetElement("container");
    const files = await loadManifest(dir);
    console.log(files);
    // for(let i = files.length - 1; i >= 0; --i) {
    for (let i = 0; i < files.length; i++) {
        const data = await loadMarkdown(`${dir}/${files[i]}`)
        console.log(data)
        const el = createItem(data, files.length - i)
        container.append(el);
    }
}

async function loadContent(dir) {
    loadContentFromManifest(dir).catch(x => {
        console.log("No manifest.txt found, doing sequential lookup")
        // No manifest found
        loadContentDynamically(dir);
    })
}